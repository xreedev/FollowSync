/* ================= ENGINE: stage, scenes, dialogue, clock, audio ================= */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const G=window.G={W:1280,H:720,t:0,scene:null,time:630,keys:{},ptr:{x:640,y:360,down:false},bubbles:[],speaker:null,typing:false,
  fade:0,fadeTo:0,fadeMs:0,shake:0,log:[],dev:/[?&]dev=1/.test(location.search),muted:false,paused:false,tint:null,hintText:"",
  state:null,devPicks:[],busy:0};
const cv=$("cv"),ctx=cv.getContext("2d");
G.ctx=ctx;G.cv=cv;G.$=$;

/* ---------- sizing ---------- */
function resize(){
  const w=innerWidth,h=innerHeight;let sw,sh;
  if(w/h>16/9){sh=h;sw=h*16/9}else{sw=w;sh=w*9/16}
  const st=$("stage");st.style.width=sw+"px";st.style.height=sh+"px";st.style.setProperty("--u",(sw/1280)+"px");
  G.dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.round(sw*G.dpr);cv.height=Math.round(sh*G.dpr);G.k=cv.width/1280;G.cssK=sw/1280;
}
addEventListener("resize",resize);

/* ---------- utilities ---------- */
G.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
G.lerp=(a,b,t)=>a+(b-a)*t;
G.ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
G.rand=(a,b)=>a+Math.random()*(b-a);
G.wait=ms=>new Promise(r=>setTimeout(r,G.dev?Math.min(ms,25):ms));
G.until=fn=>new Promise(r=>{const i=setInterval(()=>{if(fn()){clearInterval(i);r()}},30)});
G.fmt=m=>{m=Math.round(m);let h=Math.floor(m/60)%24,mm=m%60,ap=h>=12?"PM":"AM";let h12=h%12||12;return h12+":"+String(mm).padStart(2,"0")+" "+ap};
G.setTime=(h,m=0)=>{G.time=h*60+m};
G.runTime=(to,ms)=>new Promise(res=>{const from=G.time,t0=performance.now(),d=G.dev?30:ms;
  (function s(){const p=G.clamp((performance.now()-t0)/d,0,1);G.time=from+(to-from)*p;if(p<1)requestAnimationFrame(s);else{G.time=to;res()}})()});

/* ---------- scenes ---------- */
G.go=async function(scene,o={}){
  const ms=o.fade===0?0:(o.fade||450);
  if(G.scene&&ms){await G.fadeOut(ms)}
  if(G.scene&&G.scene.exit)G.scene.exit();
  G.bubbles.length=0;G.scene=scene;if(scene.enter)scene.enter(o);
  if(ms)await G.fadeIn(ms);
};
G.fadeOut=ms=>new Promise(r=>{G.fadeTo=1;if(G.fade>=1){r();return}G.fadeMs=G.dev?30:ms;G._fr=r});
G.fadeIn=ms=>new Promise(r=>{G.fadeTo=0;if(G.fade<=0){r();return}G.fadeMs=G.dev?30:ms;G._fr=r});

