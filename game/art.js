/* ================= ART: characters, portraits, vehicles, props ================= */
(function(){
"use strict";
const Art=window.Art={};
const TAU=Math.PI*2;
const rr=(g,x,y,w,h,r)=>{g.beginPath();g.roundRect(x,y,w,h,r)};
const circ=(g,x,y,r,fill,stroke,lw)=>{g.beginPath();g.arc(x,y,r,0,TAU);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.lineWidth=lw||2;g.strokeStyle=stroke;g.stroke()}};
const lg=(g,x0,y0,x1,y1,stops)=>{const gr=g.createLinearGradient(x0,y0,x1,y1);stops.forEach(s=>gr.addColorStop(s[0],s[1]));return gr};
const rg=(g,x,y,r0,r1,stops)=>{const gr=g.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(s=>gr.addColorStop(s[0],s[1]));return gr};
Art.rr=rr;Art.circ=circ;Art.lg=lg;Art.rg=rg;Art.TAU=TAU;
const limb=(g,x1,y1,x2,y2,w,col)=>{g.strokeStyle=col;g.lineWidth=w;g.lineCap="round";g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
const shade=(hex,a)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,gg=(n>>8)&255,b=n&255;const f=a<0?0:255,t=Math.abs(a);r=Math.round(r+(f-r)*t);gg=Math.round(gg+(f-gg)*t);b=Math.round(b+(f-b)*t);return`rgb(${r},${gg},${b})`};
Art.shade=shade;

/* ---------- character definitions ---------- */
Art.CHARS={
  ANAMIKA:{skin:"#d49b74",hair:"#171012",style:"long",top:"#e8832a",bottom:"#2c3150",shoe:"#e6d6c6",watch:true,color:"#ff9d4a"},
  SREEDEV:{skin:"#c68a64",hair:"#15100e",style:"short",top:"#7a1f3d",top2:"#2a2f3b",bottom:"#2b3550",shoe:"#e8e8ea",lanyard:true,color:"#ffd166"},
  NAVYA:{skin:"#dcab86",hair:"#2a1a16",style:"bun",top:"#7f6bd0",top2:"#b9a2ff",bottom:"#3a3f5c",shoe:"#d8ccdc",lash:true,color:"#b9a2ff"},
  SIDHU:{skin:"#c28862",hair:"#17120f",style:"short",top:"#3b8d6e",top2:"#52a888",bottom:"#2c3348",shoe:"#222",beard:true,color:"#7be0b0"}
};
Art.CHARS["SIDHU"]=Art.CHARS.SIDHU;

Art.actor=function(name,o){
  const c=Art.CHARS[name];
  return Object.assign({name,def:c,x:640,y:600,s:1,dir:1,pose:"stand",ph:0,expr:"neutral",hold:null,blink:Math.random()*3,look:0,vis:true,sit:0,lean:0,armUp:0,bobT:Math.random()*6,crown:false,helmet:false,sweat:0},o||{});
};

/* ---------- face ---------- */
function face(g,x,y,r,expr,def,t,blinkPhase,side){
  // side=true: profile-ish (eyes shifted right); false: frontal (portrait)
  const blink=(t+blinkPhase)%3.6<.13;
  const ex=side?[r*.42]:[-r*.36,r*.36],ey=y-r*.04;
  const E=expr;
  for(let i=0;i<ex.length;i++){
    const X=x+ex[i];
    if(blink||E==="happyclosed"){g.strokeStyle="#241a17";g.lineWidth=r*.07;g.lineCap="round";g.beginPath();g.arc(X,ey,r*.1,.15*Math.PI,.85*Math.PI);g.stroke()}
    else{
      const wow=E==="wow"?1.25:1;
      g.fillStyle="#fff";g.beginPath();g.ellipse(X,ey,r*.14*wow,r*.17*wow*(E==="sad"?.9:1),0,0,TAU);g.fill();
      g.fillStyle=def.eye||"#2b1b14";g.beginPath();g.arc(X+(side?r*.03:0),ey+r*.01,r*.085*wow,0,TAU);g.fill();
      g.fillStyle="#fff";g.beginPath();g.arc(X+r*.03,ey-r*.03,r*.03,0,TAU);g.fill();
      if(def.lash){g.strokeStyle="#1a110e";g.lineWidth=r*.05;g.beginPath();g.arc(X,ey,r*.16*wow,Math.PI*1.1,Math.PI*1.9);g.stroke()}
    }
    // brows
    g.strokeStyle=def.hair;g.lineWidth=r*.07;g.lineCap="round";g.beginPath();
    const bx=X,by=ey-r*.27;let a=0,lift=0;
    if(E==="mad"){a=(side||i===0?1:-1)*.38*(side?1:(i===0?1:-1));if(!side)a=i===0?.4:-.4;else a=.4;lift=3}
    else if(E==="sad"){a=!side&&i===1?.3:-.3;if(side)a=-.3;lift=-1}
    else if(E==="wow"){lift=-r*.12}
    else if(E==="smirk"){lift=(side||i===1)?-r*.1:0}
    else if(E==="think"){a=.1}
    const L=r*.17;g.moveTo(bx-L*Math.cos(a),by-L*Math.sin(a)-lift*(i===1?1:.5));g.lineTo(bx+L*Math.cos(a),by+L*Math.sin(a)-lift);g.stroke();
  }
  // nose
  g.strokeStyle=shade(def.skin,-.28);g.lineWidth=r*.05;g.lineCap="round";g.beginPath();
  if(side){g.moveTo(x+r*.62,y+r*.0);g.lineTo(x+r*.72,y+r*.14);g.lineTo(x+r*.58,y+r*.17)}else{g.moveTo(x,y+r*.02);g.lineTo(x+r*.05,y+r*.17);g.lineTo(x-r*.04,y+r*.18)}
  g.stroke();
  // mouth
  const mx=side?x+r*.38:x,my=y+r*.42;g.lineCap="round";
  if(E==="smile"||E==="blush"||E==="happyclosed"||E==="think"&&false){g.strokeStyle="#7a2f2f";g.lineWidth=r*.07;g.beginPath();g.arc(mx,my-r*.1,r*.2,.2*Math.PI,.8*Math.PI);g.stroke()}
  else if(E==="grin"){g.fillStyle="#6a2323";g.beginPath();g.arc(mx,my-r*.12,r*.24,0,Math.PI);g.closePath();g.fill();g.fillStyle="#fff";g.beginPath();g.arc(mx,my-r*.12,r*.24,.05*Math.PI,.95*Math.PI);g.lineTo(mx+r*.22,my-r*.1);g.lineTo(mx-r*.22,my-r*.1);g.fill()}
  else if(E==="sad"){g.strokeStyle="#7a2f2f";g.lineWidth=r*.07;g.beginPath();g.arc(mx,my+r*.14,r*.17,1.2*Math.PI,1.8*Math.PI);g.stroke()}
  else if(E==="mad"){g.strokeStyle="#7a2f2f";g.lineWidth=r*.08;g.beginPath();g.moveTo(mx-r*.14,my+r*.02);g.lineTo(mx+r*.14,my-r*.02);g.stroke()}
  else if(E==="wow"){g.fillStyle="#6a2323";g.beginPath();g.ellipse(mx,my,r*.09,r*.13,0,0,TAU);g.fill()}
  else if(E==="smirk"){g.strokeStyle="#7a2f2f";g.lineWidth=r*.07;g.beginPath();g.moveTo(mx-r*.14,my);g.quadraticCurveTo(mx+r*.05,my+r*.06,mx+r*.2,my-r*.1);g.stroke()}
  else{g.strokeStyle="#7a2f2f";g.lineWidth=r*.065;g.beginPath();g.moveTo(mx-r*.12,my);g.lineTo(mx+r*.12,my);g.stroke()}
  if(E==="blush"||E==="smile"&&def.lash){g.fillStyle="rgba(255,110,130,.28)";g.beginPath();g.ellipse(x+(side?r*.28:-r*.5),y+r*.3,r*.15,r*.09,0,0,TAU);g.fill();if(!side){g.beginPath();g.ellipse(x+r*.5,y+r*.3,r*.15,r*.09,0,0,TAU);g.fill()}}
  if(def.beard){g.fillStyle="rgba(20,14,12,.55)";g.beginPath();g.ellipse(x+(side?r*.3:0),y+r*.62,r*.55,r*.3,0,0,Math.PI);g.fill()}
}

/* ---------- hair ---------- */
function hairBack(g,x,y,r,def,style,sway){
  g.fillStyle=def.hair;
  if(style==="long"){g.beginPath();g.moveTo(x-r*.5,y-r*.7);g.bezierCurveTo(x-r*1.5,y-r*.2,x-r*1.3+sway*8,y+r*3.0,x-r*.2+sway*14,y+r*3.3);g.lineTo(x+r*.2,y+r*2.2);g.lineTo(x+r*.1,y);g.closePath();g.fill()}
  if(style==="bun"){circ(g,x-r*.75,y-r*.55,r*.38,def.hair)}
}
function hairFront(g,x,y,r,def,style,side){
  g.fillStyle=def.hair;
  g.beginPath();g.arc(x-(side?r*.04:0),y-r*.06,r*1.04,Math.PI*1.02,Math.PI*1.98);
  if(style==="short"){g.lineTo(x+r*.9,y-r*.45);g.quadraticCurveTo(x+r*.2,y-r*.62,x-r*.5,y-r*.25);g.lineTo(x-r*.98,y+r*.1)}
  else{g.lineTo(x+r*(side?.96:.98),y-r*.2);g.quadraticCurveTo(x+r*.4,y-r*.78,x-r*.3,y-r*.35);g.lineTo(x-r*.98,y+r*.2)}
  g.closePath();g.fill();
  if(style==="long"||style==="bun"){g.beginPath();g.moveTo(x-r*.98,y-r*.05);g.quadraticCurveTo(x-r*1.1,y+r*.8,x-r*.7,y+r*1.2);g.lineTo(x-r*.5,y+r*.2);g.closePath();g.fill()}
  g.fillStyle="rgba(255,255,255,.08)";g.beginPath();g.ellipse(x-r*.1,y-r*.72,r*.45,r*.13,-.2,0,TAU);g.fill();
}

/* ---------- full-body actor ---------- */
Art.drawActor=function(g,a,t){
  if(!a.vis)return;const d=a.def,s=a.s;
  g.save();g.translate(a.x,a.y);g.scale(a.dir*s,s);
  const ph=a.ph,walk=a.pose==="walk"||a.pose==="jog",sit=a.pose==="sit"||a.pose==="type";
  const amp=a.pose==="jog"?.8:.52,sp=walk?Math.sin(ph):0;
  const bob=walk?Math.abs(Math.cos(ph))*(a.pose==="jog"?6:3.5):Math.sin(a.bobT+t*1.8)*1.1;
  const hipY=sit?-86+(a.sit||0):-150-0,hipX=sit?-14:0;
  const shY=hipY-118-bob,shX=hipX+(a.lean||0)*0.8+(sit?4:0);
  // shadow
  if(!a.noShadow){g.fillStyle="rgba(0,0,0,.28)";g.beginPath();g.ellipse(0,2,sit?70:52,10,0,0,TAU);g.fill()}
  // leg angles
  const leg=(k)=>{ // k=0 back leg, 1 front leg
    let th,sh;
    if(sit){th=1.5;sh=0.04;return{th,sh}}
    if(walk){const p=ph+(k?0:Math.PI);th=Math.sin(p)*amp;sh=th-(0.1+0.7*Math.max(0,Math.cos(p+0.3))*(a.pose==="jog"?1.1:.8))}
    else{th=k?.05:-.05;sh=th}
    return{th,sh};
  };
  const drawLeg=(k)=>{
    const {th,sh}=leg(k),col=shade(d.bottom,k?0:-.25),T=78,S=72;
    const kx=hipX+Math.sin(th)*T,ky=hipY+Math.cos(th)*T,ax=kx+Math.sin(sh)*S,ay=ky+Math.cos(sh)*S;
    limb(g,hipX,hipY,kx,ky,25,col);limb(g,kx,ky,ax,ay,21,col);
    // shoe
    g.fillStyle=k?d.shoe:shade(d.shoe,-.2);g.beginPath();g.ellipse(ax+10,ay+(sit?0:-3)+ (sit?10:0),20,9,sit?0:sh*.5,0,TAU);g.fill();
  };
  // arm angles
  const armAng=(k)=>{
    let u,f;
    if(a.pose==="type"){u=.95+(k?0:.08);f=.5+Math.sin(t*14+k*2)*.07;return{u,f}}
    if(a.pose==="wave"&&k){u=-2.4+Math.sin(t*9)*.35;f=-2.5+Math.sin(t*9+1)*.4;return{u,f}}
    if(a.pose==="hold"&&k){u=.9;f=1.35;return{u,f}}
    if(a.pose==="hold2"){u=.9;f=1.4;return{u,f}}
    if(a.pose==="sit"){u=.5;f=.9;return{u,f}}
    if(a.armUp&&k){u=-1.6;f=-1.9;return{u,f}}
    if(walk){const p=ph+(k?Math.PI:0);u=Math.sin(p)*(a.pose==="jog"?.9:.5);f=u+.3+(a.pose==="jog"?.8:0);return{u,f}}
    u=k?.06:-.06;f=u+.15;return{u,f};
  };
  const drawArm=(k)=>{
    const {u,f}=armAng(k),col=shade(d.top,k?0:-.2),U=62,F=56;
    const ex=shX+Math.sin(u)*U,ey=shY+6+Math.cos(u)*U,hx=ex+Math.sin(f)*F,hy=ey+Math.cos(f)*F;
    limb(g,shX,shY+8,ex,ey,18,col);limb(g,ex,ey,hx,hy,15,d.skin);
    circ(g,hx,hy,9,d.skin);
    if(d.watch&&k){g.strokeStyle="#222";g.lineWidth=6;g.beginPath();g.moveTo(hx-Math.sin(f)*14-6,hy-Math.cos(f)*14);g.lineTo(hx-Math.sin(f)*14+6,hy-Math.cos(f)*14);g.stroke();
      g.fillStyle=(a.watchGlow?"#7fe0ff":"#10151c");g.beginPath();g.arc(hx-Math.sin(f)*14,hy-Math.cos(f)*14,6,0,TAU);g.fill()}
    if(a.hold&&(k===1||a.pose==="hold2")){g.save();g.translate(hx,hy);Art.drawHeld(g,a.hold,t);g.restore()}
    return{hx,hy};
  };
  hairBack(g,shX+4,shY-50,34,d,d.style,walk?sp:0);
  drawLeg(0);drawArm(0);
  // torso
  const topCol=d.top;
  g.fillStyle=lg(g,shX-34,shY,shX+34,hipY,[[0,shade(topCol,.12)],[1,shade(topCol,-.18)]]);
  g.beginPath();g.moveTo(shX-40,shY+4);g.quadraticCurveTo(shX-46,shY-10,shX-26,shY-12);g.lineTo(shX+26,shY-12);g.quadraticCurveTo(shX+46,shY-10,shX+40,shY+4);
  g.lineTo(hipX+38,hipY+(d.style==="long"||d.style==="bun"?44:12));g.quadraticCurveTo(hipX,hipY+(d.style==="long"||d.style==="bun"?54:20),hipX-40,hipY+(d.style==="long"||d.style==="bun"?44:12));g.closePath();g.fill();g.strokeStyle="rgba(0,0,0,.28)";g.lineWidth=1.5;g.stroke();
  if(d.top2){ // kurti hem / dupatta stripe
    g.fillStyle=d.top2;if(d.lash){g.beginPath();g.moveTo(shX-20,shY-10);g.quadraticCurveTo(shX+10,shY+40,shX-6,shY+120);g.lineTo(shX+10,shY+120);g.quadraticCurveTo(shX+30,shY+40,shX+24,shY-10);g.closePath();g.globalAlpha=.9;g.fill();g.globalAlpha=1}
    else{g.globalAlpha=.5;g.fillRect(shX-30,shY+30,60,3);g.globalAlpha=1}
  }
  if(d.lanyard){g.strokeStyle="#f4f4f4";g.lineWidth=3;g.beginPath();g.moveTo(shX-10,shY-8);g.lineTo(shX+2,shY+48);g.lineTo(shX+14,shY-8);g.stroke();g.fillStyle="#fff";rr(g,shX-4,shY+46,16,22,3);g.fill();g.fillStyle="#e8832a";g.fillRect(shX-4,shY+46,16,6)}
  // neck + head
  limb(g,shX+4,shY-10,shX+6,shY-34,16,d.skin);
  const hx=shX+8,hy=shY-64+(a.headDy||0);
  hairBack(g,hx,hy,36,d,d.style,0);
  g.fillStyle=lg(g,hx-30,hy-34,hx+30,hy+34,[[0,shade(d.skin,.1)],[1,shade(d.skin,-.1)]]);g.beginPath();g.ellipse(hx,hy,34,38,0,0,TAU);g.fill();
  // ear
  circ(g,hx-8,hy+4,6,shade(d.skin,-.08));
  hairFront(g,hx,hy,36,d,d.style,true);
  const speaking=G.speaker&&(G.speaker===a.name||G.speaker==="SIDHU"&&a.name==="SIDHU")&&G.typing;
  let ex=a.expr;if(speaking&&(ex==="neutral"))ex=(Math.sin(t*14)>0)?"grin":"neutral";
  face(g,hx,hy,36,ex,d,t,a.blink,true);
  if(a.helmet)Art.helmet(g,hx,hy,a.helmet);
  if(a.crown)Art.crown(g,hx,hy-34,1);
  // front leg & arm
  drawLeg(1);const hand=drawArm(1);
  if(a.sweat){g.fillStyle="rgba(150,210,255,.9)";g.beginPath();g.ellipse(hx+30,hy-14+((t*40)%24),3,5,0,0,TAU);g.fill()}
  g.restore();
  // anchor for bubbles (screen space)
  a.bx=a.x+0*a.dir;a.by=a.y-(sit?(86+118+64+60):(150+118+64+52))*s;
};

Art.drawHeld=function(g,item,t){
  if(item==="cup"||item==="bigcup"){const big=item==="bigcup",w=big?30:24,h=big?36:28;
    g.fillStyle="#f4f1ea";rr(g,-w/2,-h+4,w,h,6);g.fill();g.strokeStyle="#cfc8b8";g.lineWidth=2;g.stroke();
    g.strokeStyle="#cfc8b8";g.lineWidth=4;g.beginPath();g.arc(w/2+2,-h/2+4,8,-1.2,1.2);g.stroke();
    g.fillStyle="#2b1a10";g.beginPath();g.ellipse(0,-h+6,w/2-3,4,0,0,TAU);g.fill();
    for(let i=0;i<3;i++){g.strokeStyle=`rgba(255,255,255,${.45-i*.1})`;g.lineWidth=3;g.beginPath();const o=(t*30+i*14)%28;g.moveTo(-6+i*6,-h-4-o*.2);g.bezierCurveTo(-10+i*6,-h-14-o*.4,-2+i*6,-h-20-o*.4,-6+i*6,-h-30-o*.4);g.stroke()}
  }
  else if(item==="tea"){g.fillStyle="#f4f1ea";rr(g,-13,-30,26,30,6);g.fill();g.fillStyle="#6b3a16";g.beginPath();g.ellipse(0,-27,10,3.4,0,0,TAU);g.fill();g.strokeStyle="#cfc8b8";g.lineWidth=4;g.beginPath();g.arc(15,-15,7,-1.2,1.2);g.stroke()}
  else if(item==="flowers"){Art.bouquet(g,0,0,1)}
  else if(item==="gift"){Art.giftBox(g,-18,-34,36,.0)}
  else if(item==="phone"){g.fillStyle="#111";rr(g,-8,-26,16,28,3);g.fill();g.fillStyle="#8fd3ff";rr(g,-6,-24,12,24,2);g.fill()}
  else if(item==="jasmine"){Art.garland(g,0,-10,1)}
};
Art.bouquet=function(g,x,y,s){
  g.save();g.translate(x,y);g.scale(s,s);
  g.fillStyle="#2f8a4a";g.beginPath();g.moveTo(-6,0);g.lineTo(-14,-34);g.lineTo(-2,-40);g.closePath();g.fill();g.beginPath();g.moveTo(6,0);g.lineTo(14,-34);g.lineTo(2,-40);g.closePath();g.fill();
  const cols=["#e0405a","#ff6a85","#ffb3c1","#e0405a","#ff8aa0"];
  [[-16,-44],[0,-52],[16,-44],[-8,-38],[8,-38]].forEach((p,i)=>{
    for(let k=0;k<6;k++){const an=k/6*TAU;g.fillStyle=cols[i];g.beginPath();g.ellipse(p[0]+Math.cos(an)*7,p[1]+Math.sin(an)*7,7,5,an,0,TAU);g.fill()}
    circ(g,p[0],p[1],4.5,"#ffe08a")});
  g.fillStyle="#f7ecd4";g.beginPath();g.moveTo(-18,-10);g.lineTo(18,-10);g.lineTo(8,16);g.lineTo(-8,16);g.closePath();g.fill();g.strokeStyle="#d8c9a6";g.stroke();
  g.restore();
};
Art.garland=function(g,x,y,s){ // jasmine garland
  g.save();g.translate(x,y);g.scale(s,s);
  for(let i=0;i<14;i++){const an=i/14*TAU,px=Math.cos(an)*26,py=Math.sin(an)*10;g.fillStyle="#fff";for(let k=0;k<5;k++){const a2=k/5*TAU;g.beginPath();g.ellipse(px+Math.cos(a2)*4,py+Math.sin(a2)*4,3.5,2.6,a2,0,TAU);g.fill()}circ(g,px,py,2,"#e8d28a")}
  g.restore();
};
Art.giftBox=function(g,x,y,w,open){
  g.save();g.translate(x,y);
  g.fillStyle="#d94a6a";g.fillRect(0,w*.3,w,w*.7);g.fillStyle="#f06a88";g.fillRect(0,w*.3,w,w*.12);
  g.fillStyle="#ffd166";g.fillRect(w*.42,w*.3,w*.16,w*.7);
  g.save();g.translate(0,w*.3);g.rotate(-open*.9);g.fillStyle="#e8587a";g.fillRect(0,-w*.18,w,w*.2);g.fillStyle="#ffd166";g.fillRect(w*.42,-w*.18,w*.16,w*.2);
  g.fillStyle="#ffd166";g.beginPath();g.ellipse(w*.36,-w*.26,w*.14,w*.1,-.5,0,TAU);g.ellipse(w*.64,-w*.26,w*.14,w*.1,.5,0,TAU);g.fill();g.restore();
  g.restore();
};
Art.crown=function(g,x,y,s){
  g.save();g.translate(x,y);g.scale(s,s);g.fillStyle="#f2c230";g.strokeStyle="#9a6d00";g.lineWidth=1.6;
  g.beginPath();g.moveTo(-18,0);g.lineTo(-18,-20);g.lineTo(-9,-10);g.lineTo(0,-24);g.lineTo(9,-10);g.lineTo(18,-20);g.lineTo(18,0);g.closePath();g.fill();g.stroke();
  circ(g,0,-26,3,"#d1342b");circ(g,-18,-22,2.4,"#4aa3ff");circ(g,18,-22,2.4,"#4aa3ff");g.restore();
};
Art.helmet=function(g,x,y,col){
  g.save();g.translate(x,y);const c=typeof col==="string"?col:"#1a1d24";
  g.fillStyle=lg(g,-40,-40,40,30,[[0,shade(c,.25)],[.5,c],[1,shade(c,-.3)]]);
  g.beginPath();g.arc(2,-4,43,Math.PI*.85,Math.PI*2.12);g.lineTo(44,18);g.lineTo(18,26);g.lineTo(-30,24);g.closePath();g.fill();
  g.fillStyle="rgba(120,190,255,.55)";g.beginPath();g.moveTo(8,-18);g.quadraticCurveTo(48,-14,46,14);g.lineTo(10,14);g.closePath();g.fill();
  g.fillStyle="rgba(255,255,255,.35)";g.beginPath();g.ellipse(-8,-30,16,5,-.3,0,TAU);g.fill();
  g.fillStyle="#e8832a";g.fillRect(-36,2,34,5);
  g.restore();
};

/* ---------- front-facing portraits for dialogue ---------- */
G.drawPortrait=function(cvs,who,expr){
  const def=Art.CHARS[who];const g=cvs.getContext("2d");g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,208,208);
  if(!def){g.fillStyle="#222836";g.fillRect(0,0,208,208);return}
  g.fillStyle=lg(g,0,0,208,208,[[0,shade(def.color,-.55)],[1,"#12151d"]]);g.fillRect(0,0,208,208);
  g.fillStyle="rgba(255,255,255,.07)";g.beginPath();g.arc(160,40,60,0,TAU);g.fill();
  const x=104,y=96,r=50;
  // shoulders
  g.fillStyle=def.top;g.beginPath();g.moveTo(10,208);g.quadraticCurveTo(14,150,60,140);g.lineTo(148,140);g.quadraticCurveTo(194,150,198,208);g.closePath();g.fill();
  if(def.top2&&def.lash){g.fillStyle=def.top2;g.globalAlpha=.9;g.beginPath();g.moveTo(40,150);g.quadraticCurveTo(80,170,104,208);g.lineTo(140,208);g.quadraticCurveTo(120,160,150,142);g.closePath();g.fill();g.globalAlpha=1}
  if(def.lanyard){g.strokeStyle="#fff";g.lineWidth=5;g.beginPath();g.moveTo(80,142);g.lineTo(104,200);g.lineTo(128,142);g.stroke()}
  g.fillStyle=def.skin;g.fillRect(x-14,y+30,28,40);
  // hair behind
  g.fillStyle=def.hair;
  if(def.style==="long"){g.beginPath();g.moveTo(x-r*1.05,y-10);g.quadraticCurveTo(x-r*1.4,y+90,x-r*.9,y+130);g.lineTo(x+r*.9,y+130);g.quadraticCurveTo(x+r*1.4,y+90,x+r*1.05,y-10);g.closePath();g.fill()}
  if(def.style==="bun")circ(g,x,y-r*1.05,r*.34,def.hair);
  // head
  g.fillStyle=lg(g,x-r,y-r,x+r,y+r,[[0,shade(def.skin,.1)],[1,shade(def.skin,-.08)]]);g.beginPath();g.ellipse(x,y,r*.92,r,0,0,TAU);g.fill();
  circ(g,x-r*.92,y+6,8,shade(def.skin,-.06));circ(g,x+r*.92,y+6,8,shade(def.skin,-.06));
  // hair front
  g.fillStyle=def.hair;g.beginPath();g.arc(x,y-4,r*1.0,Math.PI*1.04,Math.PI*1.96);
  if(def.style==="short"){g.quadraticCurveTo(x+r*.5,y-r*.55,x+r*.1,y-r*.5);g.quadraticCurveTo(x-r*.55,y-r*.45,x-r*.9,y-r*.1)}
  else{g.quadraticCurveTo(x+r*.2,y-r*.72,x-r*.15,y-r*.42);g.quadraticCurveTo(x-r*.7,y-r*.35,x-r*.95,y+r*.1);g.lineTo(x-r*.95,y)}
  g.closePath();g.fill();
  face(g,x,y,r,expr||"neutral",def,0,10,false);
  if(who==="SREEDEV"){Art.crown(g,x,y-r*.95,.9)}
};

