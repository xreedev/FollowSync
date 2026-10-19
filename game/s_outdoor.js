/* ================= SCENES (outdoor, top-down): atrium, Nila loop; side-view: balcony ================= */
(function(){
"use strict";
const TAU=Math.PI*2;const {rr,circ,lg,rg,shade}=Art;const $=G.$;

/* ---------- top-down person ---------- */
S.topPerson=function(g,a,t,k){
  k=k||1;const d=a.def;const f=a.face||0;const moving=a.pose==="walk"||a.pose==="jog";
  const sw=moving?Math.sin(a.ph)*(a.pose==="jog"?5:3.6):0;
  g.save();g.translate(a.x,a.y);g.scale(k,k);
  g.fillStyle="rgba(0,0,0,.3)";g.beginPath();g.ellipse(2,3,9,8,0,0,TAU);g.fill();
  g.rotate(f);
  g.fillStyle="#222630";g.beginPath();g.ellipse(sw,3.6,4,2.6,0,0,TAU);g.fill();g.beginPath();g.ellipse(-sw,-3.6,4,2.6,0,0,TAU);g.fill();
  g.fillStyle=d.top;g.beginPath();g.ellipse(-.5,0,5.6,9,0,0,TAU);g.fill();g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=.8;g.stroke();
  if(d.lash&&d.top2){g.fillStyle=d.top2;g.globalAlpha=.85;g.beginPath();g.ellipse(-3,0,2.2,8.4,0,0,TAU);g.fill();g.globalAlpha=1}
  g.fillStyle=d.skin;g.beginPath();g.arc(2.5-sw*.4,-8,2.4,0,TAU);g.fill();g.beginPath();g.arc(2.5+sw*.4,8,2.4,0,TAU);g.fill();
  g.beginPath();g.arc(1,0,5,0,TAU);g.fill();
  g.fillStyle=d.hair;g.beginPath();g.arc(0,0,5.2,Math.PI*.4,Math.PI*1.6);g.fill();
  if(d.style==="long"){g.beginPath();g.ellipse(-6,0,5,3.4,0,0,TAU);g.fill()}
  if(a.hold){g.fillStyle="#fff";g.beginPath();g.arc(7,5,3,0,TAU);g.fill()}
  g.restore();
  a.bx=0;a.by=0;
};

/* ---------- shared outdoor tint ---------- */
S.outTint=function(g,m,strength){
  strength=strength==null?1:strength;
  if(m>=980&&m<1110){const a=Math.min(.22,(m-980)/130*.22)*strength;g.fillStyle=`rgba(255,130,40,${a})`;g.fillRect(0,0,1280,720)}
  else if(m>=1110&&m<1200){const p=(m-1110)/90;g.fillStyle=`rgba(40,36,90,${(.22+p*.2)*strength})`;g.fillRect(0,0,1280,720)}
  else if(m>=1200){g.fillStyle=`rgba(10,14,40,${.5*strength})`;g.fillRect(0,0,1280,720)}
};

/* =====================================================================
   ATRIUM (top-down courtyard — the canteen with four kiosks)
   ===================================================================== */
const COURT=[130,130,970,970],PYR=[430,460,670,640];
const QC=[[331,331],[769,331],[331,769],[769,769]];
const KIOSK=[
  {name:"SUDA SUDA",sub:"Rice · Noodles · Biriyani · Tea",front:"E",roof:"tile",r:[256,281,406,381]},
  {name:"Kiosk 2",sub:"Snacks",front:"W",roof:"pitch",r:[694,281,844,381]},
  {name:"Kiosk 3",sub:"Juice bar",front:"E",roof:"tile",r:[256,719,406,819]},
  {name:"Kiosk 4",sub:"Ice cream",front:"W",roof:"pink",r:[694,719,844,819]}
];
const UMBCOL={dark:["#3b4047","#4c525a"],yellow:["#f0c040","#f7d870"],orange:["#e0612a","#f08a52"],green:["#3d9b4f","#f2f4f2"]};
const UMBS=[];{const OFF=[[-140,-130],[0,-150],[140,-130],[-140,130],[0,150],[140,130]],COL=["dark","yellow","orange","green"];
  QC.forEach(([qx,qy],i)=>OFF.forEach(o=>{const u={x:qx+o[0],y:qy+o[1],c:COL[i]};const palms=[[172,172],[928,172],[172,928],[928,928]];
    if(!palms.some(p=>Math.hypot(p[0]-u.x,p[1]-u.y)<62)&&!(u.x>375&&u.x<725&&u.y>405&&u.y<695))UMBS.push(u)}))}
const PLANTS=[[385,415],[715,415],[385,685],[715,685],[550,175],[550,925],[925,550]],PALMS=[[172,172],[928,172],[172,928],[928,928]];
const BRICK=S.cache(96,48,(x,w,h)=>{x.fillStyle="#8f4a36";x.fillRect(0,0,w,h);let s=5;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let rw=0;rw<4;rw++)for(let c=-1;c<4;c++){const ox=(rw%2)*12;x.fillStyle=`hsl(${12+r()*8},${52+r()*10}%,${46+r()*7}%)`;x.fillRect(c*24+ox+1,rw*12+1,22,10)}});
const GREY=S.cache(48,48,(x,w,h)=>{x.fillStyle="#6f747c";x.fillRect(0,0,w,h);x.fillStyle="#838992";x.fillRect(0,0,24,24);x.fillRect(24,24,24,24);x.strokeStyle="rgba(0,0,0,.25)";x.strokeRect(0,0,w,h)});
S.Atrium={
  enter(o){
    o=o||{};G.showClock=true;this.z=2.0;this.cam={x:200,y:550};this.t0=G.t;this.night=!!o.night;
    const mk=(n,x,y)=>S.person(n,{x,y,face:0,pose:"stand",ph:0,label:n!=="NAVYA"});
    this.dev=mk("ANAMIKA",180,556);this.sree=mk("SREEDEV",150,548);this.navya=mk("NAVYA",1,1);this.navya.vis=false;
    this.follow=this.dev;this.crowd=[];
    for(let i=0;i<9;i++){const sp=[[550,200],[550,420],[250,550],[900,550],[330,480],[770,480],[240,780],[860,780],[550,900]][i];
      const c=S.person(["NAVYA","SIDHU","VENDOR"][i%3],{x:sp[0],y:sp[1],face:Math.random()*TAU,pose:"stand"});c.shirt=["#3b6ea5","#8a4f7d","#4f8a6b","#b5654a","#555b6e","#c79a3a"][i%6];c.wander=Math.random()*5;c.tx=sp[0];c.ty=sp[1];this.crowd.push(c)}
    this.pat=null;G.chapter(o.ch||4,o.title||"Suda Suda");A.setMusic(this.night?"night":"warm");
  },
  walkRoute(actor,pts,o={}){
    return new Promise(async res=>{for(const p of pts){await new Promise(r=>{actor.task={x:p[0],y:p[1],speed:o.speed||120,pose:"walk",end:"walk",res:r,vertical:true}})}actor.pose="stand";actor.task=null;res()});
  },
  stepTop(a,dt){const tk=a.task;if(!tk)return;const dx=tk.x-a.x,dy=tk.y-a.y,d=Math.hypot(dx,dy);if(d<2.5){a.x=tk.x;a.y=tk.y;a.task=null;tk.res();return}
    const st=Math.min(d,tk.speed*dt);a.x+=dx/d*st;a.y+=dy/d*st;a.pose=tk.pose;a.face=Math.atan2(dy,dx);a.ph+=st*.09},
  update(dt){
    this.stepTop(this.dev,dt);this.stepTop(this.sree,dt);this.stepTop(this.navya,dt);Art.updateFx(dt);
    const f=this.follow;this.cam.x+=(f.x-this.cam.x)*Math.min(1,dt*3);this.cam.y+=(f.y-this.cam.y)*Math.min(1,dt*3);
    for(const c of this.crowd){c.wander-=dt;if(c.wander<=0&&!c.task){c.wander=3+Math.random()*4;const a=Math.random()*TAU;c.tx=G.clamp(c.x+Math.cos(a)*90,150,950);c.ty=G.clamp(c.y+Math.sin(a)*90,150,950);
      const bad=(x,y)=>KIOSK.some(k=>x>k.r[0]-18&&x<k.r[2]+18&&y>k.r[1]-18&&y<k.r[3]+18)||(x>PYR[0]-20&&x<PYR[2]+20&&y>PYR[1]-20&&y<PYR[3]+20)||UMBS.some(u=>Math.hypot(u.x-x,u.y-y)<26);
      if(!bad(c.tx,c.ty))c.task={x:c.tx,y:c.ty,speed:38,pose:"walk",end:"stand",res:()=>{}}}
      this.stepTop(c,dt)}
  },
  draw(g){
    const t=G.t,z=this.z;
    g.fillStyle="#0e1014";g.fillRect(0,0,1280,720);
    g.save();g.translate(640-this.cam.x*z,360-this.cam.y*z);g.scale(z,z);
    // pavement
    g.fillStyle="#e9ecf0";g.fillRect(-300,-300,1700,1700);
    g.fillStyle=g.createPattern(BRICK,"repeat");g.fillRect(COURT[0],COURT[1],COURT[2]-COURT[0],COURT[3]-COURT[1]);
    g.fillStyle=g.createPattern(GREY,"repeat");g.fillRect(532,COURT[1],36,COURT[3]-COURT[1]);g.fillRect(COURT[0],532,COURT[2]-COURT[0],36);g.fillRect(400,430,300,240);
    g.strokeStyle="#e8d9c8";g.lineWidth=3;g.strokeRect(400,430,300,240);g.lineWidth=2;g.strokeStyle="rgba(232,217,200,.5)";for(const [qx,qy] of [[142,142],[580,142],[142,580],[580,580]])g.strokeRect(qx,qy,378,378);
    // stairs landing (the lift lobby)
    for(let i=0;i<6;i++){g.fillStyle=i%2?"#bfc3ca":"#d6d9de";g.fillRect(136+i*10,520,10,60)}
    g.fillStyle="#222833";rr(g,134,500,64,18,4);g.fill();g.fillStyle="#ff9a3d";g.font="700 9px system-ui";g.textAlign="center";g.fillText("LIFT LOBBY",166,513);
    this.pyramid(g);
    for(const k of KIOSK)this.kiosk(g,k,t);
    for(const u of UMBS)this.table(g,u);
    for(const p of PLANTS)this.planter(g,p);
    // people
    for(const c of this.crowd)S.drawPerson(g,c,t,.9);
    S.drawPerson(g,this.navya,t,1);S.drawPerson(g,this.sree,t,1);S.drawPerson(g,this.dev,t,1);
    this.canopies(g,t);
    if(this.night||G.time>=1110){this.lights(g,t)}
    g.restore();
    // anchors for bubbles
    for(const a of [this.dev,this.sree,this.navya]){a.bx=640+(a.x-this.cam.x)*z;a.by=360+(a.y-this.cam.y)*z-22}
    G.drawBubbles(g);
    S.outTint(g,G.time);S.vignette(g,.42);
  },
  pyramid(g){
    const [x1,y1,x2,y2]=PYR,cx=(x1+x2)/2,cy=(y1+y2)/2;g.fillStyle="rgba(0,0,0,.3)";g.fillRect(x1+8,y1+8,x2-x1,y2-y1);
    g.fillStyle="#cfd5db";g.fillRect(x1-8,y1-8,x2-x1+16,y2-y1+16);
    for(const [a,b,c] of [[[x1,y1],[x2,y1],"#9fc9cf"],[[x2,y1],[x2,y2],"#6fa6ae"],[[x2,y2],[x1,y2],"#86b8bf"],[[x1,y2],[x1,y1],"#a9d3d8"]]){g.fillStyle=c;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(cx,cy);g.closePath();g.fill();g.strokeStyle="rgba(255,255,255,.75)";g.lineWidth=2;g.stroke()}
    const gr=g.createLinearGradient(x1,y1,x2,y2);gr.addColorStop(0,"rgba(255,255,255,.28)");gr.addColorStop(.5,"rgba(255,255,255,0)");gr.addColorStop(1,"rgba(255,255,255,.14)");g.fillStyle=gr;g.fillRect(x1,y1,x2-x1,y2-y1);
    if(G.time>=1100){g.fillStyle="rgba(255,230,150,.35)";g.fillRect(x1,y1,x2-x1,y2-y1)}
  },
  kiosk(g,k,t){
    const [x1,y1,x2,y2]=k.r,w=x2-x1,h=y2-y1;g.fillStyle="rgba(0,0,0,.38)";g.fillRect(x1+6,y1+6,w,h);g.fillStyle="#f2f0ea";g.fillRect(x1,y1,w,h);
    g.fillStyle="#c9ced6";const cw=10;if(k.front==="E")g.fillRect(x2-cw,y1+6,cw,h-12);else g.fillRect(x1,y1+6,cw,h-12);
    const o=7,rx=x1-o,ry=y1-o,rw=w+2*o,rh=h+2*o,col=k.roof==="pink"?"#e58ab0":"#d9772e",dk=k.roof==="pink"?"#b9618a":"#a85a1c";
    if(k.roof==="pitch"){g.fillStyle=col;g.fillRect(rx,ry,rw,rh/2);g.fillStyle=dk;g.fillRect(rx,ry+rh/2,rw,rh/2);g.fillStyle="rgba(255,255,255,.35)";g.fillRect(rx,ry+rh/2-1.5,rw,3)}else{g.fillStyle=col;g.fillRect(rx,ry,rw,rh)}
    g.fillStyle="rgba(0,0,0,.18)";for(let x=rx+8;x<rx+rw;x+=9)g.fillRect(x,ry,1.5,rh);g.strokeStyle=dk;g.lineWidth=2;g.strokeRect(rx,ry,rw,rh);
    for(let i=0;i<8;i++){g.fillStyle=i%2?"#fff":"#e8832a";if(k.front==="E")g.fillRect(x2+o-1,y1+i*h/8,8,h/8);else g.fillRect(x1-o-7,y1+i*h/8,8,h/8)}
    g.textAlign="center";g.textBaseline="middle";g.shadowColor="rgba(0,0,0,.7)";g.shadowBlur=4;g.fillStyle="#fff";
    if(k.name==="SUDA SUDA"){g.font="700 22px system-ui";g.fillText(k.name,(x1+x2)/2,(y1+y2)/2-8);g.font="600 8.5px system-ui";g.fillText(k.sub,(x1+x2)/2,(y1+y2)/2+12)}
    else{g.font="700 13px system-ui";g.fillText(k.name.toUpperCase(),(x1+x2)/2,(y1+y2)/2-6);g.font="600 9px system-ui";g.fillText(k.sub,(x1+x2)/2,(y1+y2)/2+8)}
    g.shadowBlur=0;g.textBaseline="alphabetic";
  },
  table(g,u){g.fillStyle="rgba(0,0,0,.28)";g.beginPath();g.arc(u.x+3,u.y+3,13,0,TAU);g.fill();g.fillStyle="#f3efe6";g.beginPath();g.arc(u.x,u.y,12,0,TAU);g.fill();g.strokeStyle="#9c9488";g.lineWidth=1;g.stroke();
    for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;g.fillStyle="#2a2e35";g.beginPath();g.arc(u.x+Math.cos(a)*21,u.y+Math.sin(a)*21,5.5,0,TAU);g.fill()}},
  planter(g,p){g.fillStyle="rgba(0,0,0,.3)";g.beginPath();g.arc(p[0]+4,p[1]+4,22,0,TAU);g.fill();g.fillStyle="#8c4a34";g.beginPath();g.arc(p[0],p[1],22,0,TAU);g.fill();g.fillStyle="#5a4630";g.beginPath();g.arc(p[0],p[1],16,0,TAU);g.fill()},
  canopies(g,t){
    for(const u of UMBS){const [a,b]=UMBCOL[u.c];g.fillStyle="rgba(0,0,0,.2)";g.beginPath();g.arc(u.x+6,u.y+7,36,0,TAU);g.fill();g.globalAlpha=.9;
      for(let i=0;i<8;i++){g.fillStyle=i%2?b:a;g.beginPath();g.moveTo(u.x,u.y);g.arc(u.x,u.y,36,i*Math.PI/4,(i+1)*Math.PI/4);g.closePath();g.fill()}g.globalAlpha=1;g.fillStyle="#222";g.beginPath();g.arc(u.x,u.y,2.5,0,TAU);g.fill()}
    for(const p of PLANTS){g.fillStyle="rgba(0,0,0,.2)";g.beginPath();g.arc(p[0]+5,p[1]+6,30,0,TAU);g.fill();for(let i=0;i<9;i++){const a=i*.7+Math.sin(t/1.6+i)*.04;g.fillStyle=i%2?"#2f7d3f":"#3f9a50";g.beginPath();g.arc(p[0]+Math.cos(a)*14,p[1]+Math.sin(a)*14,15,0,TAU);g.fill()}g.fillStyle="#58b869";g.beginPath();g.arc(p[0]-3,p[1]-3,14,0,TAU);g.fill()}
    for(const p of PALMS){for(let i=0;i<9;i++){const a=i/9*TAU+Math.sin(t*1.2+i)*.05;g.save();g.translate(p[0],p[1]);g.rotate(a);g.fillStyle=i%2?"#2f7d3f":"#44a156";g.beginPath();g.ellipse(22,0,24,5,0,0,TAU);g.fill();g.restore()}g.fillStyle="#6e4b2b";g.beginPath();g.arc(p[0],p[1],5,0,TAU);g.fill()}
  },
  lights(g,t){
    g.save();g.globalCompositeOperation="lighter";
    for(const [x,y] of [[550,200],[550,420],[550,700],[550,900],[200,550],[420,550],[700,550],[900,550],[331,331],[769,331],[331,769],[769,769]]){const gr=g.createRadialGradient(x,y,2,x,y,90);gr.addColorStop(0,"rgba(255,200,110,.5)");gr.addColorStop(1,"rgba(255,200,110,0)");g.fillStyle=gr;g.fillRect(x-90,y-90,180,180)}
    g.restore();
  }
};