/* ---------- bubbles (speech over actors) ---------- */
G.bubble=(actor,text,ms=2600,o={})=>{
  G.bubbles=G.bubbles.filter(b=>b.actor!==actor);
  const b={actor,text,until:performance.now()+(G.dev?ms*.1:ms),style:o.style||"say"};G.bubbles.push(b);return b;
};
G.clearBubbles=()=>{G.bubbles.length=0};
G.drawBubbles=function(g){
  const now=performance.now();G.bubbles=G.bubbles.filter(b=>b.until>now);
  for(const b of G.bubbles){
    const a=b.actor;const x=a.bx!=null?a.bx:a.x,y=a.by!=null?a.by:a.y-300;
    g.save();g.font="600 22px 'Segoe UI',system-ui,sans-serif";
    const words=b.text.split(" "),lines=[];let cur="";
    for(const w of words){const t=cur?cur+" "+w:w;if(g.measureText(t).width>300&&cur){lines.push(cur);cur=w}else cur=t}lines.push(cur);
    const tw=Math.max(...lines.map(l=>g.measureText(l).width)),bw=tw+34,bh=lines.length*28+22;
    let bx=G.clamp(x-bw/2,14,1280-bw-14),by=y-bh-22;if(by<10)by=10;
    const fade=Math.min(1,(b.until-now)/250);g.globalAlpha=fade;
    g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.roundRect(bx+3,by+5,bw,bh,18);g.fill();
    g.fillStyle=b.style=="think"?"#eef3ff":"#fff";g.beginPath();g.roundRect(bx,by,bw,bh,18);g.fill();
    g.beginPath();const tx=G.clamp(x,bx+24,bx+bw-24);g.moveTo(tx-9,by+bh-1);g.lineTo(tx+9,by+bh-1);g.lineTo(x,by+bh+18);g.closePath();g.fill();
    g.fillStyle="#1b1f2a";g.textBaseline="top";g.textAlign="left";lines.forEach((l,i)=>g.fillText(l,bx+17,by+11+i*28));
    g.restore();
  }
};

/* ---------- dialogue ---------- */
const COL={DEVIKA:"#ff9db8",SREEDEV:"#ffd166",NAVYA:"#b9a2ff","HER BROTHER":"#7be0b0",BROTHER:"#7be0b0",NARRATOR:"#aab3c2",VENDOR:"#ffb27a"};
G.COL=COL;
let curSay=null;
G.say=function(who,text,o={}){
  return new Promise(res=>{
    G.log.push((who||"—")+": "+text);
    if(G.dev){G.speaker=who;setTimeout(res,12);return}
    const d=$("dlg");d.classList.add("on");$("choices").classList.remove("on");
    const nar=!who||who==="NARRATOR";
    $("who").textContent=nar?"":who;$("portw").style.display=nar?"none":"block";d.style.paddingLeft=nar?"calc(var(--u)*34)":"";
    d.style.setProperty("--pc",COL[who]||"#fff");$("txt").className=nar?"nar":"";
    if(!nar&&G.drawPortrait)G.drawPortrait($("port"),who,o.expr||"neutral");
    G.speaker=nar?null:who;
    curSay={full:text,i:0,res,done:false,chars:[...text]};G.typing=true;$("txt").textContent="";$("more").style.visibility="hidden";
  });
};
G.hideDlg=()=>{$("dlg").classList.remove("on");G.speaker=null;G.typing=false;curSay=null};
function advance(){
  if(!curSay)return;
  if(!curSay.done){curSay.i=curSay.chars.length;$("txt").textContent=curSay.full;curSay.done=true;G.typing=false;$("more").style.visibility="visible";return}
  const r=curSay.res;curSay=null;G.speaker=null;$("dlg").classList.remove("on");r();
}
$("dlg").addEventListener("pointerdown",e=>{e.stopPropagation();advance();A.init()});
function typeTick(dt){
  if(!curSay||curSay.done)return;
  curSay.i+=dt*58;const n=Math.floor(curSay.i);
  if(n>=curSay.chars.length){curSay.done=true;G.typing=false;$("txt").textContent=curSay.full;$("more").style.visibility="visible"}
  else{const prev=$("txt").textContent.length;$("txt").textContent=curSay.chars.slice(0,n).join("");if(n!==prev&&n%3==0)A.tick()}
}
G.narrate=(t)=>G.say(null,t);

/* ---------- choices ---------- */
G.choose=function(prompt,opts){
  return new Promise(res=>{
    opts=opts.map(o=>typeof o==="string"?{t:o}:o);
    if(G.dev){const p=G.devPicks.length?G.devPicks.shift():0;G.log.push("CHOICE "+prompt+" → "+opts[p%opts.length].t);setTimeout(()=>res(p%opts.length),12);return}
    $("dlg").classList.remove("on");$("cprompt").textContent=prompt;const l=$("clist");l.innerHTML="";
    opts.forEach((o,i)=>{const b=document.createElement("button");b.className="cbtn";b.innerHTML=`<kbd>${i+1}</kbd>${o.t}${o.s?`<small>${o.s}</small>`:""}`;
      b.onclick=ev=>{ev.stopPropagation();pick(i)};l.appendChild(b)});
    $("choices").classList.add("on");G._choice={opts,res};
    function pick(i){$("choices").classList.remove("on");G._choice=null;A.sfx("click");res(i)}
    G._pick=pick;
  });
};