/* ---------- Honda CB300R style bike (side view, facing right). origin = rear axle ground contact center ---------- */
Art.wheel=function(g,x,y,r,ang){
  g.save();g.translate(x,y);
  circ(g,0,0,r,"#15171c");circ(g,0,0,r*.84,"#2a2d35");circ(g,0,0,r*.78,"#c7ccd6");circ(g,0,0,r*.7,"#1b1e25");
  g.rotate(ang);g.strokeStyle="#cfd5df";g.lineWidth=r*.09;g.lineCap="round";
  for(let i=0;i<5;i++){const a=i/5*TAU;g.beginPath();g.moveTo(Math.cos(a)*r*.14,Math.sin(a)*r*.14);g.lineTo(Math.cos(a)*r*.72,Math.sin(a)*r*.72);g.stroke();
    g.beginPath();g.moveTo(Math.cos(a)*r*.62,Math.sin(a)*r*.62);g.lineTo(Math.cos(a+.3)*r*.72,Math.sin(a+.3)*r*.72);g.stroke()}
  g.restore();circ(g,x,y,r*.12,"#8f96a3");
  g.strokeStyle="#a9afbb";g.lineWidth=2;g.beginPath();g.arc(x,y,r*.45,0.3,TAU-0.4);g.stroke(); // disc
};
Art.bike=function(g,x,y,o){
  o=o||{};const s=o.s||1,wa=o.wheel||0,lean=o.lean||0,t=o.t||0,sus=o.sus||0;
  g.save();g.translate(x,y);g.scale(s,s);
  g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(100,2,170,12,0,0,TAU);g.fill();
  const R=64;
  // swingarm & rear
  g.strokeStyle="#2b2e35";g.lineWidth=12;g.lineCap="round";g.beginPath();g.moveTo(8,-R+6);g.lineTo(78,-R-26+sus);g.stroke();
  Art.wheel(g,0,-R,R,wa);
  // exhaust
  g.fillStyle=lg(g,20,-R+22,120,-R+40,[[0,"#8d94a1"],[.5,"#d3d8e1"],[1,"#80878f"]]);g.beginPath();g.moveTo(40,-R+6);g.lineTo(-30,-R-4);g.lineTo(-30,-R+14);g.lineTo(40,-R+34);g.closePath();g.fill();
  // tail
  g.fillStyle="#111318";g.beginPath();g.moveTo(-20,-R-78);g.lineTo(-50,-R-96);g.lineTo(-50,-R-86);g.lineTo(-6,-R-60);g.closePath();g.fill();
  g.fillStyle="#ff3b3b";g.fillRect(-52,-R-96,5,9);
  // frame trellis
  g.strokeStyle="#c7cad2";g.lineWidth=5;g.beginPath();g.moveTo(80,-R-26+sus);g.lineTo(120,-R-98);g.moveTo(80,-R-26+sus);g.lineTo(170,-R-70);g.moveTo(120,-R-98);g.lineTo(170,-R-70);g.moveTo(40,-R-22+sus);g.lineTo(80,-R-26+sus);g.stroke();
  // engine
  g.fillStyle=lg(g,60,-R-50,140,-R+20,[[0,"#454952"],[1,"#1b1e25"]]);rr(g,56,-R-52,98,62,14);g.fill();
  g.fillStyle="#7d848f";rr(g,86,-R-44,20,40,6);g.fill();g.fillStyle="#2b2f37";for(let i=0;i<4;i++)g.fillRect(112+i*9,-R-46,5,30);
  // seat
  g.fillStyle="#14161b";g.beginPath();g.moveTo(-34,-R-84);g.quadraticCurveTo(60,-R-104,130,-R-100);g.lineTo(130,-R-82);g.quadraticCurveTo(50,-R-80,-34,-R-70);g.closePath();g.fill();
  // tank
  g.fillStyle=lg(g,120,-R-150,240,-R-80,[[0,"#ff4d4d"],[.5,"#c91f2b"],[1,"#7d0f1a"]]);g.beginPath();g.moveTo(112,-R-102);g.quadraticCurveTo(130,-R-150,190,-R-142);g.quadraticCurveTo(240,-R-130,252,-R-96);g.lineTo(190,-R-84);g.quadraticCurveTo(150,-R-90,112,-R-90);g.closePath();g.fill();
  g.fillStyle="rgba(255,255,255,.35)";g.beginPath();g.ellipse(170,-R-130,36,5,-.1,0,TAU);g.fill();g.fillStyle="#111";g.fillRect(150,-R-108,64,5);
  // forks (gold USD)
  const fx=214,fy=-R;
  g.strokeStyle="#d9a441";g.lineWidth=11;g.beginPath();g.moveTo(fx-26,fy-98);g.lineTo(fx+4,fy);g.stroke();g.strokeStyle="#2b2e35";g.lineWidth=14;g.beginPath();g.moveTo(fx-26,fy-98);g.lineTo(fx-14,fy-62);g.stroke();
  Art.wheel(g,fx+4,fy,R,wa);
  // front fender
  g.fillStyle="#1a1d24";g.beginPath();g.arc(fx+4,fy,R+6,Math.PI*1.08,Math.PI*1.55);g.lineTo(fx+4,fy);g.closePath();g.fill();
  // headlight
  g.fillStyle="#2a2d35";g.beginPath();g.ellipse(fx+10,-R-110,28,26,.1,0,TAU);g.fill();
  const hl=o.lights?"#fffbe0":"#d8e6ff";g.fillStyle=hl;g.beginPath();g.ellipse(fx+24,-R-110,16,20,.1,0,TAU);g.fill();
  if(o.lights){const gr=g.createLinearGradient(fx+30,-R-110,fx+520,-R-30);gr.addColorStop(0,"rgba(255,248,210,.55)");gr.addColorStop(1,"rgba(255,248,210,0)");g.fillStyle=gr;g.beginPath();g.moveTo(fx+30,-R-122);g.lineTo(fx+520,-R-200);g.lineTo(fx+520,-R+20);g.lineTo(fx+30,-R-96);g.closePath();g.fill()}
  // handlebar & mirror
  g.strokeStyle="#15171b";g.lineWidth=6;g.beginPath();g.moveTo(fx-26,fy-98);g.lineTo(fx-52,fy-128);g.stroke();
  g.fillStyle="#1a1d24";g.beginPath();g.ellipse(fx-44,fy-150,11,8,-.4,0,TAU);g.fill();
  // peg
  g.strokeStyle="#9aa1ad";g.lineWidth=5;g.beginPath();g.moveTo(88,-R+8);g.lineTo(108,-R+14);g.stroke();
  g.restore();
};