/* =====================================================================
   LOOP — Nila building ring road (top-down). Three laps.
   ===================================================================== */
const RING={cx:640,cy:372,hw:470,hh:246,r:120};
S.Loop={
  buildRing(){
    const {cx,cy,hw,hh,r}=RING;const pts=[];
    const arc=(ax,ay,a0,a1)=>{for(let i=0;i<=16;i++){const a=a0+(a1-a0)*i/16;pts.push([ax+Math.cos(a)*r,ay+Math.sin(a)*r])}};
    // clockwise starting at bottom centre, going west (screen coords: y down)
    for(let x=cx;x>=cx-hw+r;x-=10)pts.push([x,cy+hh]);
    arc(cx-hw+r,cy+hh-r,Math.PI/2,Math.PI);                // SW corner -> west side
    for(let y=cy+hh-r;y>=cy-hh+r;y-=10)pts.push([cx-hw,y]);
    arc(cx-hw+r,cy-hh+r,Math.PI,Math.PI*1.5);               // NW
    for(let x=cx-hw+r;x<=cx+hw-r;x+=10)pts.push([x,cy-hh]);
    arc(cx+hw-r,cy-hh+r,Math.PI*1.5,Math.PI*2);             // NE
    for(let y=cy-hh+r;y<=cy+hh-r;y+=10)pts.push([cx+hw,y]);
    arc(cx+hw-r,cy+hh-r,0,Math.PI/2);                       // SE
    for(let x=cx+hw-r;x>=cx;x-=10)pts.push([x,cy+hh]);
    const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
    this.pts=pts;this.cum=cum;this.len=cum[cum.length-1];
    const near=(px,py)=>{let b=0,bd=1e9;pts.forEach((p,i)=>{const d=Math.hypot(p[0]-px,p[1]-py);if(d<bd){bd=d;b=i}});return cum[b]};
    this.cps=[{name:"Reception forecourt",s:this.len,x:cx,y:cy+hh},{name:"West road",s:near(cx-hw,cy),x:cx-hw,y:cy},{name:"Technopark Rd (north)",s:near(cx,cy-hh),x:cx,y:cy-hh},{name:"East road",s:near(cx+hw,cy),x:cx+hw,y:cy}];
  },
  at(s){s=G.clamp(s,0,this.len-.01);let i=1;while(i<this.cum.length-1&&this.cum[i]<s)i++;const a=this.pts[i-1],b=this.pts[i],t=(s-this.cum[i-1])/Math.max(.01,this.cum[i]-this.cum[i-1]);
    return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,f:Math.atan2(b[1]-a[1],b[0]-a[0])}},
  enter(o){
    if(!this.pts)this.buildRing();G.showClock=true;G.chapter(5,"Three Rounds of Nila");
    this.s=0;this.v=0;this.lap=0;this.next=1;this.done=false;this.res=null;this.laps=3;this.gap=60;this.sg=0;this.hold=0;this.flash=0;this.msg="";this.msgT=0;
    this.dev=S.person("ANAMIKA",{label:true,});this.sree=S.person("SREEDEV",{label:true});
    this.bg=S.cache(1280,720,(g)=>this.paint(g));A.setMusic("ride");
  },
  paint(g){
    const {cx,cy,hw,hh}=RING;
    // grass + texture
    g.fillStyle=lg(g,0,0,0,720,[[0,"#4f8a4a"],[1,"#3f7a3e"]]);g.fillRect(0,0,1280,720);
    let s=9;const r=()=>(s=(s*16807)%2147483647)/2147483647;
    for(let i=0;i<1800;i++){g.fillStyle=`rgba(${r()<.5?20:140},${120+r()*60|0},${r()<.5?30:70},.12)`;g.fillRect(r()*1280,r()*720,3,3)}
    // outer lots / neighbours
    const lot=(x,y,w,h,c,l)=>{g.fillStyle="rgba(0,0,0,.25)";g.fillRect(x+6,y+6,w,h);g.fillStyle=c;g.fillRect(x,y,w,h);g.fillStyle="rgba(255,255,255,.15)";g.fillRect(x,y,w,6);if(l){g.fillStyle="#fff";g.font="600 13px system-ui";g.textAlign="center";g.fillText(l,x+w/2,y+h/2+4)}};
    lot(20,20,150,70,"#b9604a","IIITMK");lot(1110,18,150,66,"#7e8794","Gayatri Bldg");lot(24,640,120,60,"#a24f3e","Wonderla Office");lot(1130,632,126,64,"#6f7a8a","IBS Campus");
    // parking (P)
    g.fillStyle="#4a4f58";g.fillRect(1010,612,150,86);g.strokeStyle="#fff";g.lineWidth=2;for(let i=0;i<7;i++){g.beginPath();g.moveTo(1022+i*20,620);g.lineTo(1022+i*20,650);g.stroke()}
    for(const [x,c] of [[1034,"#c33"],[1074,"#39c"],[1114,"#ddd"]]){g.fillStyle=c;g.fillRect(x,624,14,24)}
    g.fillStyle="#1b66d6";g.beginPath();g.arc(1150,632,15,0,TAU);g.fill();g.fillStyle="#fff";g.font="700 18px system-ui";g.textAlign="center";g.fillText("P",1150,639);
    // Silicon Square roundabout
    g.fillStyle="#3a3f48";g.beginPath();g.arc(1190,560,52,0,TAU);g.fill();g.fillStyle="#3f7a3e";g.beginPath();g.arc(1190,560,22,0,TAU);g.fill();g.fillStyle="#fff";g.font="600 12px system-ui";g.fillText("Silicon Square",1190,486);
    // ring road
    const road=(w,col)=>{g.strokeStyle=col;g.lineWidth=w;g.lineJoin="round";g.beginPath();g.roundRect(cx-hw,cy-hh,hw*2,hh*2,RING.r);g.stroke()};
    road(66,"#c7c3b6");road(58,"#3a3f49");
    g.setLineDash([22,18]);g.strokeStyle="#e8d37a";g.lineWidth=3;g.beginPath();g.roundRect(cx-hw,cy-hh,hw*2,hh*2,RING.r);g.stroke();g.setLineDash([]);
    // road label
    g.save();g.translate(cx-80,cy-hh-40);g.fillStyle="#fff";g.font="700 18px system-ui";g.textAlign="center";g.fillText("TECHNOPARK RD",0,0);g.restore();
    // forecourt P / entrance
    g.fillStyle="#d6d1c0";g.fillRect(cx-90,cy+hh-80,180,60);g.fillStyle="#b9b39f";g.fillRect(cx-90,cy+hh-82,180,4);
    // building (roof top-down)
    const bx=cx-380,by=cy-170,bw=760,bh=330;
    g.fillStyle="rgba(0,0,0,.4)";g.fillRect(bx+12,by+12,bw,bh);
    g.fillStyle="#d6d9de";g.fillRect(bx,by,bw,bh);
    g.fillStyle=lg(g,bx,by,bx+bw,by,[[0,"#c6563a"],[.5,"#d9694a"],[1,"#c6563a"]]);g.fillRect(bx+14,by+14,bw-28,bh-28);
    for(let i=0;i<30;i++){g.fillStyle="rgba(0,0,0,.14)";g.fillRect(bx+14,by+14+i*10.5,bw-28,2)}
    // glass atrium roof (dark panels) in the middle like the satellite view
    g.fillStyle="#232c36";g.fillRect(bx+170,by+54,420,226);g.strokeStyle="#7f8d9c";g.lineWidth=2;for(let i=0;i<=14;i++){g.beginPath();g.moveTo(bx+170+i*30,by+54);g.lineTo(bx+170+i*30,by+280);g.stroke()}for(let i=0;i<=5;i++){g.beginPath();g.moveTo(bx+170,by+54+i*45);g.lineTo(bx+590,by+54+i*45);g.stroke()}
    g.fillStyle="rgba(150,200,230,.12)";g.fillRect(bx+170,by+54,420,226);
    g.fillStyle="#fff";g.font="700 26px system-ui";g.textAlign="center";g.fillText("NILA BUILDING",cx,by+bh/2+10);
    // trees
    const tree=(x,y,rad)=>{g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.arc(x+5,y+6,rad,0,TAU);g.fill();g.fillStyle="#2e7a3d";g.beginPath();g.arc(x,y,rad,0,TAU);g.fill();g.fillStyle="#46a357";g.beginPath();g.arc(x-rad*.25,y-rad*.25,rad*.65,0,TAU);g.fill()};
    for(let i=0;i<26;i++){const a=i/26*TAU,rx=cx+Math.cos(a)*(hw+84),ry=cy+Math.sin(a)*(hh+66);if(rx>10&&rx<1270&&ry>10&&ry<710&&!(rx>1000&&ry>540))tree(rx,ry,16+r()*10)}
    for(let i=0;i<8;i++)tree(bx-26+r()*8,by+30+i*38,13);for(let i=0;i<8;i++)tree(bx+bw+26,by+30+i*38,13);
    // checkpoint pads
    for(const c of this.cps){g.fillStyle="rgba(255,209,102,.22)";g.beginPath();g.arc(c.x,c.y,36,0,TAU);g.fill()}
  },
  update(dt){
    if(this.done)return;
    const run=G.down(" ","d","arrowright","arrowup","w")||G.ptr.down;
    const vmax=170;this.v=run?Math.min(vmax,this.v+260*dt):Math.max(0,this.v-420*dt);
    const prev=this.s;this.s+=this.v*dt;
    // checkpoint logic
    const cp=this.cps[this.next%4],target=this.next%4===0?this.len:cp.s;
    const lapBase=this.lap*this.len,pos=this.s;
    // track using arc position with wrap: pos in [0,len)
    if(this.next%4===0){ if(this.s>=this.len){this.s-=this.len;this.hit()} }
    else if(this.s>=cp.s&&prev<cp.s+1){this.hit()}
    // follower lag grows slightly per lap
    this.gap=60+this.lap*55;
    let ls=this.s-this.gap;if(ls<0&&this.lap===0)ls=Math.max(0,ls);else if(ls<0)ls+=this.len;
    this.sg+=((this.lap>0||this.s>this.gap?ls:0)-this.sg)*Math.min(1,dt*6);
    const p=this.at(this.s),q=this.at(this.lap===0&&this.s<this.gap?0:this.sg);
    Object.assign(this.dev,{x:p.x,y:p.y,face:p.f,pose:this.v>5?"jog":"stand",ph:this.dev.ph+(this.v>5?this.v*dt*.075:0)});
    Object.assign(this.sree,{x:q.x,y:q.y,face:q.f,pose:this.v>5?"jog":"stand",ph:this.sree.ph+(this.v>5?this.v*dt*.062:0)});
    if(this.v>5&&Math.random()<dt*10)A.sfx("step");
    if(this.msgT>0)this.msgT-=dt;if(this.flash>0)this.flash-=dt;
  },
  hit(){
    const wasS=this.next%4===0;A.sfx("ding");this.flash=.6;this.next++;
    if(wasS){this.lap++;if(this.onLap)this.onLap(this.lap);
      if(this.lap>=this.laps){this.done=true;this.v=0;if(this.res)this.res()}}
    else{this.msg="Checkpoint: "+this.cps[(this.next-1)%4].name;this.msgT=1.6}
  },
  run(onLap){this.onLap=onLap;return new Promise(r=>{this.res=r})},
  devFinish(){for(let i=1;i<=this.laps;i++){this.lap=i;if(this.onLap)this.onLap(i)}this.done=true;if(this.res)this.res()},
  draw(g){
    g.drawImage(this.bg,0,0);const t=G.t;
    // next checkpoint beacon
    const cp=this.cps[this.next%4];const pr=.5+.5*Math.sin(t*5);g.strokeStyle=`rgba(255,209,102,${.5+pr*.5})`;g.lineWidth=4;g.beginPath();g.arc(cp.x,cp.y,34+pr*8,0,TAU);g.stroke();
    g.fillStyle="#ffd166";g.font="700 14px system-ui";g.textAlign="center";g.fillText(cp.name.toUpperCase(),cp.x,cp.y-52);
    g.beginPath();g.moveTo(cp.x,cp.y-44);g.lineTo(cp.x-8,cp.y-56);g.lineTo(cp.x+8,cp.y-56);g.closePath();
    // runners
    S.drawPerson(g,this.sree,t,1.7);S.drawPerson(g,this.dev,t,1.7);
    this.dev.bx=this.dev.x;this.dev.by=this.dev.y-34;this.sree.bx=this.sree.x;this.sree.by=this.sree.y-34;
    G.drawBubbles(g);
    // HUD card
    g.fillStyle="rgba(10,12,18,.82)";g.beginPath();g.roundRect(470,228,340,112,16);g.fill();g.strokeStyle="rgba(255,255,255,.16)";g.stroke();
    g.fillStyle="#ffd166";g.font="700 26px system-ui";g.textAlign="left";g.fillText("Lap "+Math.min(this.laps,this.lap+1)+" / "+this.laps,490,264);
    g.fillStyle="#d6dae3";g.font="500 17px system-ui";g.fillText("Next: "+cp.name,490,291);
    for(let i=0;i<4;i++){const done=(this.next-1)%4>=i&&this.next>1||false;g.fillStyle=((this.next%4)===0?3:(this.next%4)-1)>=i?"#ffd166":"#3a4254";g.beginPath();g.arc(498+i*30,314,8,0,TAU);g.fill()}
    g.fillStyle="rgba(255,255,255,.55)";g.font="500 15px system-ui";g.fillText("Hold SPACE / click to run",630,318);
    if(this.msgT>0){g.fillStyle=`rgba(10,12,18,${Math.min(.8,this.msgT)})`;g.beginPath();g.roundRect(400,640,480,48,24);g.fill();g.fillStyle="#fff";g.font="600 20px system-ui";g.textAlign="center";g.fillText(this.msg,640,671)}
    S.outTint(g,G.time,.8);S.vignette(g,.3);
  }
};

})();
