/* ================= SCENES (office): title, pantry, corridor, desk, lift ================= */
(function(){
"use strict";
const S=window.S={};const TAU=Math.PI*2;
const {rr,circ,lg,rg,shade}=Art;
S.cache=(w,h,fn)=>{const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);return c};
const $=G.$;

/* ---------- actor movement helper ---------- */
S.walkTo=(a,x,o={})=>new Promise(res=>{a.task={x,y:o.y,speed:o.speed||170,pose:o.pose||"walk",end:o.end||"stand",res,face:o.face}});
S.stepActor=function(a,dt){
  const tk=a.task;if(!tk)return;
  const dx=tk.x!=null?tk.x-a.x:0,dy=tk.y!=null?tk.y-a.y:0,d=Math.hypot(dx,dy);
  if(d<3){a.x=tk.x!=null?tk.x:a.x;if(tk.y!=null)a.y=tk.y;a.pose=tk.end;a.task=null;if(tk.face)a.dir=tk.face;tk.res();return}
  const st=Math.min(d,tk.speed*dt);a.x+=dx/d*st;if(tk.y!=null)a.y+=dy/d*st;
  if(Math.abs(dx)>1)a.dir=dx>0?1:-1;a.pose=tk.pose;a.ph+=st*.052*(tk.pose==="jog"?.8:1);
  if(a.vertical){a.dirY=dy>0?1:-1}
};
S.time=Date.now();

/* ---------- sky by time of day ---------- */
const SK=[[360,"#ff9a6b","#ffd9a0"],[480,"#6fb7ff","#cfe9ff"],[960,"#5aa8f0","#cfe6ff"],[1050,"#f08a4b","#ffd08a"],[1110,"#5a3d78","#f0906a"],[1170,"#141a3a","#3a2f5a"],[1260,"#070a1a","#141a3a"],[1440,"#070a1a","#141a3a"]];
const hex=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return"rgb("+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(",")+")"};
S.sky=function(m){
  m=Math.max(360,Math.min(1439,m));let i=0;while(i<SK.length-2&&m>SK[i+1][0])i++;
  const a=SK[i],b=SK[i+1],t=(m-a[0])/(b[0]-a[0]);
  const night=m<400?.2:m<1110?0:m<1260?(m-1110)/150:1;
  return{top:mix(a[1],b[1],t),bot:mix(a[2],b[2],t),night};
};
S.interiorTint=function(g,m){
  let c=null;
  if(m>=990&&m<1110){const a=Math.min(.2,(m-990)/120*.2);c=`rgba(255,140,50,${a})`}
  else if(m>=1110){c="rgba(30,34,80,.22)"}
  else if(m<420){c="rgba(255,200,150,.07)"}
  if(c){g.fillStyle=c;g.fillRect(0,0,1280,720)}
};
S.vignette=function(g,a=.5){const gr=g.createRadialGradient(640,360,260,640,360,820);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,`rgba(0,0,0,${a})`);g.fillStyle=gr;g.fillRect(0,0,1280,720)};

/* ---------- Nila skyline (used in windows and title) ---------- */
S.skyline=function(g,x,y,w,h,t,m){
  const night=S.sky(m).night;
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
  const s=S.sky(m);g.fillStyle=lg(g,0,y,0,y+h,[[0,s.top],[1,s.bot]]);g.fillRect(x,y,w,h);
  if(night>.3){g.globalAlpha=night;Art.stars(g,t,50,7);g.globalAlpha=1}
  // sun / moon
  if(m<1110&&m>380){const p=(m-380)/(1110-380),sx=x+w*(.12+.76*p),sy=y+h*(.72-Math.sin(p*Math.PI)*.62);g.fillStyle=rg(g,sx,sy,4,60,[[0,"rgba(255,244,200,1)"],[.35,"rgba(255,210,140,.5)"],[1,"rgba(255,210,140,0)"]]);g.fillRect(sx-64,sy-64,128,128)}
  else if(night>.4){g.fillStyle="#f4f1e0";g.beginPath();g.arc(x+w*.78,y+h*.25,16,0,TAU);g.fill();g.fillStyle=mix("#141a3a","#141a3a",0);g.beginPath();g.arc(x+w*.78+7,y+h*.25-4,14,0,TAU);g.fillStyle="rgba(20,26,58,.9)";g.fill()}
  // far buildings
  const bl=[[.02,.30,.10],[.14,.45,.08],[.24,.35,.12],[.40,.52,.08],[.52,.38,.12],[.68,.48,.10],[.82,.34,.14]];
  for(const b of bl){g.fillStyle=night>.5?"#101528":"#5d6c85";const bx=x+b[0]*w,bh=b[1]*h*.9,bw=b[2]*w;g.fillRect(bx,y+h-bh,bw,bh);
    if(night>.2){g.fillStyle=`rgba(255,220,130,${night*.8})`;for(let wy=y+h-bh+8;wy<y+h-6;wy+=14)for(let wx=bx+5;wx<bx+bw-6;wx+=11)if(((wx*7+wy*3)|0)%5<2)g.fillRect(wx,wy,5,6)}}
  // palm silhouettes
  g.fillStyle=night>.5?"#0a1020":"#2a6a46";for(let i=0;i<4;i++){const px=x+w*(.06+i*.27);g.fillRect(px,y+h-70,4,70);for(let k=0;k<7;k++){const a=-2.8+k*.5;g.beginPath();g.moveTo(px+2,y+h-70);g.quadraticCurveTo(px+2+Math.cos(a)*24,y+h-70+Math.sin(a)*14-6,px+2+Math.cos(a)*40,y+h-70+Math.sin(a)*14+14);g.lineWidth=3;g.strokeStyle=g.fillStyle;g.stroke()}}
  g.restore();
};

