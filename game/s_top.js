/* ================= TOP-DOWN SCENES: parking, beach, restaurants, visitors' area (same small sprites) ================= */
(function(){
"use strict";
const TAU=Math.PI*2;const {rr,lg,rg}=Art;const $=G.$;
const hash=(n)=>{let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const K=2.3; // sprite scale in full-screen scenes (explorer size × zoom)
const anchor=(a,ox,oy,z,sc)=>{a.bx=ox+(a.x-(sc||0))*z;a.by=oy+a.y*z-24};

/* top-down motorbike (CB300R silhouette) */
S.bikeTop=function(g,x,y,rot,k,lit){
  g.save();g.translate(x,y);g.rotate(rot);g.scale(k,k);
  g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(3,4,34,12,0,0,TAU);g.fill();
  if(lit){const gr=g.createLinearGradient(30,0,200,0);gr.addColorStop(0,"rgba(255,248,210,.6)");gr.addColorStop(1,"rgba(255,248,210,0)");g.fillStyle=gr;g.beginPath();g.moveTo(32,-5);g.lineTo(200,-52);g.lineTo(200,52);g.lineTo(32,5);g.fill()}
  g.fillStyle="#15171c";g.beginPath();g.roundRect(-34,-4.5,16,9,4);g.fill();g.beginPath();g.roundRect(18,-4.5,16,9,4);g.fill();   // tyres
  g.fillStyle="#2b2f37";g.fillRect(-22,-3,40,6);                                                                                  // frame
  g.fillStyle="#c91f2b";g.beginPath();g.roundRect(-4,-7,24,14,6);g.fill();g.fillStyle="rgba(255,255,255,.35)";g.fillRect(2,-4,12,2);  // tank
  g.fillStyle="#14161b";g.beginPath();g.roundRect(-18,-5.5,16,11,4);g.fill();                                                      // seat
  g.strokeStyle="#15171b";g.lineWidth=2;g.beginPath();g.moveTo(20,-12);g.lineTo(22,12);g.stroke();                                // bars
  g.fillStyle="#fffbe0";g.beginPath();g.arc(29,0,3.2,0,TAU);g.fill();
  g.fillStyle="#ff3b3b";g.fillRect(-36,-2,3,4);
  g.restore();
};
/* top-down BE 6 style EV */
S.carTop=function(g,x,y,rot,k,lit){
  g.save();g.translate(x,y);g.rotate(rot);g.scale(k,k);
  g.fillStyle="rgba(0,0,0,.38)";g.beginPath();g.roundRect(-62,-34,130,76,16);g.fill();
  if(lit){const gr=g.createLinearGradient(66,0,300,0);gr.addColorStop(0,"rgba(255,250,220,.55)");gr.addColorStop(1,"rgba(255,250,220,0)");g.fillStyle=gr;g.beginPath();g.moveTo(66,-26);g.lineTo(300,-80);g.lineTo(300,80);g.lineTo(66,26);g.fill()}
  g.fillStyle="#14161a";for(const [wx,wy] of [[-42,-35],[34,-35],[-42,29],[34,29]])g.fillRect(wx,wy,22,7);
  g.fillStyle=lg(g,0,-34,0,34,[[0,"#e8ecf2"],[1,"#aab2bf"]]);g.beginPath();g.roundRect(-64,-32,130,64,18);g.fill();g.strokeStyle="#7c8594";g.lineWidth=1.2;g.stroke();
  g.fillStyle="#1a2230";g.beginPath();g.moveTo(14,-24);g.lineTo(34,-20);g.lineTo(34,20);g.lineTo(14,24);g.closePath();g.fill();               // windscreen
  g.fillStyle="#222b3a";g.beginPath();g.roundRect(-34,-22,46,44,8);g.fill();g.fillStyle="#cfd5df";g.beginPath();g.roundRect(-30,-19,38,38,6);g.fill(); // glass roof
  g.fillStyle="#1a2230";g.beginPath();g.moveTo(-50,-20);g.lineTo(-40,-18);g.lineTo(-40,18);g.lineTo(-50,20);g.closePath();g.fill();
  g.fillStyle="#bff0ff";g.fillRect(60,-26,3,52);g.fillStyle="#ff2a3a";g.fillRect(-63,-26,3,52);
  g.fillStyle="rgba(180,230,255,.5)";g.fillRect(58,-30,4,6);g.fillRect(58,24,4,6);
  g.restore();
};
const lamp=(g,x,y,r)=>{const gr=g.createRadialGradient(x,y,2,x,y,r);gr.addColorStop(0,"rgba(255,214,140,.55)");gr.addColorStop(1,"rgba(255,214,140,0)");g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);g.fillStyle="#ffe7b0";g.beginPath();g.arc(x,y,4,0,TAU);g.fill()};
const tree=(g,x,y,r,night)=>{g.fillStyle="rgba(0,0,0,.28)";g.beginPath();g.arc(x+6,y+7,r,0,TAU);g.fill();g.fillStyle=night?"#143020":"#2e7a3d";g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.fillStyle=night?"#1c4a2e":"#46a357";g.beginPath();g.arc(x-r*.25,y-r*.25,r*.62,0,TAU);g.fill()};

/* =====================================================================
   PARKING — two-wheeler bay at Nila, helmets on
   ===================================================================== */
S.Parking={
  enter(){
    G.showClock=true;this.dev=S.person("ANAMIKA",{label:true,x:300,y:420,face:0,k:1});this.sree=S.person("SREEDEV",{x:240,y:360,face:0,label:true});this.lit=false;this.rev=0;
    G.chapter(8,"Seven Thirty");A.setMusic("night");
  },
  async helmets(){await G.wait(700);this.sree.helmet="#1a1d24";A.sfx("click");await G.wait(800);this.dev.helmet="#f08ab4";A.sfx("click");await G.wait(700);this.lit=true;A.sfx("start");await G.wait(900)},
  update(dt){S.stepPerson(this.dev,dt);S.stepPerson(this.sree,dt)},
  draw(g){
    const t=G.t;g.fillStyle="#1a1d26";g.fillRect(0,0,1280,720);
    g.fillStyle="#242832";for(let x=0;x<1280;x+=64)for(let y=0;y<720;y+=64)if(((x+y)/64)%2)g.fillRect(x,y,64,64);
    // Nila building edge along the top
    g.fillStyle="#12182f";g.fillRect(0,0,1280,150);for(let c=0;c<32;c++){g.fillStyle=hash(c)<.6?"rgba(255,206,130,.75)":"rgba(36,46,86,.9)";g.fillRect(14+c*40,30,24,16);g.fillRect(14+c*40,70,24,16)}
    g.fillStyle="#2a3050";g.fillRect(0,150,1280,10);g.fillStyle="#f0b94a";g.fillRect(0,160,1280,5);
    // bays
    g.strokeStyle="rgba(255,255,255,.7)";g.lineWidth=3;for(let i=0;i<14;i++){g.beginPath();g.moveTo(40+i*90,260);g.lineTo(40+i*90,520);g.stroke()}g.beginPath();g.moveTo(40,260);g.lineTo(1240,260);g.stroke();
    g.fillStyle="#fff";g.font="700 20px system-ui";g.textAlign="center";g.fillText("TWO-WHEELER PARKING",640,246);g.textAlign="left";
    // other bikes (dim) + cars
    for(const [x,r] of [[130,0],[220,.2],[490,-.1],[580,0],[760,.15],[850,0],[1030,.1],[1120,-.05]]){g.save();g.globalAlpha=.55;S.bikeTop(g,x+20,400,Math.PI/2+r,1.5,false);g.restore()}
    for(const x of [100,380]){g.fillStyle="rgba(120,130,150,.45)";g.beginPath();g.roundRect(x,590,160,70,14);g.fill()}
    // our bike
    S.bikeTop(g,640,400,Math.PI/2,2.2,this.lit);
    for(const x of [160,640,1100])lamp(g,x,200,260);
    S.drawPerson(g,this.sree,t,K);S.drawPerson(g,this.dev,t,K);anchor(this.dev,0,0,1);anchor(this.sree,0,0,1);
    G.drawBubbles(g);g.fillStyle="rgba(10,14,44,.25)";g.fillRect(0,0,1280,720);S.vignette(g,.5);
  }
};

/* =====================================================================
   BEACH — St. Andrews, top-down at night
   ===================================================================== */
const BW=2400,SHORE=300;
S.Beach={
  stations:[560,1500],
  enter(){
    G.showClock=true;this.z=1.55;this.cam={x:300,y:380};this.dev=S.person("ANAMIKA",{label:true,x:160,y:430,face:0});this.sree=S.person("SREEDEV",{x:90,y:446,face:0,label:true});
    this.foot=[];this.target=-1;this.res=null;this.surf=0;this.surfTarget=0;this.dog={x:1000,y:470,pet:0,wag:0,dir:-1,tx:null};this.shell={x:3260,y:455,taken:true};this.fog=0;this.fogOn=false;this.dogCb=null;this.canPet=false;this.canShell=false;this.petCb=null;this.shellCb=null;this.sitting=false;this.shoot=0;this.hintT=0;this.walkingNow=false;
    this.fire=Array.from({length:40},(_,i)=>({x:hash(i)*BW,y:hash(i+9)*640,p:hash(i+3)*6}));G.chapter(9,"Saint Andrews Beach");A.setMusic("night");A.waves(true);
  },
  exit(){A.waves(false)},
  walkTo(i){this.target=i;this.hintT=6;return new Promise(r=>{this.res=r})},
  update(dt){
    const P=this.dev;S.stepPerson(P.task?P:{task:null},dt);if(P.task)S.stepPerson(P,dt);S.stepPerson(this.sree,dt);Art.updateFx(dt);
    this.surf+=(this.surfTarget-this.surf)*Math.min(1,dt*1.5);if(this.hintT>0)this.hintT-=dt;
    this.walkingNow=false;
    if(this.target>=0&&!P.task){
      let dx=(G.down("d","arrowright"," ")||G.ptr.down?1:0)-(G.down("a","arrowleft")?1:0),dy=(G.down("s","arrowdown")?1:0)-(G.down("w","arrowup")?1:0);
      const tx=this.stations[this.target];if(dx>0&&P.x>=tx)dx=0;
      if(dx||dy){const l=Math.hypot(dx,dy);P.x=G.clamp(P.x+dx/l*90*dt,40,BW-40);P.y=G.clamp(P.y+dy/l*70*dt,SHORE+60,560);P.face=Math.atan2(dy,dx);P.pose="walk";P.ph+=dt*10;this.walkingNow=true;if(Math.random()<dt*2.2)A.sfx("step")}else P.pose="stand";
      if(P.x>=tx-3){const r=this.res;this.target=-1;this.res=null;P.pose="stand";if(r)r()}
    }
    // Sreedev trails behind
    if(!this.sree.task&&!this.sitting){const S2=this.sree,gx=P.x-34,gy=P.y+14,d=Math.hypot(gx-S2.x,gy-S2.y);if(d>6){const st=Math.min(d,100*dt);S2.x+=(gx-S2.x)/d*st;S2.y+=(gy-S2.y)/d*st;S2.face=Math.atan2(gy-S2.y,gx-S2.x);S2.pose="walk";S2.ph+=st*.14}else{S2.pose="stand";S2.face=P.face}}
    if(this.walkingNow){const l=this.foot[this.foot.length-1];if(!l||Math.hypot(l.x-P.x,l.y-P.y)>14)this.foot.push({x:P.x,y:P.y+3,f:this.foot.length%2})}if(this.foot.length>70)this.foot.shift();
    this.cam.x+=(G.clamp(P.x,640/this.z,BW-640/this.z)-this.cam.x)*Math.min(1,dt*4);this.cam.y+=(300+(P.y-300)*.35-this.cam.y)*Math.min(1,dt*4);
    this.dog.wag+=dt*10;if(this.dog.pet>0)this.dog.pet-=dt;
    if(this.dog.tx!=null){const dd=this.dog.tx-this.dog.x;if(Math.abs(dd)>2){this.dog.dir=dd>0?1:-1;this.dog.x+=Math.sign(dd)*Math.min(Math.abs(dd),75*dt)}else{this.dog.tx=null;if(this.dogCb){const c=this.dogCb;this.dogCb=null;c()}}}
    if(this.fogOn)this.fog=Math.min(1,this.fog+dt*.35);if(this.shoot>0)this.shoot-=dt*.6;
    this.canPet=Math.abs(P.x-this.dog.x)<240;this.canShell=!this.shell.taken&&Math.abs(P.x-this.shell.x)<240;
  },
  w2s(x,y){return[640+(x-this.cam.x)*this.z,360+(y-this.cam.y)*this.z]},
  s2w(x,y){return[this.cam.x+(x-640)/this.z,this.cam.y+(y-360)/this.z]},
  click(x,y){const [wx,wy]=this.s2w(x,y);
    if(this.canPet&&this.petCb&&Math.hypot(wx-this.dog.x,wy-this.dog.y)<34){this.dog.pet=1.2;Art.burst(x,y-30,"heart",8);A.sfx("heart");const cb=this.petCb;this.petCb=null;cb()}
    else if(this.canShell&&this.shellCb&&Math.hypot(wx-this.shell.x,wy-this.shell.y)<28){this.shell.taken=true;Art.burst(x,y,"sparkle",12);A.sfx("gift");const cb=this.shellCb;this.shellCb=null;cb()}},
  draw(g){
    const t=G.t,z=this.z,cam=this.cam;
    g.fillStyle="#04081a";g.fillRect(0,0,1280,720);
    g.save();g.translate(640,360);g.scale(z,z);g.translate(-cam.x,-cam.y);
    const x0=cam.x-640/z-20,x1=cam.x+640/z+20;
    // sea (north)
    g.fillStyle=lg(g,0,-200,0,SHORE,[[0,"#06102a"],[1,"#12356b"]]);g.fillRect(x0,-200,x1-x0,SHORE+210);
    g.fillStyle="rgba(190,220,255,.2)";for(let i=0;i<70;i++){const y=-190+hash(i)*480,x=((hash(i+4)*BW+t*(10+i%5*3))%BW),w=24+hash(i+8)*80;if(x>x0-80&&x<x1)g.fillRect(x,y,w,1.4)}
    // moon path on the water
    const mx=cam.x*.7+330;g.fillStyle=rg(g,mx,60,4,230,[[0,"rgba(255,244,200,.38)"],[1,"rgba(255,244,200,0)"]]);g.fillRect(mx-240,-200,480,500);
    g.fillStyle="rgba(255,244,200,.34)";for(let i=0;i<30;i++){const y=-60+i*11,w=6+i*1.8+Math.sin(t*2+i)*4;g.fillRect(mx-w/2,y,w,1.8)}
    // fishing boats on the water (lanterns)
    for(const [bx,by] of [[500,60],[1500,20],[2700,90],[3700,40]]){g.fillStyle="#1b1a28";g.beginPath();g.ellipse(bx,by,24,7,0,0,TAU);g.fill();g.fillStyle="rgba(255,220,140,.95)";g.beginPath();g.arc(bx+4,by,2,0,TAU);g.fill();g.fillStyle="rgba(255,200,110,.2)";g.beginPath();g.arc(bx+4,by,26,0,TAU);g.fill()}
    // sand
    const sg=lg(g,0,SHORE,0,720,[[0,"#3b3a44"],[.18,"#5a4f55"],[1,"#8a7864"]]);g.fillStyle=sg;g.fillRect(x0,SHORE,x1-x0,500);
    g.fillStyle="rgba(255,255,255,.05)";for(let i=0;i<500;i++){const x=hash(i)*BW;if(x>x0&&x<x1)g.fillRect(x,SHORE+10+hash(i+1)*440,2,1.5)}
    // wet sand + foam (animated)
    const w0=SHORE+Math.sin(t*.9)*4+this.surf*40;
    g.fillStyle="rgba(20,28,56,.5)";g.fillRect(x0,w0-4,x1-x0,26);
    g.fillStyle="rgba(240,248,255,.6)";g.beginPath();for(let x=x0;x<=x1;x+=10){const y=w0+Math.sin(x*.03+t*1.4)*3.5;x===x0?g.moveTo(x,y):g.lineTo(x,y)}for(let x=x1;x>=x0;x-=10)g.lineTo(x,w0+7+Math.sin(x*.05+t*2)*2.4);g.closePath();g.fill();
    // boats pulled up on the sand, shacks (top-down roofs)
    for(const bx of [820,1300,2000]){g.fillStyle="rgba(0,0,0,.3)";g.beginPath();g.ellipse(bx+6,520,52,14,0,0,TAU);g.fill();g.fillStyle="#2d2a36";g.beginPath();g.ellipse(bx,514,50,13,0,0,TAU);g.fill();g.fillStyle="#d9503a";g.beginPath();g.ellipse(bx,514,44,8,0,0,TAU);g.fill();g.fillStyle="rgba(255,220,140,.95)";g.beginPath();g.arc(bx+12,514,3,0,TAU);g.fill();g.fillStyle="rgba(255,200,110,.18)";g.beginPath();g.arc(bx+12,514,40,0,TAU);g.fill()}
    for(const sx of [1050,1900]){g.fillStyle="rgba(0,0,0,.3)";g.fillRect(sx-64,596,128,84);g.fillStyle="#3a2a2c";g.fillRect(sx-70,590,140,84);g.fillStyle="#4a3436";g.fillRect(sx-70,590,140,10);
      for(let i=0;i<12;i++){const lx=sx-66+i*12;g.fillStyle=["#ff5a5a","#ffd24a","#7be08a","#4ac2ff"][i%4];g.beginPath();g.arc(lx,604+Math.sin(i)*3,2.8,0,TAU);g.fill();g.fillStyle="rgba(255,230,160,.14)";g.beginPath();g.arc(lx,604,14,0,TAU);g.fill()}
      g.fillStyle="#ffd166";g.font="700 8px system-ui";g.textAlign="center";g.fillText("CORN · COCONUT",sx,640);g.textAlign="left"}
    // church on the headland (east end)
    const cx=2150;if(cx>x0-300&&cx<x1+300){g.fillStyle="#2a2a38";g.beginPath();g.ellipse(cx,420,230,170,0,0,TAU);g.fill();
      g.fillStyle="rgba(0,0,0,.35)";g.fillRect(cx-60,372,150,110);g.fillStyle="#d9d4c8";g.fillRect(cx-70,360,150,108);g.fillStyle="#b9604a";g.fillRect(cx-64,366,138,96);for(let i=0;i<10;i++){g.fillStyle="rgba(0,0,0,.14)";g.fillRect(cx-64,366+i*10,138,2)}
      g.fillStyle="#b9604a";g.fillRect(cx-16,330,48,40);g.fillStyle="#e8e2d4";g.fillRect(cx-6,300,28,36);g.fillStyle="#c9a24a";g.fillRect(cx+6,284,3,20);g.fillRect(cx+1,291,13,3);
      g.fillStyle="rgba(255,214,130,.85)";for(const wx of [-52,-30,40,62])g.fillRect(cx+wx,356,8,6);g.fillStyle=rg(g,cx+8,400,10,230,[[0,"rgba(255,214,130,.28)"],[1,"rgba(255,214,130,0)"]]);g.fillRect(cx-230,200,470,400);
      g.fillStyle="#fff";g.font="700 9px system-ui";g.textAlign="center";g.fillText("ST. ANDREWS CHURCH",cx+8,500);g.textAlign="left"}
    // bench (last station) + station beacons
    const bx=this.stations[1]+60;g.fillStyle="rgba(0,0,0,.3)";g.fillRect(bx-34,452,72,14);g.fillStyle="#3a2c22";g.fillRect(bx-36,448,72,12);g.fillStyle="#2a1e16";g.fillRect(bx-36,446,72,3);
    // shell
    if(!this.shell.taken){const sx=this.shell.x,sy=this.shell.y;g.fillStyle="#f6d5c3";g.beginPath();g.ellipse(sx,sy,6,4,0,0,TAU);g.fill();g.strokeStyle="#c79a86";g.lineWidth=.8;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(sx+i*2,sy-3);g.lineTo(sx+i*2.6,sy+3.4);g.stroke()}
      const gl=.4+.6*Math.abs(Math.sin(t*3));g.fillStyle=`rgba(255,255,255,${gl})`;g.fillRect(sx-9,sy-9,1.4,7);g.fillRect(sx-12,sy-6,7,1.4);
      if(this.canShell&&this.shellCb){g.strokeStyle=`rgba(255,209,102,${.5+.4*Math.sin(t*4)})`;g.lineWidth=1.5;g.beginPath();g.arc(sx,sy,14,0,TAU);g.stroke()}}
    // footprints
    this.foot.forEach((f,i)=>{const a=(this.foot.length-i)/this.foot.length;g.fillStyle=`rgba(30,22,26,${.3*(1-a*.85)})`;g.beginPath();g.ellipse(f.x,f.y+(f.f?3:-3),3.4,1.8,0,0,TAU);g.fill()});
    // dog (top-down)
    this.dogDraw(g,t);
    // people
    S.drawPerson(g,this.sree,t,1);S.drawPerson(g,this.dev,t,1);
    // palms at the back
    for(let i=0;i<22;i++){const px=i*230+hash(i)*120,py=690+hash(i+5)*60;if(px>x0-80&&px<x1+80){for(let k2=0;k2<9;k2++){const a=k2/9*TAU+Math.sin(t*1.2+i)*.04;g.save();g.translate(px,py);g.rotate(a);g.fillStyle=k2%2?"#0f3a22":"#145030";g.beginPath();g.ellipse(26,0,28,5.5,0,0,TAU);g.fill();g.restore()}g.fillStyle="#3b2a1a";g.beginPath();g.arc(px,py,5,0,TAU);g.fill()}}
    // surf over feet
    if(this.surf>.1){g.fillStyle=`rgba(60,120,190,${.22*this.surf})`;g.fillRect(x0,w0+3,x1-x0,34);g.fillStyle=`rgba(240,248,255,${.4*this.surf})`;g.beginPath();for(let x=x0;x<=x1;x+=10){const y=w0+34+Math.sin(x*.04+t*2)*3;x===x0?g.moveTo(x,y):g.lineTo(x,y)}g.lineTo(x1,w0+42);g.lineTo(x0,w0+42);g.fill()}
    // station marker for next target
    if(this.target>=0){const sx=this.stations[this.target];g.strokeStyle=`rgba(255,209,102,${.45+.35*Math.sin(t*4)})`;g.lineWidth=2;g.setLineDash([6,5]);g.beginPath();g.moveTo(sx,SHORE+50);g.lineTo(sx,580);g.stroke();g.setLineDash([])}
    // fireflies
    for(const f of this.fire){if(f.x<x0||f.x>x1)continue;const a=.3+.7*Math.abs(Math.sin(t*1.3+f.p));g.fillStyle=`rgba(255,226,140,${a*.7})`;g.beginPath();g.arc(f.x+Math.sin(t*.6+f.p)*10,f.y+260+Math.cos(t*.5+f.p)*9,1.4,0,TAU);g.fill()}
    g.restore();
    const [dsx,dsy]=this.w2s(this.dev.x,this.dev.y),[ssx,ssy]=this.w2s(this.sree.x,this.sree.y);this.dev.bx=dsx;this.dev.by=dsy-28;this.sree.bx=ssx;this.sree.by=ssy-28;
    if(this.canPet&&this.petCb){const [px,py]=this.w2s(this.dog.x,this.dog.y);g.fillStyle=`rgba(255,209,102,${.6+.4*Math.sin(t*4)})`;g.font="700 18px system-ui";g.textAlign="center";g.fillText("Click the dog",px,py-46);g.textAlign="left"}
    if(this.shoot>0){const p=1-this.shoot;g.strokeStyle=`rgba(255,255,255,${1-p})`;g.lineWidth=3;g.beginPath();g.moveTo(300+p*700,60+p*140);g.lineTo(300+p*700-120,60+p*140-34);g.stroke()}
    Art.drawFx(g);G.drawBubbles(g);
    if(this.target>=0&&this.hintT>0){g.fillStyle="rgba(10,12,18,.72)";g.beginPath();g.roundRect(380,652,520,44,22);g.fill();g.fillStyle="#fff";g.font="500 19px system-ui";g.textAlign="center";g.fillText("Hold → / Space / click (or WASD) to walk along the shore",640,680);g.textAlign="left"}
    if(this.fog>0){const f=this.fog;g.fillStyle=`rgba(210,220,238,${.3*f})`;g.fillRect(0,0,1280,720);
      for(let i=0;i<10;i++){const x=((t*26*(1+i%3*.4)+i*230)%1800)-260;g.fillStyle=`rgba(232,238,250,${.2*f})`;g.beginPath();g.ellipse(x,80+i*66,380,74,0,0,TAU);g.fill()}}
    g.fillStyle="rgba(16,26,70,.2)";g.fillRect(0,0,1280,720);S.vignette(g,.55);
  },
  dogDraw(g,t){
    const d=this.dog,w=Math.sin(d.wag)*(d.pet>0?.8:.3);g.save();g.translate(d.x,d.y);g.scale(d.dir||1,1);g.fillStyle="rgba(0,0,0,.3)";g.beginPath();g.ellipse(2,3,13,7,0,0,TAU);g.fill();
    g.fillStyle="#9b6a3e";g.beginPath();g.ellipse(0,0,12,6,0,0,TAU);g.fill();g.beginPath();g.arc(13,0,5,0,TAU);g.fill();g.fillStyle="#6c4426";g.beginPath();g.ellipse(11,-4,2.4,3.4,.3,0,TAU);g.fill();g.beginPath();g.ellipse(11,4,2.4,3.4,-.3,0,TAU);g.fill();
    g.fillStyle="#c9a278";g.beginPath();g.ellipse(17,0,2.6,2.2,0,0,TAU);g.fill();g.fillStyle="#111";g.beginPath();g.arc(18.5,0,.9,0,TAU);g.fill();
    g.strokeStyle="#9b6a3e";g.lineWidth=2.4;g.lineCap="round";g.beginPath();g.moveTo(-11,0);g.quadraticCurveTo(-18,w*10,-21,w*14);g.stroke();g.restore();
  }
};

/* =====================================================================
   RESTAURANT — Istanbul Rolls & Grills / Waffles, top-down
   ===================================================================== */
S.Restaurant={
  enter(o){
    o=o||{};this.kind=o.kind||"istanbul";G.showClock=true;
    const ist0=this.kind==="istanbul";this.dev=S.person("ANAMIKA",{label:true,x:ist0?612:520,y:ist0?456:380,face:ist0?-Math.PI/2:0,seat:true});this.sree=S.person("SREEDEV",{x:ist0?692:780,y:ist0?456:380,face:ist0?-Math.PI/2:Math.PI,seat:true,label:true});
    G.chapter(9,this.kind==="istanbul"?"Istanbul Rolls & Grills":"Waffles");A.setMusic("warm");
    this.others=Array.from({length:6},(_,i)=>{const n=S.person(["NAVYA","SIDHU","VENDOR"][i%3],{x:[180,300,1060,1160,200,1100][i],y:[200,500,210,520,600,330][i],face:[0,Math.PI,Math.PI,0,0,Math.PI][i],seat:true});n.shirt=["#3b6ea5","#8a4f7d","#4f8a6b","#b5654a","#555b6e","#c79a3a"][i];return n});
    this.waiter=S.person("VENDOR",{x:900,y:640,face:Math.PI,pose:"walk"});this.wt=0;
  },
  update(dt){S.stepPerson(this.dev,dt);S.stepPerson(this.sree,dt);this.wt+=dt;this.waiter.x=640+Math.cos(this.wt*.5)*420;this.waiter.y=620+Math.sin(this.wt*.5)*30;this.waiter.face=-Math.sin(this.wt*.5)>0?0:Math.PI;this.waiter.ph+=dt*8;Art.updateFx(dt)},
  chair(g,x,y,a){g.save();g.translate(x,y);g.rotate(a);g.fillStyle="rgba(0,0,0,.3)";g.beginPath();g.roundRect(-11,-11,26,26,8);g.fill();g.fillStyle="#1d1f24";g.beginPath();g.roundRect(-13,-13,26,26,9);g.fill();
    g.strokeStyle="#3a3d45";g.lineWidth=1.2;for(let i=-9;i<=9;i+=4.5){g.beginPath();g.moveTo(i,-11);g.lineTo(i,11);g.stroke()}g.fillStyle="#14161a";g.fillRect(-14,-13,5,26);g.restore()},
  sqTable(g,x,y,w,h){g.fillStyle="rgba(0,0,0,.3)";g.fillRect(x-w/2+5,y-h/2+7,w,h);g.fillStyle="#c7a06a";g.fillRect(x-w/2,y-h/2,w,h);g.fillStyle="#d6b17c";g.fillRect(x-w/2+3,y-h/2+3,w-6,h-6);g.strokeStyle="rgba(120,80,30,.35)";g.lineWidth=1;for(let i=1;i<5;i++){g.beginPath();g.moveTo(x-w/2+3,y-h/2+i*h/5);g.lineTo(x+w/2-3,y-h/2+i*h/5);g.stroke()}g.fillStyle="#2a2b30";g.beginPath();g.arc(x,y,4,0,TAU);g.fill()},
  drawIst(g,t){
    // light wood floor
    g.fillStyle="#b48a58";g.fillRect(0,0,1280,720);for(let y=0;y<720;y+=34){g.fillStyle=y/34%2?"#bd9462":"#ad8450";g.fillRect(0,y,1280,33);g.fillStyle="rgba(0,0,0,.12)";g.fillRect(0,y+33,1280,1)}
    for(let i=0;i<120;i++){g.fillStyle="rgba(90,60,25,.12)";g.fillRect((hash(i)*1280)|0,(hash(i+3)*720)|0,40,1.4)}
    // white back wall with the sign and yellow tile column
    g.fillStyle="#dfe0dd";g.fillRect(0,0,1280,150);g.fillStyle="#c9cac6";g.fillRect(0,146,1280,6);
    g.fillStyle="#f4b21c";g.fillRect(40,0,90,146);for(let y=0;y<146;y+=30)for(let x=40;x<130;x+=30){g.fillStyle=(x/30+y/30)%2?"#f4b21c":"#e0951a";g.fillRect(x,y,30,30)}
    g.fillStyle="#f6f6f4";g.fillRect(430,22,340,104);g.strokeStyle="#aaa";g.lineWidth=2;g.strokeRect(430,22,340,104);
    g.fillStyle="#111";g.font="800 34px system-ui";g.textAlign="center";g.fillText("#YOURS",600,76);g.fillText("ISTANBUL",600,112);
    g.fillStyle="#f4b21c";g.beginPath();g.moveTo(820,40);g.lineTo(1000,40);g.lineTo(1000,120);g.lineTo(820,120);g.closePath();g.fill();g.fillStyle="#7a1d10";g.font="800 24px system-ui";g.fillText("ISTANBUL",910,76);g.font="700 14px system-ui";g.fillText("ROLLS & GRILLS · ROYALE",910,100);g.textAlign="left";
    // shawarma counter along the top-right
    g.fillStyle="#2b2b30";g.fillRect(1060,170,200,90);g.fillStyle="#3b3b42";g.fillRect(1066,176,188,40);
    for(let i=0;i<3;i++){const cx=1100+i*60;g.fillStyle="#8a4a22";g.beginPath();g.ellipse(cx,230,17,13,0,0,TAU);g.fill();g.fillStyle="#c26a3a";g.beginPath();g.ellipse(cx,228,13,9,0,0,TAU);g.fill();g.fillStyle="#ff7a1c";const fh=7+Math.sin(t*9+i)*3;g.fillRect(cx-14,246,3,-fh);g.fillRect(cx+11,246,3,-fh)}
    for(let i=0;i<5;i++){g.fillStyle=`rgba(255,255,255,${.1-i*.015})`;g.beginPath();g.arc(1160+Math.sin(t+i)*14+i*8,164-((t*18+i*14)%70),10+i*2,0,TAU);g.fill()}
    // other tables with black wicker chairs
    for(const [x,y] of [[250,260],[900,300],[260,560],[1000,560],[400,400]]){this.sqTable(g,x,y,96,76);for(const [dx,dy,a] of [[-62,0,0],[62,0,Math.PI],[0,-54,Math.PI/2],[0,54,-Math.PI/2]])this.chair(g,x+dx,y+dy,a);g.fillStyle="#f6f1ec";g.beginPath();g.ellipse(x-18,y+2,14,8,0,0,TAU);g.fill()}
    for(let i=0;i<4;i++){const n=this.others[i];n.x=[190,970,200,1060][i];n.y=[262,300,562,560][i];n.face=[0,Math.PI,0,Math.PI][i];S.drawPerson(g,n,t,K*.9)}
    // our table: two chairs on the south side, side by side
    this.sqTable(g,652,360,230,100);
    this.chair(g,612,440,-Math.PI/2);this.chair(g,692,440,-Math.PI/2);
    // loaded fries (left) and one shawarma (right)
    g.fillStyle="#f1f1ee";g.beginPath();g.roundRect(572,334,104,64,10);g.fill();g.strokeStyle="#cfcfc9";g.lineWidth=1.5;g.stroke();
    for(let i=0;i<26;i++){const a=hash(i)*6.28,r=hash(i+5)*24;g.save();g.translate(624+Math.cos(a)*r*1.4,366+Math.sin(a)*r*.8);g.rotate(hash(i+9)*3);g.fillStyle="#e8b94a";g.fillRect(-9,-1.6,18,3.2);g.restore()}
    g.fillStyle="rgba(255,248,230,.85)";for(let i=0;i<7;i++){g.beginPath();g.ellipse(600+hash(i+30)*50,352+hash(i+31)*30,9,3.6,hash(i)*3,0,TAU);g.fill()}
    g.fillStyle="#c93a2a";for(let i=0;i<6;i++){g.beginPath();g.arc(596+hash(i+60)*56,350+hash(i+61)*34,2.6,0,TAU);g.fill()}
    g.fillStyle="#d8c9a8";for(let i=0;i<4;i++){g.beginPath();g.arc(600+hash(i+80)*52,352+hash(i+81)*30,3.4,0,TAU);g.fill()}
    g.fillStyle="#f1f1ee";g.beginPath();g.roundRect(706,340,76,52,10);g.fill();g.strokeStyle="#cfcfc9";g.stroke();
    g.save();g.translate(744,366);g.rotate(-.15);g.fillStyle="#e4c58a";g.beginPath();g.roundRect(-32,-11,64,22,11);g.fill();g.strokeStyle="#a47a3a";g.lineWidth=1.2;g.stroke();
    g.fillStyle="#7a3d1c";g.fillRect(-26,-6,52,4);g.fillStyle="#a8c94a";g.fillRect(-24,0,48,3);g.fillStyle="#fff7e0";g.fillRect(-26,4,52,3);g.restore();
    for(let i=0;i<3;i++){g.strokeStyle=`rgba(255,255,255,${.34-i*.08})`;g.lineWidth=2;const o=(t*16+i*10)%24;g.beginPath();g.arc(612+i*14,326-o*.5,4+o*.15,0,TAU);g.stroke();g.beginPath();g.arc(740+i*10,332-o*.5,3+o*.15,0,TAU);g.stroke()}
    S.drawPerson(g,this.dev,t,K);S.drawPerson(g,this.sree,t,K);
    S.drawPerson(g,this.waiter,t,K*.9);
    g.save();g.globalCompositeOperation="lighter";for(const [x,y] of [[300,300],[650,300],[1000,300],[650,560]]){const gr=g.createRadialGradient(x,y,2,x,y,190);gr.addColorStop(0,"rgba(255,235,190,.2)");gr.addColorStop(1,"rgba(255,235,190,0)");g.fillStyle=gr;g.fillRect(x-190,y-190,380,380)}g.restore();
    anchor(this.dev,0,0,1);anchor(this.sree,0,0,1);this.dev.by-=8;this.sree.by-=8;Art.drawFx(g);G.drawBubbles(g);S.vignette(g,.32);
  },
  table(g,x,y,rx,ry,col){g.fillStyle="rgba(0,0,0,.32)";g.beginPath();g.ellipse(x+5,y+7,rx,ry,0,0,TAU);g.fill();g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill();g.strokeStyle="rgba(0,0,0,.3)";g.lineWidth=2;g.stroke()},
  draw(g){
    const t=G.t,ist=this.kind==="istanbul";
    if(ist){this.drawIst(g,t);return}
    // floor
    g.fillStyle=ist?"#3a1c16":"#3b2622";g.fillRect(0,0,1280,720);
    for(let x=0;x<1280;x+=64)for(let y=0;y<720;y+=64){g.fillStyle=((x+y)/64)%2?(ist?"#2a8f9a":"#7a4a3a"):(ist?"#1f6f7a":"#6a3d30");g.globalAlpha=.55;g.fillRect(x,y,64,64);g.globalAlpha=1}
    g.fillStyle="rgba(0,0,0,.35)";g.fillRect(0,0,1280,120);g.fillStyle=ist?"#6b2a1c":"#7a2f3a";g.fillRect(0,0,1280,110);
    g.fillStyle="#f6e9cf";g.font="700 38px Georgia,serif";g.textAlign="center";
    if(ist){g.fillText("ISTANBUL ROLLS & GRILLS",640,60);g.fillStyle="#c9923e";g.font="italic 20px Georgia,serif";g.fillText("ROYALE",640,92)}
    else{g.shadowColor="#ff4fa0";g.shadowBlur=26;g.fillStyle="#ff8fc6";g.font="700 64px 'Segoe Script','Brush Script MT',cursive";g.fillText("Waffles",640,82);g.shadowBlur=0}
    g.textAlign="left";
    // grill (top-right) with flames / waffle bar
    if(ist){g.fillStyle="#18110f";g.fillRect(1010,130,220,100);for(let i=0;i<9;i++){const fx=1026+i*22,fh=14+Math.sin(t*9+i)*6+hash(i)*7;g.fillStyle="#ff7a1c";g.beginPath();g.moveTo(fx,200);g.quadraticCurveTo(fx-6,200-fh*.5,fx,200-fh);g.quadraticCurveTo(fx+6,200-fh*.5,fx,200);g.fill();g.fillStyle="#ffd24a";g.beginPath();g.moveTo(fx,200);g.quadraticCurveTo(fx-3,200-fh*.3,fx,200-fh*.6);g.quadraticCurveTo(fx+3,200-fh*.3,fx,200);g.fill()}
      for(let i=0;i<6;i++){g.fillStyle=`rgba(255,255,255,${.1-i*.01})`;g.beginPath();g.arc(1090+Math.sin(t+i)*20+i*10,120-((t*20+i*20)%90),12+i*2,0,TAU);g.fill()}}
    else{g.fillStyle="#2b1612";g.fillRect(1010,130,220,90);for(let i=0;i<4;i++){g.fillStyle="#c9a24a";g.beginPath();g.arc(1050+i*50,180,16,0,TAU);g.fill();g.strokeStyle="#6a4a1a";g.lineWidth=1;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(1034+i*50,180+k*6);g.lineTo(1066+i*50,180+k*6);g.stroke()}}}
    // other diners
    for(const [x,y] of [[240,260],[1040,520],[240,560],[1060,330]]){this.table(g,x,y,40,28,ist?"#b4342b":"#f2d6c4");g.fillStyle="#f6f1ec";g.beginPath();g.ellipse(x-8,y-2,12,6,0,0,TAU);g.fill()}
    for(const n of this.others)S.drawPerson(g,n,t,K*.9);
    // our table
    this.table(g,650,380,150,62,ist?"#b4342b":"#f2d6c4");
    if(ist){g.fillStyle="#fff";for(let i=-4;i<5;i++)if(i%2==0){g.globalAlpha=.7;g.fillRect(650+i*30-15,330,30,100);g.globalAlpha=1}
      g.fillStyle="#e8e2d6";g.beginPath();g.ellipse(590,378,44,22,0,0,TAU);g.fill();g.fillStyle="#c9742e";for(let i=0;i<5;i++){g.beginPath();g.ellipse(572+i*10,376+Math.sin(i)*4,8,12,.4,0,TAU);g.fill()}
      g.fillStyle="#f1d9a0";g.beginPath();g.ellipse(700,372,28,18,0,0,TAU);g.fill();g.beginPath();g.ellipse(700,368,25,15,0,0,TAU);g.fill();g.fillStyle="#fff7e0";g.beginPath();g.arc(660,408,13,0,TAU);g.fill();
      for(let i=0;i<3;i++){g.strokeStyle=`rgba(255,255,255,${.35-i*.08})`;g.lineWidth=2;const o=(t*16+i*10)%24;g.beginPath();g.arc(578+i*14,360-o*.5,4+o*.15,0,TAU);g.stroke()}}
    else{for(const x of [590,720]){g.fillStyle="#f6f1ec";g.beginPath();g.ellipse(x,380,40,26,0,0,TAU);g.fill();g.fillStyle="#e0a85a";g.beginPath();g.arc(x,380,26,0,TAU);g.fill();g.strokeStyle="rgba(120,70,20,.55)";g.lineWidth=1.6;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(x-24,380+i*8);g.lineTo(x+24,380+i*8);g.moveTo(x+i*8,356);g.lineTo(x+i*8,404);g.stroke()}
      g.fillStyle="#3a1c10";g.beginPath();g.moveTo(x-18,372);g.quadraticCurveTo(x-6,392,x+4,372);g.quadraticCurveTo(x+14,390,x+20,368);g.quadraticCurveTo(x,384,x-18,372);g.fill()}
      for(let i=0;i<3;i++){g.strokeStyle=`rgba(255,255,255,${.3-i*.07})`;g.lineWidth=2;const o=(t*14+i*10)%24;g.beginPath();g.arc(600+i*50,352-o*.5,4+o*.15,0,TAU);g.stroke()}}
    // chairs under our people
    S.drawPerson(g,this.dev,t,K);S.drawPerson(g,this.sree,t,K);
    S.drawPerson(g,this.waiter,t,K*.9);
    // lantern / pendant glows
    g.save();g.globalCompositeOperation="lighter";for(const [x,y] of [[200,160],[520,300],[780,300],[1120,420],[400,600],[900,600]]){const gr=g.createRadialGradient(x,y,2,x,y,150);gr.addColorStop(0,ist?"rgba(255,170,70,.35)":"rgba(255,170,110,.3)");gr.addColorStop(1,"rgba(255,170,70,0)");g.fillStyle=gr;g.fillRect(x-150,y-150,300,300)}g.restore();
    anchor(this.dev,0,0,1);anchor(this.sree,0,0,1);this.dev.by-=10;this.sree.by-=10;Art.drawFx(g);G.drawBubbles(g);S.vignette(g,.5);
  }
};