/* ---------- hint / toast / card ---------- */
G.hint=t=>{const h=$("hint");if(t){h.textContent=t;h.classList.add("on")}else h.classList.remove("on")};
let toastT=0;G.toast=(t,ms=2200)=>{const e=$("toast");e.textContent=t;e.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove("on"),G.dev?100:ms)};
G.card=function(k,h,t){
  return new Promise(res=>{
    if(G.dev){G.log.push("== "+k+": "+h+" ("+t+")");setTimeout(res,15);return}
    $("ck").textContent=k;$("ch").textContent=h;$("ct").textContent=t;const c=$("card");c.classList.add("on");
    let done=false;const fin=()=>{if(done)return;done=true;c.classList.remove("on");res()};
    c.onclick=fin;setTimeout(fin,3600);A.sfx("card");
  });
};
G.chapter=(n,title)=>{$("chap").textContent=n?("Chapter "+n+" · "+title):title};

/* ---------- input ---------- */
function lp(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*1280,y:(e.clientY-r.top)/r.height*720}}
cv.addEventListener("pointerdown",e=>{A.init();const p=lp(e);G.ptr.x=p.x;G.ptr.y=p.y;G.ptr.down=true;if(curSay){advance();return}
  if(G.scene&&G.scene.click&&!G.paused)G.scene.click(p.x,p.y,e)});
addEventListener("pointerup",()=>{G.ptr.down=false;if(G.scene&&G.scene.up)G.scene.up()});
cv.addEventListener("pointermove",e=>{const p=lp(e);G.ptr.x=p.x;G.ptr.y=p.y;if(G.scene&&G.scene.move)G.scene.move(p.x,p.y)});
addEventListener("keydown",e=>{
  const k=e.key;
  if(/INPUT|TEXTAREA/.test(e.target.tagName)){return}
  G.keys[k.toLowerCase()]=true;A.init();
  if(k==="Enter"||k===" "||k==="ArrowRight"&&curSay){if(curSay){advance();e.preventDefault();return}}
  if(G._choice&&/^[1-9]$/.test(k)){const i=+k-1;if(i<G._choice.opts.length){G._pick(i);e.preventDefault()}return}
  if(k.toLowerCase()==="m"&&!G.paused){A.toggle();return}
  if(G.scene&&G.scene.key)G.scene.key(e);
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(k))e.preventDefault();
});
addEventListener("keyup",e=>{G.keys[e.key.toLowerCase()]=false;if(G.scene&&G.scene.keyup)G.scene.keyup(e)});
G.down=(...ks)=>ks.some(k=>G.keys[k]);

/* ---------- main loop ---------- */
let last=performance.now();
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;G.t+=dt;
  typeTick(dt);
  if(G.scene&&!G.paused){if(G.scene.update)G.scene.update(dt)}
  // fade
  if(G.fade!==G.fadeTo){const sp=dt*1000/Math.max(1,G.fadeMs);G.fade+=Math.sign(G.fadeTo-G.fade)*sp;if(Math.abs(G.fade-G.fadeTo)<=sp){G.fade=G.fadeTo;if(G._fr){const r=G._fr;G._fr=null;r()}}}
  if(G.shake>0)G.shake=Math.max(0,G.shake-dt*2);
  ctx.setTransform(G.k,0,0,G.k,0,0);ctx.fillStyle="#000";ctx.fillRect(0,0,1280,720);
  if(G.scene&&G.scene.draw){
    ctx.save();if(G.shake>0)ctx.translate((Math.random()-.5)*14*G.shake,(Math.random()-.5)*14*G.shake);
    G.scene.draw(ctx);ctx.restore();
  }
  if(G.fade>0){ctx.fillStyle=`rgba(0,0,0,${G.fade})`;ctx.fillRect(0,0,1280,720)}
  $("clock").textContent=G.showClock===false?"":G.fmt(G.time);
  requestAnimationFrame(frame);
}