/* riders for the bike: simple posed bodies in bike-local coordinates */
Art.rider=function(g,def,helmetCol,o){
  // o:{x,y(seat),lean,handX,handY,legs,scale,t,hairFlow,passenger}
  g.save();g.translate(o.x,o.y);const lean=o.lean||0;
  const col=def.top,pan=def.bottom;
  const hip={x:0,y:0},sh={x:Math.sin(lean)*108+(o.passenger?-4:10),y:-Math.cos(lean)*108};
  // far leg
  const leg=(dx,sh2)=>{g.strokeStyle=shade(pan,sh2);g.lineWidth=27;g.lineCap="round";g.beginPath();g.moveTo(0,0);g.lineTo(52+dx,4);g.lineTo(46+dx,62);g.stroke();g.fillStyle=def.shoe;g.beginPath();g.ellipse(58+dx,70,20,9,0,0,TAU);g.fill()};
  leg(0,-.25);
  // torso
  g.fillStyle=lg(g,0,0,sh.x,sh.y,[[0,shade(col,-.2)],[1,shade(col,.1)]]);g.beginPath();g.moveTo(-26,6);g.lineTo(sh.x-30,sh.y+4);g.quadraticCurveTo(sh.x,sh.y-14,sh.x+30,sh.y+2);g.lineTo(30,6);g.closePath();g.fill();
  if(def.lash){g.fillStyle=def.top2;g.globalAlpha=.85;g.beginPath();g.moveTo(sh.x-20,sh.y+4);g.quadraticCurveTo(sh.x*.6,sh.y*.5,-20,16);g.lineTo(-44,30+Math.sin(o.t*9)*5);g.lineTo(-36,8);g.closePath();g.fill();g.globalAlpha=1}
  // head
  const hx=sh.x+8,hy=sh.y-36;
  g.fillStyle=def.skin;g.fillRect(sh.x,sh.y-18,16,20);
  if(def.style==="long"){g.fillStyle=def.hair;g.beginPath();g.moveTo(hx-30,hy);const fl=(o.hairFlow||0);g.quadraticCurveTo(hx-60-fl*20,hy+40,hx-90-fl*40,hy+70+Math.sin(o.t*12)*8);g.lineTo(hx-30,hy+50);g.closePath();g.fill()}
  g.fillStyle=def.skin;g.beginPath();g.ellipse(hx,hy,31,34,0,0,TAU);g.fill();
  Art.helmet(g,hx,hy,helmetCol);
  // arm to handlebar
  const hxp=o.handX,hyp=o.handY;
  g.strokeStyle=shade(col,-.1);g.lineWidth=17;g.beginPath();g.moveTo(sh.x,sh.y+10);g.quadraticCurveTo((sh.x+hxp)/2,(sh.y+hyp)/2+20,hxp,hyp);g.stroke();
  circ(g,hxp,hyp,9,def.skin);
  // near leg
  leg(8,0);
  g.restore();
};

