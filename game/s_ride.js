/* ================= RIDE: the CB300R night ride (side-scrolling) + parking ================= */
(function(){
"use strict";
const TAU=Math.PI*2;const {rr,circ,lg,rg,shade}=Art;
const hash=(n)=>{let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};

/* ---------- routes (names follow the real route) ---------- */
const DIRS=[[.08,"ANAMIKA","Turn left at the junction!"],[.11,"SREEDEV","It's a straight road. I know the way."],[.3,"ANAMIKA","Take a right here!"],[.33,"SREEDEV","Which right? There is no right."],[.52,"ANAMIKA","Left! Left! …I meant right."],[.55,"SREEDEV","You have never once said the correct one."],[.74,"ANAMIKA","It's that way. Left."],[.77,"SREEDEV","That's a wall. Straight."]];
S.ROUTES={
  beach:{title:"To St. Andrews Beach",km:6.1,approx:false,seg:4300,
    stops:[{n:"Technopark Main Gate",z:"campus"},{n:"NH 66",z:"highway"},{n:"Kazhakoottam Junction",z:"junction"},{n:"Kazhakuttom Rd",z:"town"},{n:"Menamkulam",z:"town"},{n:"Veli – Perumathura Rd",z:"coast"},{n:"St. Andrews Beach",z:"coast"}],
    banter:[[.02,"SREEDEV","Helmet on? Hold tight."],[.03,"ANAMIKA","Obviously."],...DIRS,[.88,"SREEDEV","Can you hear the sea?"],[.9,"ANAMIKA","…Yes. Right turn now. Real one."]]},
  istanbul:{title:"To Istanbul Rolls & Grills",km:2.1,approx:true,seg:3500,
    stops:[{n:"IIITMK",z:"campus"},{n:"Technopark Rd",z:"campus"},{n:"Service Rd",z:"town"},{n:"Istanbul Rolls & Grills – Royale",z:"town"}],
    banter:[[.04,"SREEDEV","IIITMK. Nobody here is awake. Just us."],[.16,"ANAMIKA","Turn left!"],[.2,"SREEDEV","I live here. Sort of."],[.45,"ANAMIKA","Right! …Left. Sorry."],[.7,"SREEDEV","I can smell the grill already."],[.74,"ANAMIKA","Take the next left."],[.78,"SREEDEV","That's the restaurant. It's straight."]]},
  waffles:{title:"To Waffles",km:3.0,approx:true,placeholder:true,seg:3500,
    stops:[{n:"Technopark Main Gate",z:"campus"},{n:"NH 66",z:"highway"},{n:"Waffles",z:"town"}],
    banter:[[.04,"SREEDEV","Dessert for dinner. Respect to us."],[.2,"ANAMIKA","Turn right here!"],[.24,"SREEDEV","There's a hedge on the right."],[.55,"ANAMIKA","Left! …No, right."],[.6,"SREEDEV","I'm going straight."],[.82,"ANAMIKA","Is that the place? It smells sweet."]]},
};
S.reverseRoute=(r,title,destName)=>{const stops=[...r.stops].reverse().map(s=>({n:s.n,z:s.z}));stops[stops.length-1]={n:destName||"Technopark Phase 1",z:"campus"};
  return{title,km:r.km,approx:true,seg:Math.round(r.seg*.7),stops,banter:[[.15,"ANAMIKA","Left here, I think."],[.18,"SREEDEV","We came from the right."],[.45,"ANAMIKA","Right. …The other right."],[.48,"SREEDEV","I give up. I'm using my own map."]]}};

/* ---------- vehicles ---------- */
function drawTruckish(g,x,y,kind,t,dirL){
  g.save();g.translate(x,y);if(!dirL)g.scale(-1,1);
  if(kind==="auto"){g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(0,2,70,8,0,0,TAU);g.fill();g.fillStyle="#f2c21b";rr(g,-56,-92,106,62,16);g.fill();g.fillStyle="#1a1d24";rr(g,-56,-52,106,24,6);g.fill();g.fillStyle="#2a2f3a";rr(g,-44,-84,70,28,8);g.fill();
    for(const wx of [-32,34]){circ(g,wx,-14,15,"#14161a");circ(g,wx,-14,6,"#9aa1ad")}
    g.fillStyle="#fff7c8";g.beginPath();g.arc(-58,-56,6,0,TAU);g.fill();g.fillStyle="rgba(255,248,200,.22)";g.beginPath();g.moveTo(-58,-62);g.lineTo(-330,-110);g.lineTo(-330,10);g.lineTo(-58,-50);g.fill()}
  else if(kind==="bus"){g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(0,2,170,10,0,0,TAU);g.fill();g.fillStyle="#c43a2a";rr(g,-160,-170,320,140,14);g.fill();g.fillStyle="#f2f2f2";g.fillRect(-160,-100,320,18);
    g.fillStyle="#2a3140";for(let i=0;i<7;i++)g.fillRect(-146+i*42,-156,34,48);g.fillStyle="#ffe9a0";for(let i=0;i<7;i++)if(i%2==0)g.fillRect(-146+i*42,-156,34,48);
    for(const wx of [-100,100]){circ(g,wx,-26,26,"#14161a");circ(g,wx,-26,11,"#9aa1ad")}
    g.fillStyle="#fff7c8";g.beginPath();g.arc(-162,-60,8,0,TAU);g.fill();g.fillStyle="rgba(255,248,200,.2)";g.beginPath();g.moveTo(-162,-70);g.lineTo(-460,-130);g.lineTo(-460,10);g.lineTo(-162,-50);g.fill();
    g.fillStyle="#fff";g.font="700 18px system-ui";g.fillText("KSRTC",-40,-114)}
  else{const col={car1:"#e9ecef",car2:"#2f6bd1",car3:"#3a3f48",car4:"#d9402f"}[kind]||"#e9ecef";
    g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(0,2,100,9,0,0,TAU);g.fill();g.fillStyle=col;g.beginPath();g.moveTo(-104,-30);g.lineTo(-100,-62);g.quadraticCurveTo(-60,-70,-40,-100);g.lineTo(40,-100);g.quadraticCurveTo(70,-70,104,-62);g.lineTo(106,-30);g.closePath();g.fill();
    g.fillStyle="#232a36";g.beginPath();g.moveTo(-32,-94);g.lineTo(34,-94);g.lineTo(56,-66);g.lineTo(-56,-66);g.closePath();g.fill();
    for(const wx of [-60,62]){circ(g,wx,-22,22,"#14161a");circ(g,wx,-22,10,"#aab1bd")}
    g.fillStyle="#fff7c8";g.beginPath();g.ellipse(-104,-50,6,8,0,0,TAU);g.fill();g.fillStyle="rgba(255,248,200,.22)";g.beginPath();g.moveTo(-104,-58);g.lineTo(-380,-120);g.lineTo(-380,10);g.lineTo(-104,-40);g.fill();
    g.fillStyle="#ff3b3b";g.fillRect(100,-54,6,10)}
  g.restore();
}

/* ---------- scenery by zone ---------- */
const ZC={campus:{b:"#14213f",w:"rgba(150,210,255,.9)"},highway:{b:"#10182c",w:"rgba(255,220,150,.85)"},junction:{b:"#16182e",w:"rgba(255,210,140,.9)"},town:{b:"#1a1a2e",w:"rgba(255,200,120,.9)"},coast:{b:"#0c1428",w:"rgba(255,215,140,.8)"}};
S.Ride={
  enter(o){
    o=o||{};this.route=o.route;this.night=o.night!==false;this.x=0;this.v=0;this.speed=.55;this.wheel=0;this.bounce=0;this.done=false;this.res=null;this.stopAt=null;
    this.total=this.route.seg*(this.route.stops.length-1);this.sign=-1;this.signT=0;this.nextBanter=0;this.traffic=[];this.tNext=1;this.light=0;
    this.dev=Art.actor("ANAMIKA",{});this.sree=Art.actor("SREEDEV",{});this.devA={bx:0,by:0};this.sreeA={bx:0,by:0};
    this.hornT=0;this.started=false;this.ending=false;this.sparks=[];this.hintT=6;G.showClock=true;G.chapter(9,"The Ride");A.setMusic("ride");
    this.finalBrake=false;this.arrivalX=this.total-380;this.tFrom=o.tFrom;this.tTo=o.tTo;
  },
  exit(){A.engine(null)},
  devFinish(){this.x=this.arrivalX;this.speed=0;this.ending=true;this.done=true;A.engine(null);if(this.res)this.res()},
  run(){return new Promise(r=>{this.res=r;this.started=true})},
  update(dt){
    if(!this.started)return;
    if(this.tFrom!=null)G.time=this.tFrom+(this.tTo-this.tFrom)*Math.min(1,this.x/this.arrivalX);
    const up=G.down("arrowup","w"," ")||G.ptr.down,dn=G.down("arrowdown","s");
    let target=up?1:dn?.28:.62;if(this.ending){target=0}
    if(!this.ending&&this.x>this.arrivalX-2400){target=Math.min(target,Math.max(.2,(this.arrivalX-this.x)/2400))}
    this.speed+=(target-this.speed)*Math.min(1,dt*(this.ending?1.6:2.2));
    const sp=this.speed*(this.speed>.02?1:0);const px=sp*900;this.v=px;this.x+=px*dt;this.wheel+=px*dt/64;
    this.bounce=Math.sin(G.t*18)*sp*2.2+Math.sin(G.t*7)*1.2;
    A.engine(this.ending&&this.speed<.04?null:.15+this.speed*.85);
    // reached destination
    if(!this.ending&&this.x>=this.arrivalX-6){this.ending=true;this.x=Math.min(this.x,this.arrivalX)}
    if(this.ending&&this.speed<.02&&!this.done){this.done=true;A.engine(null);if(this.res)setTimeout(this.res,700)}
    // stop signs
    const seg=this.route.seg,idx=Math.floor(this.x/seg+.0001);
    if(idx!==this.sign&&idx<this.route.stops.length){this.sign=idx;this.signT=3.4;if(idx>0&&idx<this.route.stops.length-1)A.sfx("ding")}
    if(this.signT>0)this.signT-=dt;
    // banter
    const f=this.x/this.arrivalX;const b=this.route.banter;
    while(this.nextBanter<b.length&&f>=b[this.nextBanter][0]){const l=b[this.nextBanter++];G.bubble(l[1]==="ANAMIKA"?this.devA:this.sreeA,l[2],3600)}
    // traffic oncoming
    this.tNext-=dt;if(this.tNext<=0&&this.x<this.arrivalX-1500){this.tNext=G.rand(1.6,4.2);const kinds=["car1","car2","car3","car4","auto","auto","bus","car1"];this.traffic.push({x:1500,k:kinds[(Math.random()*kinds.length)|0],v:G.rand(380,620)})}
    for(const c of this.traffic){c.x-=(c.v+this.v)*dt}this.traffic=this.traffic.filter(c=>c.x>-700);
    if(this.hornT>0)this.hornT-=dt;if(this.hintT>0&&this.started)this.hintT-=dt;
    // sparks from street lamps passing
    if(this.speed>.5&&Math.random()<dt*16)this.sparks.push({x:1300,y:G.rand(430,640),v:G.rand(1400,2200)*this.speed,l:1});
    for(const s of this.sparks){s.x-=s.v*dt;s.l-=dt*1.4}this.sparks=this.sparks.filter(s=>s.l>0&&s.x>-40);
    // gentle light cycle at junction
    this.light=(this.light+dt)%12;
  },
  key(e){if(e.key.toLowerCase()==="h"&&this.hornT<=0){this.hornT=.8;A.sfx("horn");G.bubble(this.sreeA,"Beep beep!",1200)}},
  zone(){const st=this.route.stops,i=Math.min(st.length-1,Math.floor(this.x/this.route.seg));return st[i].z},
  draw(g){
    const t=G.t,x=this.x,zone=this.zone(),zc=ZC[zone];
    const ground=548;
    // sky
    const dusk=!this.night;g.fillStyle=lg(g,0,0,0,420,[[0,this.night?"#070b1e":"#2a3a6e"],[.7,this.night?"#141c40":"#e47f62"],[1,this.night?"#2a2850":"#ffb36b"]]);g.fillRect(0,0,1280,720);
    Art.stars(g,t,110,13);
    g.fillStyle="#f6f1de";g.beginPath();g.arc(1030-(x*.002%80),110,28,0,TAU);g.fill();g.fillStyle="rgba(8,12,34,.75)";g.beginPath();g.arc(1040-(x*.002%80),102,24,0,TAU);g.fill();
    // far layer: hills / skyline
    const layer=(factor,step,fn)=>{const off=x*factor;const i0=Math.floor((off-300)/step),i1=Math.ceil((off+1600)/step);for(let i=i0;i<=i1;i++)fn(i,i*step-off,hash(i+zone.length*7))};
    layer(.06,300,(i,sx,r)=>{g.fillStyle="#0e1430";g.beginPath();g.moveTo(sx-60,420);g.quadraticCurveTo(sx+150,260+r*80,sx+360,420);g.fill()});
    if(zone==="coast"){g.fillStyle="rgba(30,70,120,.55)";g.fillRect(0,372,1280,60);g.fillStyle="rgba(255,240,200,.14)";g.fillRect(960,372,120,60);
      for(let i=0;i<9;i++){g.fillStyle="rgba(255,255,255,.1)";g.fillRect(((i*170-x*.05)%1500+1500)%1500-100,380+i*6,90,2)}
      layer(.1,1800,(i,sx,r)=>{if(r>.0){g.fillStyle="#0a1020";g.beginPath();g.moveTo(sx+300,430);g.lineTo(sx+330,300);g.lineTo(sx+345,300);g.lineTo(sx+345,260);g.lineTo(sx+352,240);g.lineTo(sx+359,260);g.lineTo(sx+359,300);g.lineTo(sx+390,430);g.fill();g.fillStyle="rgba(255,210,120,.9)";g.fillRect(sx+346,278,10,14);g.strokeStyle="#ffd68a";g.lineWidth=2;g.beginPath();g.moveTo(sx+352,222);g.lineTo(sx+352,246);g.moveTo(sx+344,230);g.lineTo(sx+360,230);g.stroke()}})}
    // mid layer: buildings by zone
    layer(.2,260,(i,sx,r)=>{
      const bw=120+r*100,bh=zone==="coast"?60+r*40:zone==="campus"?150+r*190:zone==="highway"?60+r*80:100+r*110;
      if(zone==="coast"&&r<.45)return;
      g.fillStyle=zc.b;g.fillRect(sx,ground-bh-40,bw,bh+40);
      if(zone==="campus"){g.fillStyle="rgba(100,170,220,.18)";g.fillRect(sx,ground-bh-40,bw,bh+40)}
      for(let wy=ground-bh-30;wy<ground-50;wy+=20)for(let wx=sx+10;wx<sx+bw-12;wx+=18){if(hash(i*31+wy*3+wx)<.55){g.fillStyle=zc.w;g.fillRect(wx,wy,9,11)}}
      if(zone==="town"||zone==="junction"){g.fillStyle=["#ff5a5a","#4ac2ff","#ffd24a","#7be08a"][i&3];g.fillRect(sx+10,ground-62,bw-20,16);g.fillStyle="#111";g.font="700 11px system-ui";g.fillText(["CHAI","MOBILES","BAKERY","SUPER MART","PHARMACY","STORES"][Math.abs(i)%6],sx+16,ground-50)}
    });
    // palms (mid-far)
    layer(.4,230,(i,sx,r)=>{if(r<.35)return;const h=130+r*90;Art.palm(g,sx,ground-8,h,t+i,{trunk:"#080c1a",leaf:"#0a1428"})});
    // junction signal
    if(zone==="junction"||(Math.floor(x/this.route.seg)===2)){layer(.6,1500,(i,sx,r)=>{g.fillStyle="#12151d";g.fillRect(sx,ground-300,8,300);g.fillRect(sx-40,ground-308,90,18);const ph=this.light<7?0:this.light<9?1:2;
        [["#ff3a3a",0],["#ffc23a",1],["#3aff6a",2]].forEach(([c,k],j)=>{g.fillStyle=ph===k?c:"#2a2d36";g.beginPath();g.arc(sx-26+j*28,ground-299,7,0,TAU);g.fill();if(ph===k){g.fillStyle=c.replace(")",",.25)");g.fillStyle="rgba(255,200,120,.18)";g.beginPath();g.arc(sx-26+j*28,ground-299,24,0,TAU);g.fill()}})})}
    // road signs on poles (names of stops, real positions)
    const seg=this.route.seg;
    this.route.stops.forEach((s,i)=>{const wx=i*seg+(i===0?900:-120);const sx=wx-x;if(sx>-340&&sx<1500){
      const w=Math.max(280,s.n.length*14+60);g.fillStyle="#0b3d2c";g.fillRect(sx-w/2,ground-262,w,76);g.strokeStyle="#e9f7ee";g.lineWidth=3;g.strokeRect(sx-w/2+4,ground-258,w-8,68);
      g.fillStyle="#12151d";g.fillRect(sx-8,ground-188,10,188);g.fillStyle="#f4fff7";g.font="700 24px system-ui";g.textAlign="center";g.fillText(s.n,sx,ground-236);g.font="500 15px system-ui";
      const left=Math.max(0,this.route.km*(1-i/(this.route.stops.length-1)));g.fillStyle="#bfe8cf";g.fillText(i===this.route.stops.length-1?"you are here":(left.toFixed(1)+" km"),sx,ground-208);
      g.fillStyle="rgba(255,255,255,.07)";g.beginPath();g.arc(sx,ground-224,150,0,TAU);g.fill();g.textAlign="left"}});
    // campus gate arch at start
    if(this.route.stops[0].z==="campus"){const sx=1200-x;if(sx>-600&&sx<1400){g.fillStyle="#1a2030";g.fillRect(sx,ground-330,26,330);g.fillRect(sx+560,ground-330,26,330);g.fillRect(sx,ground-330,586,52);g.fillStyle="#e8832a";g.font="700 28px system-ui";g.textAlign="center";g.fillText("TECHNOPARK",sx+293,ground-294);g.textAlign="left";g.fillStyle="rgba(232,131,42,.15)";g.beginPath();g.arc(sx+293,ground-300,120,0,TAU);g.fill()}}
    // street lamps (near-mid layer)
    layer(.8,520,(i,sx)=>{g.fillStyle="#0c0f18";g.fillRect(sx,ground-250,6,250);g.fillRect(sx-4,ground-256,50,7);const gr=g.createRadialGradient(sx+36,ground-244,2,sx+36,ground-244,220);gr.addColorStop(0,"rgba(255,214,140,.55)");gr.addColorStop(1,"rgba(255,214,140,0)");g.fillStyle=gr;g.fillRect(sx-190,ground-460,440,460);g.fillStyle="#ffe3a8";g.beginPath();g.ellipse(sx+36,ground-244,12,5,0,0,TAU);g.fill();
      const gg=g.createLinearGradient(0,ground-240,0,ground);gg.addColorStop(0,"rgba(255,214,140,.2)");gg.addColorStop(1,"rgba(255,214,140,0)");g.fillStyle=gg;g.beginPath();g.moveTo(sx+30,ground-240);g.lineTo(sx+42,ground-240);g.lineTo(sx+130,ground);g.lineTo(sx-60,ground);g.fill()});
    // coast: wave glints / road side sand
    // road
    g.fillStyle=lg(g,0,ground,0,720,[[0,"#2f3340"],[1,"#23262f"]]);g.fillRect(0,ground,1280,172);g.fillStyle="#3a4050";g.fillRect(0,ground,1280,6);
    g.fillStyle="#1b1e26";g.fillRect(0,ground-22,1280,24);g.fillStyle="#454b59";g.fillRect(0,ground-24,1280,4);
    // lane lines
    g.fillStyle="#e8d37a";const lo=(x*1)%160;for(let i=-1;i<10;i++)g.fillRect(i*160-lo,ground+64,90,6);
    g.fillStyle="rgba(255,255,255,.7)";g.fillRect(0,ground+118,1280,4);
    // oncoming lane traffic (upper lane, drawn behind bike)
    for(const c of this.traffic)drawTruckish(g,c.x,ground+52,c.k,t,true);
    // headlight pool on the road
    // bike + riders
    const bx=330,by=ground+112,lean=-.04-this.speed*.06+(this.ending?.0:0);
    g.save();g.translate(bx,by);g.rotate(lean);g.translate(-bx,-by);
    const beamOn=this.night;
    Art.bike(g,bx,by,{s:1.0,wheel:this.wheel,lights:beamOn,sus:this.bounce*.4,t});
    // passenger (behind) then driver
    const R=64,fl=this.speed;const hairFlow=fl*1.1;
    g.save();g.translate(bx,by);
    Art.rider(g,Art.CHARS.ANAMIKA,"#f08ab4",{x:36,y:-R-82+this.bounce*.4,lean:.34+fl*.1,handX:74,handY:6,t,hairFlow,passenger:true});
    Art.rider(g,Art.CHARS.SREEDEV,"#1a1d24",{x:112,y:-R-88+this.bounce*.4,lean:.62+fl*.16,handX:64,handY:-52,t});
    g.restore();g.restore();
    this.devA.bx=bx+10;this.devA.by=by-R-82-Math.cos(.34)*108-150;this.sreeA.bx=bx+112+Math.sin(.62)*108+8;this.sreeA.by=by-R-88-Math.cos(.62)*108-86;
    // exhaust shimmer + motion lines
    if(this.speed>.7){g.strokeStyle="rgba(255,255,255,.12)";g.lineWidth=2;for(let i=0;i<9;i++){const y=420+hash(i+Math.floor(t*14))*240,l=80+hash(i*3)*160,xx=(1280-((t*2000+i*190)%1500));g.beginPath();g.moveTo(xx,y);g.lineTo(xx+l,y);g.stroke()}}
    for(const s of this.sparks){g.fillStyle=`rgba(255,226,150,${s.l*.7})`;g.fillRect(s.x,s.y,10+s.v*.01,2)}
    // foreground kerb
    g.fillStyle="#1f222b";g.fillRect(0,ground+126,1280,46);g.fillStyle="#2a2e38";g.fillRect(0,ground+124,1280,4);
    // sign toast
    if(this.signT>0&&this.sign>=0&&this.sign<this.route.stops.length){const n=this.route.stops[this.sign].n,a=Math.min(1,this.signT);g.globalAlpha=a;g.fillStyle="rgba(8,10,16,.8)";g.beginPath();g.roundRect(380,160,520,76,38);g.fill();g.strokeStyle="rgba(255,255,255,.2)";g.stroke();
      g.fillStyle="#ffd166";g.font="500 15px system-ui";g.textAlign="center";g.fillText(this.sign===this.route.stops.length-1?"ARRIVING":"NOW ENTERING",640,188);g.fillStyle="#fff";g.font="700 28px system-ui";g.fillText(n,640,220);g.globalAlpha=1;g.textAlign="left"}
    // nav bar (top) + speedo
    this.hud(g);G.drawBubbles(g);
    // vignette & night darken
    if(this.night){g.fillStyle="rgba(4,6,22,.18)";g.fillRect(0,0,1280,720)}
    S.vignette(g,.55);
  },
  hud(g){
    const st=this.route.stops,n=st.length;
    g.fillStyle="rgba(8,10,16,.72)";g.beginPath();g.roundRect(300,86,680,60,30);g.fill();g.strokeStyle="rgba(255,255,255,.14)";g.stroke();
    const lx=340,rx=940,p=Math.min(1,this.x/this.total);g.strokeStyle="#39404f";g.lineWidth=5;g.beginPath();g.moveTo(lx,118);g.lineTo(rx,118);g.stroke();g.strokeStyle="#ffd166";g.beginPath();g.moveTo(lx,118);g.lineTo(lx+(rx-lx)*p,118);g.stroke();
    st.forEach((s,i)=>{const sx=lx+(rx-lx)*i/(n-1);g.fillStyle=this.x/this.route.seg>=i?"#ffd166":"#59627a";g.beginPath();g.arc(sx,118,6.5,0,TAU);g.fill()});
    // bike marker
    g.fillStyle="#fff";g.beginPath();g.arc(lx+(rx-lx)*p,118,9,0,TAU);g.fill();g.fillStyle="#e8832a";g.beginPath();g.arc(lx+(rx-lx)*p,118,5,0,TAU);g.fill();
    const left=Math.max(0,this.route.km*(1-p));g.fillStyle="#cfd5e2";g.font="600 14px system-ui";g.textAlign="center";g.fillText((this.route.approx?"≈ ":"")+left.toFixed(1)+" km to go",640,140);
    g.textAlign="left";
    // speedometer
    const kmh=Math.round(this.speed*70);const cx=1140,cy=640,r=64;g.fillStyle="rgba(8,10,16,.75)";g.beginPath();g.arc(cx,cy,r+8,0,TAU);g.fill();g.strokeStyle="#39404f";g.lineWidth=8;g.beginPath();g.arc(cx,cy,r-6,Math.PI*.75,Math.PI*2.25);g.stroke();g.strokeStyle=this.speed>.85?"#ff6a3d":"#ffd166";g.beginPath();g.arc(cx,cy,r-6,Math.PI*.75,Math.PI*(.75+1.5*this.speed));g.stroke();
    g.fillStyle="#fff";g.font="700 34px system-ui";g.textAlign="center";g.fillText(String(kmh),cx,cy+10);g.fillStyle="#9aa3b5";g.font="500 13px system-ui";g.fillText("km/h",cx,cy+30);g.textAlign="left";
    if(this.hintT>0){g.fillStyle=`rgba(255,255,255,${Math.min(1,this.hintT/2)*.9})`;g.font="500 20px system-ui";g.textAlign="center";g.fillText("Hold ↑ / Space / click to speed up  ·  ↓ to slow  ·  H for the horn",640,708);g.textAlign="left"}
    if(this.title){}
  }
};

})();