/* =====================================================================
   TITLE
   ===================================================================== */
S.Title={
  enter(){
    this.t=0;G.showClock=false;G.chapter(0,"");G.hideDlg();A.setMusic("warm");
    const m=$("mini");m.innerHTML=`<div id="menu">
      <button class="btn p" id="mBegin">Begin the day</button>
      <button class="btn" id="mCh">Chapters</button>
      <button class="btn" id="mSnd">Sound: on</button></div>
      <div id="chsel" class="panel"><h3>Chapters</h3><div id="chlist"></div></div>`;
    $("mBegin").onclick=()=>{A.init();A.sfx("start");if(G.begin)G.begin(1)};
    $("mSnd").onclick=()=>{A.init();A.toggle();$("mSnd").textContent="Sound: "+(A.muted?"off":"on")};
    $("mCh").onclick=()=>{A.init();$("chsel").classList.toggle("on")};
    const names=["Black Tea","The Watch","Lunch?","Suda Suda","Three Rounds of Nila","Tea Time","Six Thirty","Seven Thirty","The Ride","Visitors' Area"];
    $("chlist").innerHTML=names.map((n,i)=>`<button class="btn" data-c="${i+1}">${i+1}. ${n}</button>`).join("");
    $("chlist").querySelectorAll("button").forEach(b=>b.onclick=()=>{A.init();A.sfx("click");if(G.begin)G.begin(+b.dataset.c)});
    this.bg=S.cache(1280,720,(g)=>{
      g.fillStyle=lg(g,0,0,0,720,[[0,"#0a1030"],[.5,"#3a2a5c"],[.78,"#e8765a"],[1,"#ffb26b"]]);g.fillRect(0,0,1280,720);
      // far hills
      g.fillStyle="#2a2f58";g.beginPath();g.moveTo(0,520);g.bezierCurveTo(200,470,300,540,520,500);g.bezierCurveTo(700,470,900,540,1280,490);g.lineTo(1280,720);g.lineTo(0,720);g.fill();
      g.fillStyle="#1a1d3e";g.beginPath();g.moveTo(0,570);g.bezierCurveTo(260,530,420,600,700,560);g.bezierCurveTo(900,530,1100,590,1280,550);g.lineTo(1280,720);g.lineTo(0,720);g.fill();
    });
    this.fire=Array.from({length:30},()=>({x:Math.random()*1280,y:300+Math.random()*400,p:Math.random()*6}));
  },
  exit(){$("mini").innerHTML="";G.showClock=true},
  update(dt){this.t+=dt},
  draw(g){
    const t=this.t;g.drawImage(this.bg,0,0);Art.stars(g,t,120,11);
    // Nila building
    g.save();g.translate(520,150);
    g.fillStyle="#12142e";g.fillRect(0,40,620,420);
    for(let r=0;r<12;r++)for(let c=0;c<20;c++){const lit=((r*13+c*7)%5)<2;g.fillStyle=lit?`rgba(255,${190+(c*11)%50},110,${.65+.2*Math.sin(t+r+c)})`:"rgba(40,50,90,.9)";g.fillRect(14+c*30,56+r*32,18,16)}
    g.fillStyle="#1d2142";g.fillRect(0,30,620,12);
    // glass pyramid skylight glow
    g.fillStyle=lg(g,200,300,420,460,[[0,"rgba(120,220,230,.9)"],[1,"rgba(40,120,150,.8)"]]);g.beginPath();g.moveTo(190,460);g.lineTo(310,330);g.lineTo(430,460);g.closePath();g.fill();
    g.strokeStyle="rgba(255,255,255,.7)";g.lineWidth=2;g.stroke();
    g.fillStyle="rgba(255,200,120,.12)";g.beginPath();g.moveTo(190,460);g.lineTo(310,330);g.lineTo(430,460);g.fill();
    g.restore();
    // foreground palms
    Art.palm(g,150,640,320,t,{trunk:"#0d0f22",leaf:"#0d0f22"});Art.palm(g,1180,650,260,t+1,{trunk:"#0d0f22",leaf:"#0d0f22"});Art.palm(g,1000,660,200,t+2,{trunk:"#0d0f22",leaf:"#0d0f22"});
    g.fillStyle="#0b0d1e";g.fillRect(0,640,1280,80);
    // two silhouettes on the balcony
    g.fillStyle="#0b0d1e";g.beginPath();g.arc(730,560,13,0,TAU);g.arc(770,552,13,0,TAU);g.fill();g.fillRect(718,572,24,70);g.fillRect(758,564,24,78);
    // fireflies
    for(const f of this.fire){const a=.3+.7*Math.abs(Math.sin(t*1.3+f.p));g.fillStyle=`rgba(255,226,140,${a})`;g.beginPath();g.arc(f.x+Math.sin(t*.5+f.p)*18,f.y+Math.cos(t*.4+f.p)*14,2.2,0,TAU);g.fill()}
    // title
    g.textAlign="left";g.textBaseline="alphabetic";g.shadowColor="rgba(255,150,90,.7)";g.shadowBlur=30;
    g.fillStyle="#fff5e6";g.font="400 150px Georgia,'Times New Roman',serif";g.fillText("October 7",84,250);g.shadowBlur=0;
    g.fillStyle="#ffb26b";g.font="400 30px Georgia,serif";g.fillText("An ordinary day at Technopark.",90,300);
    g.fillStyle="rgba(255,255,255,.6)";g.font="italic 22px Georgia,serif";g.fillText("a story in ten chapters",92,340);
    g.fillStyle="rgba(255,255,255,.35)";g.font="16px system-ui";g.fillText("Click or press Space to advance dialogue  ·  M toggles sound",92,692);
    S.vignette(g,.55);
  }
};

})();