/* ---------- Mahindra BE 6 style EV (side view facing right; origin = rear axle ground) ---------- */
Art.car=function(g,x,y,o){
  o=o||{};const s=o.s||1;g.save();g.translate(x,y);g.scale(s,s);
  g.fillStyle="rgba(0,0,0,.4)";g.beginPath();g.ellipse(200,2,250,16,0,0,TAU);g.fill();
  const body=lg(g,0,-170,0,-30,[[0,"#d8dde6"],[.55,"#aab2bf"],[1,"#6f7784"]]);
  g.fillStyle=body;g.beginPath();g.moveTo(-70,-52);g.quadraticCurveTo(-78,-98,-52,-110);g.lineTo(60,-124);g.quadraticCurveTo(130,-176,230,-168);g.quadraticCurveTo(300,-150,350,-108);g.quadraticCurveTo(410,-96,424,-72);g.lineTo(426,-44);g.lineTo(-70,-44);g.closePath();g.fill();
  // lower cladding
  g.fillStyle="#262a31";g.beginPath();g.moveTo(-70,-44);g.lineTo(426,-44);g.lineTo(424,-30);g.lineTo(-66,-30);g.closePath();g.fill();
  // glass
  g.fillStyle=lg(g,60,-165,380,-110,[[0,"#1a2430"],[1,"#2c3a4a"]]);g.beginPath();g.moveTo(80,-120);g.quadraticCurveTo(138,-164,226,-160);g.quadraticCurveTo(290,-146,324,-112);g.closePath();g.fill();
  g.strokeStyle="#9aa3b0";g.lineWidth=3;g.beginPath();g.moveTo(206,-158);g.lineTo(208,-114);g.stroke();
  g.fillStyle="rgba(255,255,255,.18)";g.beginPath();g.moveTo(100,-122);g.quadraticCurveTo(150,-156,200,-156);g.lineTo(190,-122);g.closePath();g.fill();
  // shoulder line + handle
  g.strokeStyle="rgba(255,255,255,.6)";g.lineWidth=2;g.beginPath();g.moveTo(-60,-96);g.quadraticCurveTo(160,-104,410,-84);g.stroke();
  g.fillStyle="#444b57";g.fillRect(180,-100,28,5);
  // light bars (front right, tail left)
  const glow=o.lights!==false;
  g.fillStyle="#e8f6ff";g.fillRect(408,-98,16,5);if(glow){const gr=g.createLinearGradient(420,-96,820,-90);gr.addColorStop(0,"rgba(255,255,230,.55)");gr.addColorStop(1,"rgba(255,255,230,0)");g.fillStyle=gr;g.beginPath();g.moveTo(420,-104);g.lineTo(840,-170);g.lineTo(840,-30);g.lineTo(420,-86);g.closePath();g.fill()}
  g.fillStyle="#ff2a3a";g.fillRect(-72,-100,8,52);g.fillRect(-68,-104,6,6);g.fillStyle="#ff4a5a";g.fillRect(-70,-96,4,44);
  if(glow){g.fillStyle="rgba(255,40,60,.25)";g.beginPath();g.ellipse(-80,-76,40,26,0,0,TAU);g.fill()}
  // wheels
  for(const wx of [30,348]){circ(g,wx,-38,40,"#14161a");circ(g,wx,-38,29,"#c9ced8");circ(g,wx,-38,23,"#20242b");
    g.save();g.translate(wx,-38);g.rotate(o.wheel||0);g.strokeStyle="#d5dae3";g.lineWidth=5;for(let i=0;i<8;i++){const a=i/8*TAU;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*24,Math.sin(a)*24);g.stroke()}g.restore();circ(g,wx,-38,6,"#8f96a3")}
  // wheel arches
  g.strokeStyle="#262a31";g.lineWidth=7;for(const wx of [30,348]){g.beginPath();g.arc(wx,-38,46,Math.PI*1.02,Math.PI*1.98);g.stroke()}
  g.restore();
};