/* =====================================================================
   VISITORS' AREA — Technopark Phase 1, top-down at night; the BE 6 arrives
   ===================================================================== */
S.Visitors={
  enter(){
    G.showClock=true;this.dev=S.person("ANAMIKA",{label:true,x:500,y:330,face:0});this.sree=S.person("SREEDEV",{x:420,y:340,face:0,label:true});this.bro=S.person("SIDHU",{x:1300,y:430,vis:false,face:Math.PI,label:true});
    this.carX=-260;this.carV=0;this.carOn=false;this.leaving=false;this.doorGlow=0;this._ar=null;G.chapter(10,"Visitors' Area");A.setMusic("night");
  },
  arrive(){this.carOn=true;this.carV=300;A.sfx("whoosh");return new Promise(r=>{this._ar=r})},
  update(dt){
    S.stepPerson(this.dev,dt);S.stepPerson(this.sree,dt);S.stepPerson(this.bro,dt);Art.updateFx(dt);
    if(this.carOn){this.carX+=this.carV*dt;
      if(!this.leaving){const d=760-this.carX;this.carV=Math.max(0,Math.min(300,d*1.3));if(d<2&&this._ar){this.carV=0;const r=this._ar;this._ar=null;r()}}
      else this.carV=Math.min(520,this.carV+190*dt)}
    if(this.doorGlow>0)this.doorGlow-=dt;
  },
  draw(g){
    const t=G.t;g.fillStyle="#12151d";g.fillRect(0,0,1280,720);
    // pavements + road
    g.fillStyle="#1c2030";g.fillRect(0,0,1280,720);g.fillStyle="#2a2e3a";g.fillRect(0,300,1280,230);g.fillStyle="#252832";g.fillRect(0,310,1280,210);
    g.fillStyle="#e8d37a";for(let i=0;i<9;i++)g.fillRect(i*160+20,414,90,5);g.fillStyle="rgba(255,255,255,.55)";g.fillRect(0,304,1280,3);g.fillRect(0,526,1280,3);
    // paved forecourt (north) and benches (south)
    g.fillStyle="#2f3446";g.fillRect(0,140,1280,160);for(let x=0;x<1280;x+=80){g.fillStyle="rgba(255,255,255,.04)";g.fillRect(x,140,40,160)}
    // gate / arch (top-down: pillars + beam with sign)
    g.fillStyle="rgba(0,0,0,.35)";g.fillRect(396,60,500,22);g.fillStyle="#1a2036";g.fillRect(390,50,40,60);g.fillRect(862,50,40,60);g.fillStyle="#222a46";g.fillRect(390,54,512,30);
    g.fillStyle="#e8832a";g.font="700 20px system-ui";g.textAlign="center";g.fillText("TECHNOPARK · PHASE 1",646,74);g.fillStyle="#cfd5e2";g.font="600 13px system-ui";g.fillText("VISITORS' AREA",646,96);g.textAlign="left";
    g.fillStyle="rgba(232,131,42,.12)";g.beginPath();g.arc(646,80,200,0,TAU);g.fill();
    // security booth roof (right)
    g.fillStyle="rgba(0,0,0,.35)";g.fillRect(1086,176,120,80);g.fillStyle="#3b6a4a";g.fillRect(1080,170,120,80);g.fillStyle="#2f5a3d";g.fillRect(1080,170,120,10);g.fillStyle="rgba(255,226,150,.85)";g.fillRect(1100,200,80,20);S.drawPerson(g,{name:"VENDOR",x:1140,y:226,face:Math.PI/2,pose:"stand",vis:true,seat:true,shirt:"#3b6a4a"},t,K*.7);
    // benches and trees
    for(const x of [150,360,1000]){g.fillStyle="rgba(0,0,0,.3)";g.fillRect(x+4,590,110,20);g.fillStyle="#3a2c22";g.fillRect(x,586,110,16);g.fillStyle="#2a1e16";g.fillRect(x,584,110,3)}
    for(const [x,y] of [[60,200],[1220,640],[640,680],[880,640],[320,640]])tree(g,x,y,28,true);
    for(const x of [140,646,1160])lamp(g,x,290,230);for(const x of [260,900])lamp(g,x,560,200);
    // parked bike
    S.bikeTop(g,120,640,.15,1.6,false);
    if(this.carOn||this.carX>-250){S.carTop(g,this.carX,462,0,1.9,true)}
    S.drawPerson(g,this.sree,t,K);S.drawPerson(g,this.dev,t,K);S.drawPerson(g,this.bro,t,K);
    if(this.doorGlow>0){g.fillStyle=`rgba(255,240,200,${this.doorGlow*.3})`;g.beginPath();g.arc(this.carX+10,520,60,0,TAU);g.fill()}
    anchor(this.dev,0,0,1);anchor(this.sree,0,0,1);anchor(this.bro,0,0,1);Art.drawFx(g);G.drawBubbles(g);
    g.fillStyle="rgba(10,14,44,.25)";g.fillRect(0,0,1280,720);S.vignette(g,.5);
  }
};
})();