/* ---------- AUDIO (all synthesized) ---------- */
const A=G.A={ctx:null,master:null,mus:null,muted:false,
  init(){
    if(this.ctx){if(this.ctx.state==="suspended")this.ctx.resume();return}
    try{const c=this.ctx=new (window.AudioContext||window.webkitAudioContext)();
      this.master=c.createGain();this.master.gain.value=this.muted?0:.8;this.master.connect(c.destination);
      const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let l=0;
      for(let i=0;i<len;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5}this.noiseBuf=b; // brown noise
      const wb=c.createBuffer(1,len,c.sampleRate),wd=wb.getChannelData(0);for(let i=0;i<len;i++)wd[i]=Math.random()*2-1;this.whiteBuf=wb;
      this.musicOn=true;this.startMusic();
    }catch(e){}
  },
  toggle(){this.muted=!this.muted;if(this.master)this.master.gain.value=this.muted?0:.8;$("bMute").textContent=this.muted?"♪ Off":"♪ On"},
  tone(f,d=.15,type="sine",vol=.05,when=0,slide=null,dest=null){
    const c=this.ctx;if(!c)return;const t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g).connect(dest||this.master);o.start(t);o.stop(t+d+.05);
  },
  noise(d=.3,vol=.05,fq=2000,type="lowpass",when=0,white=false){
    const c=this.ctx;if(!c)return;const t=c.currentTime+when,s=c.createBufferSource();s.buffer=white?this.whiteBuf:this.noiseBuf;
    const f=c.createBiquadFilter();f.type=type;f.frequency.value=fq;const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    s.connect(f).connect(g).connect(this.master);s.start(t);s.stop(t+d+.05);
  },
  tick(){this.tone(900+Math.random()*200,.02,"square",.006)},
  sfx(n){
    if(!this.ctx)return;
    switch(n){
      case"click":this.tone(520,.07,"triangle",.06);this.tone(780,.09,"triangle",.05,.04);break;
      case"card":this.tone(262,.9,"sine",.05);this.tone(392,1,"sine",.04,.1);this.tone(523,1.2,"sine",.04,.2);break;
      case"ding":this.tone(1320,.5,"sine",.07);this.tone(1760,.7,"sine",.04,.03);break;
      case"clink":this.tone(2100,.12,"triangle",.06);this.tone(3100,.2,"sine",.03,.02);break;
      case"pour":this.noise(.9,.07,1800,"bandpass");break;
      case"kettle":this.noise(.18,.05,3500,"highpass",0,true);break;
      case"pop":this.tone(300,.08,"sine",.08,0,700);break;
      case"buzz":for(let i=0;i<6;i++)this.tone(180,.06,"sawtooth",.05,i*.09);break;
      case"wrong":this.tone(200,.22,"sawtooth",.05,0,120);break;
      case"right":this.tone(660,.1,"triangle",.07);this.tone(990,.18,"triangle",.07,.09);break;
      case"heart":this.tone(784,.12,"sine",.06);this.tone(1046,.2,"sine",.06,.1);this.tone(1318,.3,"sine",.05,.2);break;
      case"whoosh":this.noise(.5,.06,900,"bandpass");break;
      case"splash":this.noise(.5,.08,2400,"lowpass",0,true);break;
      case"door":this.tone(140,.15,"square",.05);this.noise(.1,.05,500);break;
      case"lift":this.tone(660,.35,"sine",.06);this.tone(523,.5,"sine",.05,.3);break;
      case"horn":this.tone(380,.35,"sawtooth",.05);this.tone(480,.35,"sawtooth",.04);break;
      case"step":this.noise(.06,.04,500);break;
      case"gift":this.tone(523,.12,"triangle",.06);this.tone(659,.12,"triangle",.06,.1);this.tone(784,.12,"triangle",.06,.2);this.tone(1046,.4,"triangle",.07,.3);break;
      case"start":this.tone(110,.4,"sawtooth",.06,0,220);this.noise(.5,.08,300);break;
    }
  },
  /* motorbike engine: call .engine(speed 0..1) every frame while riding, .engine(null) to stop */
  engine(s){
    const c=this.ctx;if(!c)return;
    if(s==null){if(this._eng){const e=this._eng;e.g.gain.setTargetAtTime(0,c.currentTime,.1);setTimeout(()=>{try{e.o1.stop();e.o2.stop()}catch(x){}},400);this._eng=null}return}
    if(!this._eng){const o1=c.createOscillator(),o2=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o1.type="sawtooth";o2.type="square";f.type="lowpass";f.frequency.value=500;g.gain.value=0;
      o1.connect(f);o2.connect(f);f.connect(g).connect(this.master);o1.start();o2.start();g.gain.setTargetAtTime(.05,c.currentTime,.2);this._eng={o1,o2,f,g}}
    const e=this._eng,fq=48+s*120,t=c.currentTime;e.o1.frequency.setTargetAtTime(fq,t,.08);e.o2.frequency.setTargetAtTime(fq*.5,t,.08);e.f.frequency.setTargetAtTime(380+s*900,t,.1);
  },
  /* sea waves bed */
  waves(on){
    const c=this.ctx;if(!c)return;
    if(!on){if(this._wv){const w=this._wv;w.g.gain.setTargetAtTime(0,c.currentTime,.4);setTimeout(()=>{try{w.s.stop();w.l.stop()}catch(x){}},1500);this._wv=null}return}
    if(this._wv)return;const s=c.createBufferSource();s.buffer=this.noiseBuf;s.loop=true;const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=900;
    const g=c.createGain();g.gain.value=.0;const l=c.createOscillator(),lg=c.createGain();l.frequency.value=.11;lg.gain.value=.12;l.connect(lg).connect(g.gain);
    s.connect(f).connect(g).connect(this.master);s.start();l.start();g.gain.setTargetAtTime(.16,c.currentTime,.8);this._wv={s,l,g};
  },
  /* generative background music: gentle pentatonic piano-ish pads */
  setMusic(name){this.mood=name},
  startMusic(){
    const c=this.ctx;if(!c||this._mus)return;this.mood=this.mood||"office";
    const MOODS={office:{root:57,scale:[0,2,4,7,9],bpm:84,vol:.035,chords:[[0,4,7],[5,9,12],[7,11,14],[2,5,9]]},
      warm:{root:55,scale:[0,2,4,7,9],bpm:72,vol:.04,chords:[[0,4,7],[9,12,16],[5,9,12],[7,11,14]]},
      night:{root:52,scale:[0,3,5,7,10],bpm:62,vol:.04,chords:[[0,3,7],[8,12,15],[5,8,12],[7,10,14]]},
      ride:{root:57,scale:[0,2,4,7,9],bpm:108,vol:.04,chords:[[0,4,7],[7,11,14],[9,12,16],[5,9,12]]},
      none:null};
    let step=0;
    const mf=m=>440*Math.pow(2,(m-69)/12);
    this._mus=setInterval(()=>{
      if(!this.ctx||this.muted)return;const M=MOODS[this.mood];if(!M)return;
      const beat=60/M.bpm;step++;
      if(step%8===1){const ch=M.chords[((step-1)/8|0)%M.chords.length];ch.forEach((n,i)=>this.tone(mf(M.root-12+n),beat*4,"triangle",M.vol*.7,i*.03))}
      if(step%2===0&&Math.random()<.75){const n=M.scale[(Math.random()*M.scale.length)|0]+(Math.random()<.5?12:24);this.tone(mf(M.root+n),beat*1.6,"sine",M.vol,0)}
    },(60/84)*500);
  }
};
window.A=A;
$("bMute").onclick=()=>A.toggle();
$("bMenu").onclick=()=>{if(G.openMenu)G.openMenu()};

G.start=function(){resize();requestAnimationFrame(frame)};
G.resize=resize;
})();