/* ---------- vegetation / props ---------- */
Art.palm=function(g,x,y,h,t,col){
  g.save();g.translate(x,y);
  g.strokeStyle=col?.trunk||"#4a3320";g.lineWidth=h*.05;g.lineCap="round";g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(h*.12,-h*.5,h*.06+Math.sin(t*.8)*2,-h);g.stroke();
  const tx=h*.06+Math.sin(t*.8)*2,ty=-h;
  for(let i=0;i<9;i++){const a=-Math.PI*.95+i/8*Math.PI*.9+Math.sin(t*1.1+i)*.05;g.strokeStyle=col?.leaf||"#1c5a34";g.lineWidth=h*.035;g.beginPath();g.moveTo(tx,ty);
    const ex=tx+Math.cos(a)*h*.5,ey=ty+Math.sin(a)*h*.35+h*.2;g.quadraticCurveTo(tx+Math.cos(a)*h*.3,ty+Math.sin(a)*h*.5,ex,ey);g.stroke()}
  g.restore();
};
Art.stars=function(g,t,n=90,seed=3){let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<n;i++){const x=r()*1280,y=r()*360,tw=.5+.5*Math.sin(t*1.5+i);g.fillStyle=`rgba(255,255,240,${.25+.6*tw*r()})`;g.fillRect(x,y,1.5+r()*1.5,1.5+r()*1.5)}};
Art.heart=function(g,x,y,s,col){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=col||"#ff5d8a";g.beginPath();g.moveTo(0,8);g.bezierCurveTo(-18,-6,-10,-20,0,-10);g.bezierCurveTo(10,-20,18,-6,0,8);g.fill();g.restore()};

/* simple particle bursts: hearts etc. */
Art.fx=[];
Art.burst=function(x,y,kind,n=14){for(let i=0;i<n;i++)Art.fx.push({x,y,vx:G.rand(-90,90),vy:G.rand(-200,-60),life:G.rand(1,1.8),age:0,kind,s:G.rand(.7,1.3),col:["#ff5d8a","#ff8fb1","#ffd166","#fff"][(Math.random()*4)|0],rot:G.rand(-1,1)})};
Art.updateFx=function(dt){for(const p of Art.fx){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=60*dt}Art.fx=Art.fx.filter(p=>p.age<p.life)};
Art.drawFx=function(g){for(const p of Art.fx){g.globalAlpha=Math.max(0,1-p.age/p.life);if(p.kind==="heart")Art.heart(g,p.x,p.y,p.s,p.col);
  else if(p.kind==="petal"){g.fillStyle=p.col;g.beginPath();g.ellipse(p.x,p.y,7*p.s,4*p.s,p.age*3,0,TAU);g.fill()}
  else{g.fillStyle=p.col;g.fillRect(p.x,p.y,4*p.s,4*p.s)}g.globalAlpha=1}};
})();
