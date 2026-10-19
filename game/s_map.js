/* ================= GENERATED from the office explorer (index.html): map, collision, pathfinding, drawing ================= */
(function(){
"use strict";
const ctx=G.ctx;let serverOn=true,disco=0,bonks=0;
/* ============ DATA ============ */
const FLOOR=[196,108,1295,608], BALC=[196,46,1290,104];
const WORLD=[95,30,1310,630];
const PH={
  atrium:{src:"img/frame01.jpg",cap:"Atrium walkway and café court (video 0:04)"},
  recep :{src:"img/frame02.jpg",cap:"Reception with logo wall and curved desk (video 0:05)"},
  bay1  :{src:"img/frame03.jpg",cap:"Open-plan bay, glass partition on the left (video 0:06)"},
  bay2  :{src:"img/frame04.jpg",cap:"Open-plan bays under the timber ceiling feature (video 0:07)"},
  meet1 :{src:"img/frame05.jpg",cap:"Meeting room with whiteboard and teal lounge chairs (video 0:08)"},
  meet2 :{src:"img/frame06.jpg",cap:"Meeting room with wall TV and whiteboard (video 0:09)"},
  carrom:{src:"img/carrom.jpg",cap:"Carrom board shot from the video (recreation)"}
};
const BAYNOTE="Bay shots in the video do not say which bay they show.";
const ROOMS=[
 {id:"mr2",name:"Meeting Room 2",r:[320,115,439,220],doors:[["R",150,190]],ph:"meet1",q:"a",txt:"Small meeting room. Door faces Bay 1.",note:"Frame is the closest meeting-room shot; exact room not confirmed."},
 {id:"mr1",name:"Meeting Room 1",r:[320,220,439,345],doors:[["R",265,310]],ph:"meet2",q:"a",txt:"Small meeting room. Door faces Bay 1.",note:"Frame is the closest meeting-room shot; exact room not confirmed."},
 {id:"bay1",name:"Bay 1",r:[512,111,573,342],open:["B"],ph:"bay1",q:"a",txt:"Five seats on each side of the bench.",note:BAYNOTE},
 {id:"ceo",name:"CEO Room",r:[860,115,982,212],doors:[["B",895,945]],ph:"bay1",q:"a",txt:"Two desks, parallel to Bay 1, CEOs facing it. Door is opposite the HR door.",note:"The video shows a glass-fronted room at the head of the bay; this frame is the nearest match, not a confirmed CEO-room shot."},
 {id:"mr4",name:"Meeting Room 4",r:[1005,117,1289,216],doors:[["B",1080,1130]],ph:"meet2",q:"a",txt:"Long boardroom table. Door faces the main entrance.",note:"Frame shows an 8-seat room with TV; scaled up here to match your sketch."},
 {id:"mr3",name:"Meeting Room 3",r:[1184,218,1290,403],doors:[["L",295,340]],ph:"meet1",q:"a",txt:"Narrow meeting room.",note:"Closest meeting-room frame."},
 {id:"hr",name:"HR Department",r:[866,292,1017,608],doors:[["T",895,945]],ph:null,q:"n",txt:"Eight desks. Joined to the south wall; door faces the CEO room door.",note:"The video has no shot of this room."},
 {id:"sick",name:"Sick Room",r:[218,380,295,604],doors:[["T",233,278]],ph:null,q:"n",txt:"A single bed.",note:"The video has no shot of this room."},
 {id:"bay6",name:"Bay 6",r:[305,381,343,607],open:["T"],ph:"bay2",q:"a",txt:"Five seats on each side.",note:BAYNOTE},
 {id:"bay5",name:"Bay 5",r:[391,380,452,608],open:["T"],ph:"bay2",q:"a",txt:"Five seats on each side.",note:BAYNOTE},
 {id:"bay4",name:"Bay 4",r:[489,375,550,607],open:["T"],ph:"bay2",q:"a",txt:"Five seats on each side.",note:BAYNOTE},
 {id:"bay3",name:"Bay 3",r:[593,375,654,607],open:["T"],ph:"bay1",q:"a",txt:"Five seats on the right, four on the left: Safar, Sreedev 👑 in the middle, then Anamika and Aswani at the far end.",note:BAYNOTE},
 {id:"bay2",name:"Bay 2",r:[703,376,764,606],open:["T"],ph:"bay1",q:"a",txt:"Five seats on each side.",note:BAYNOTE}
];
const SIDE=[
 {id:"bath",name:"Bathroom",r:[113,125,190,190],ph:null,q:"n",txt:"Restrooms.",note:"The video has no shot of this room."},
 {id:"pantry",name:"Pantry",r:[113,206,190,470],ph:"carrom",q:"a",txt:"Coffee and tea machine on the counter. Press E next to it.",note:"The carrom shot is placed here as a guess: the video does not say where it was filmed."},
 {id:"server",name:"Server Room",r:[113,486,190,611],ph:null,q:"n",txt:"Two racks and the big server switch. Press E at the switch. Everyone will notice.",note:"The video has no shot of this room."}
];
const OTHER=[
 {id:"balcony",name:"Balcony",r:BALC,ph:"atrium",q:"a",txt:"Long balcony along the top of the floor.",note:"Frame shows the atrium walkway; the balcony itself is not clearly shown."},
 {id:"welcome",name:"Welcome Desk / Reception",r:[1050,430,1295,608],ph:"recep",q:"m",txt:"Curved reception desk, logo wall and lounge chairs. Main entrance is the door in the south wall.",note:""},
 {id:"sofa",name:"Sofa Lounge",r:[620,112,812,190],ph:"meet1",q:"a",txt:"Lounge sofa.",note:"Frame shows the teal lounge chairs seen in a meeting room; used as a stand-in."},
 {id:"carrom",name:"Carrom Corner",r:[672,196,776,296],ph:"carrom",q:"a",txt:"A carrom board. Press E next to it to play.",note:"The carrom shot is placed here as a guess: the video does not say where it was filmed."}
];
const ZONES=[...ROOMS,...SIDE,...OTHER];
const OPENFLOOR={id:"floor",name:"Open workstation floor",ph:"bay2",q:"m",txt:"Dark striped carpet, white-partition desks, LED strip lighting.",note:"Matches the wide shots in the video."};
const WALK=[FLOOR,BALC,[113,125,190,190],[113,206,190,470],[113,486,190,611],[186,148,200,178],[186,330,200,370],[186,492,200,532],[585,100,635,112]];
const BLOCK=[];
const WT=4;
function addWalls(rm){
  const [x1,y1,x2,y2]=rm.r, open=rm.open||[], doors=rm.doors||[];
  const sides={T:[x1,y1,x2,y1,"h"],B:[x1,y2,x2,y2,"h"],L:[x1,y1,x1,y2,"v"],R:[x2,y1,x2,y2,"v"]};
  for(const s of "TBLR"){
    if(open.includes(s))continue;
    const [ax,ay,bx,by,o]=sides[s];
    let a=o=="h"?ax:ay, b=o=="h"?bx:by;
    const gaps=doors.filter(d=>d[0]==s).map(d=>[d[1],d[2]]).sort((p,q)=>p[0]-q[0]);
    const segs=[];let cur=a;
    for(const g of gaps){ if(g[0]>cur)segs.push([cur,g[0]]); cur=g[1]; }
    if(cur<b)segs.push([cur,b]);
    for(const [p,q] of segs){
      if(o=="h")BLOCK.push([p,ay-WT/2,q,ay+WT/2,"w"]); else BLOCK.push([ax-WT/2,p,ax+WT/2,q,"w"]);
    }
  }
}
ROOMS.forEach(addWalls);

/* ============ FURNITURE, SEATS, WORKERS ============ */
const FURN=[], SEATS=[], NPCS=[];
function F(k,x,y,w,h,extra){const o=Object.assign({k,x,y,w,h},extra||{});FURN.push(o);BLOCK.push([x,y,x+w,y+h,"f"]);return o}
for(const [y1,y2] of [[115,220],[220,345]]){const cy=(y1+y2)/2+10;F("table",350,cy-14,58,28)}
F("table",1060,160,170,30); F("table",1215,275,44,100);
// CEO: two desks parallel to Bay 1, CEOs sit on the east side facing west (toward Bay 1)
F("desk",870,135,24,68,{dir:"r"}); F("desk",922,135,24,68,{dir:"r"});
SEATS.push({x:906,y:170,face:Math.PI,room:"ceo",role:"CEO"},{x:958,y:170,face:Math.PI,room:"ceo",role:"CEO"});
// HR desks, workers sit below facing north
for(let r=0;r<4;r++)for(let c=0;c<2;c++){const x=885+c*68,y=345+r*58;F("desk",x,y,46,24,{dir:"d"});SEATS.push({x:x+23,y:y+33,face:-Math.PI/2,room:"hr"})}
// bays: double-sided bench, people on BOTH sides
for(const b of ROOMS.filter(r=>r.id.startsWith("bay"))){
  const [x1,y1,x2,y2]=b.r, bw=x2-x1, lane=bw>45?16:13, benchW=bw-2*lane, top=y1+38;
  for(let i=0;i<5;i++){
    const y=top+i*37;
    F("desk",x1+lane,y,benchW,30,{dir:"b"});
    if(!(b.id=="bay3"&&i==0))SEATS.push({x:x1+lane/2,y:y+15,face:0,room:b.id,side:"L",idx:i});
    SEATS.push({x:x2-lane/2,y:y+15,face:Math.PI,room:b.id,side:"R",idx:i});
  }
}
F("bed",230,470,52,110);
F("machine",122,225,28,36);F("counter",122,275,28,36);F("counter",122,390,28,36);F("counter",122,425,28,36);
F("rack",128,545,20,55);F("rack",152,545,20,55);
F("sofa",644,130,144,36); F("welcome",1133,500,148,67); F("carrom",692,212,64,64); F("arcade",720,48,24,26);
// workers
let seed=11;const R01=()=>(seed=(seed*16807)%2147483647)/2147483647;
const SHIRT=["#3b6ea5","#8a4f7d","#4f8a6b","#b5654a","#555b6e","#c79a3a","#6a5acd","#2f8f9d","#a34a4a"],HAIR=["#1c1614","#2a1e18","#3a2a20","#0f0f12","#5a3b24"],SKIN=["#f1c9a5","#d9a577","#b97d52","#8d5a3b"];
const NAMES={bay3L1:"Safar",bay3L2:"Sreedev",bay3L3:"Anamika",bay3L4:"Aswani"};
for(const s of SEATS){
  const key=s.room+(s.side||"")+(s.idx??"");
  const king=s.room=="bay3"&&s.side=="L"&&s.idx==2;
  const n={x:s.x,y:s.y,face:s.face,shirt:SHIRT[(R01()*SHIRT.length)|0],hair:HAIR[(R01()*HAIR.length)|0],skin:SKIN[(R01()*SKIN.length)|0],
    ph:R01()*6.28,hit:0,bonks:0,say:"",sayT:0,king,name:NAMES[key]||s.role||"",role:s.role||"",loop:key=="bay3L3"?"I will leave DAD on Oct 4":"",loopT:1.5};
  if(king){n.shirt="#7a1f3d";n.hair="#1c1614"}
  NPCS.push(n);BLOCK.push([n.x-4,n.y-4,n.x+4,n.y+4,"n"]);
}


/* ============ COLLISION + PATHFINDING ============ */
const HB=5;
const inR=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
function free(px,py,pad=0){
  const H=HB+pad;
  for(const [dx,dy] of [[-H,-H],[H,-H],[-H,H],[H,H]]){
    const x=px+dx,y=py+dy; let ok=false;
    for(const w of WALK)if(x>=w[0]-.05&&x<=w[2]+.05&&y>=w[1]-.05&&y<=w[3]+.05){ok=true;break}
    if(!ok)return false;
  }
  for(const b of BLOCK){ if(px+H>b[0]+.05&&px-H<b[2]-.05&&py+H>b[1]+.05&&py-H<b[3]-.05)return false }
  return true;
}
const CELL=4, GX=Math.ceil((WORLD[2]-WORLD[0])/CELL), GY=Math.ceil((WORLD[3]-WORLD[1])/CELL);
const grid=new Uint8Array(GX*GY);
for(let j=0;j<GY;j++)for(let i=0;i<GX;i++)grid[j*GX+i]=free(WORLD[0]+i*CELL+CELL/2,WORLD[1]+j*CELL+CELL/2)?1:0;
const g2w=(i,j)=>[WORLD[0]+i*CELL+CELL/2,WORLD[1]+j*CELL+CELL/2];
const w2g=(x,y)=>[Math.floor((x-WORLD[0])/CELL),Math.floor((y-WORLD[1])/CELL)];
function nearestFree(x,y){
  let [i,j]=w2g(x,y); if(i>=0&&j>=0&&i<GX&&j<GY&&grid[j*GX+i])return [i,j];
  for(let r=1;r<60;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){
    const a=i+di,b=j+dj; if(a<0||b<0||a>=GX||b>=GY)continue;
    if(Math.max(Math.abs(di),Math.abs(dj))==r&&grid[b*GX+a])return [a,b];
  }
  return null;
}
function findPath(sx,sy,tx,ty,smooth=true){
  const s=nearestFree(sx,sy), t=nearestFree(tx,ty); if(!s||!t)return null;
  const N=GX*GY, g=new Float32Array(N).fill(1e9), from=new Int32Array(N).fill(-1), closed=new Uint8Array(N);
  const open=[[0,s[1]*GX+s[0]]]; g[s[1]*GX+s[0]]=0; const T=t[1]*GX+t[0];
  const h=(i)=>{const a=i%GX,b=(i/GX)|0;return Math.hypot(a-t[0],b-t[1])};
  const D=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  while(open.length){
    let bi=0;for(let k=1;k<open.length;k++)if(open[k][0]<open[bi][0])bi=k;
    const [,cur]=open.splice(bi,1)[0]; if(closed[cur])continue; closed[cur]=1;
    if(cur==T)break;
    const ci=cur%GX,cj=(cur/GX)|0;
    for(const [dx,dy,c] of D){
      const a=ci+dx,b=cj+dy; if(a<0||b<0||a>=GX||b>=GY)continue; const n=b*GX+a;
      if(!grid[n]||closed[n])continue;
      if(dx&&dy&&(!grid[cj*GX+a]||!grid[b*GX+ci]))continue;
      const ng=g[cur]+c; if(ng<g[n]){g[n]=ng;from[n]=cur;open.push([ng+h(n),n])}
    }
  }
  if(from[T]<0&&T!=s[1]*GX+s[0])return null;
  const pts=[];for(let n=T;n!=-1;n=from[n]){pts.push(g2w(n%GX,(n/GX)|0))}
  pts.reverse();
  const los=(a,b)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(d/3);for(let k=0;k<=n;k++){if(!free(a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n,3.5))return false}return true};
  const out=[pts[0]];let i=0;
  while(i<pts.length-1){let j=pts.length-1;if(smooth){while(j>i+1&&!los(pts[i],pts[j]))j--}else{j=Math.min(i+1,j)}out.push(pts[j]);i=j}
  out.shift(); out.target=[tx,ty]; return out;
}

/* ============ TEXTURES ============ */
function mk(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);return c}
const rnd=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();
const TEX={
 carpet:mk(256,256,(x,w,h)=>{x.fillStyle="#3b3940";x.fillRect(0,0,w,h);
   for(let i=0;i<5000;i++){x.fillStyle=`rgba(${rnd()<.5?255:0},${rnd()<.5?255:0},${rnd()<.5?255:0},.05)`;x.fillRect(rnd()*w,rnd()*h,1.5,1.5)}
   for(let cx=0;cx<w;cx+=16){x.fillStyle="rgba(24,22,28,.45)";x.fillRect(cx,0,3,h);
     for(let k=0;k<6;k++){x.fillStyle="rgba(214,120,60,.55)";x.fillRect(cx+4,rnd()*h,1.5,10+rnd()*28)}}}),
 tile:mk(120,120,(x,w,h)=>{x.fillStyle="#dcd8d0";x.fillRect(0,0,w,h);x.strokeStyle="#c3bfb6";x.lineWidth=2;x.strokeRect(0,0,w,h);
   for(let i=0;i<500;i++){x.fillStyle="rgba(0,0,0,.025)";x.fillRect(rnd()*w,rnd()*h,2,2)}
   const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,255,.35)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,w,h)}),
 deck:mk(120,60,(x,w,h)=>{for(let y=0;y<h;y+=10){x.fillStyle=`hsl(30,${28+rnd()*8}%,${40+rnd()*6}%)`;x.fillRect(0,y,w,9);x.fillStyle="rgba(0,0,0,.25)";x.fillRect(0,y+9,w,1)}
   for(let i=0;i<120;i++){x.fillStyle="rgba(0,0,0,.07)";x.fillRect(rnd()*w,rnd()*h,10,1)}}),
 meet:mk(128,128,(x,w,h)=>{x.fillStyle="#57544f";x.fillRect(0,0,w,h);for(let i=0;i<2500;i++){x.fillStyle=`rgba(255,255,255,${rnd()*.05})`;x.fillRect(rnd()*w,rnd()*h,1.5,1.5)}}),
 wood:mk(128,128,(x,w,h)=>{x.fillStyle="#7d6247";x.fillRect(0,0,w,h);for(let y=0;y<h;y+=16){x.fillStyle=`rgba(0,0,0,${.08+rnd()*.08})`;x.fillRect(0,y,w,1.5)}
   for(let i=0;i<300;i++){x.fillStyle="rgba(0,0,0,.06)";x.fillRect(rnd()*w,rnd()*h,20,1)}})
};
let PAT={};


function rrect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function fillR(r,fill){ctx.fillStyle=fill;ctx.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1])}
function shadowRect(x,y,w,h,a=.35,d=3){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.fillRect(x+d,y+d,w,h)}

function drawWorld(t){
  ctx.fillStyle="#0c0e12";ctx.fillRect(WORLD[0]-200,WORLD[1]-200,WORLD[2]-WORLD[0]+400,WORLD[3]-WORLD[1]+400);
  fillR(BALC,PAT.deck);
  ctx.fillStyle="rgba(120,180,140,.15)";ctx.fillRect(BALC[0],BALC[1],BALC[2]-BALC[0],BALC[3]-BALC[1]);
  ctx.strokeStyle="#aab3bf";ctx.lineWidth=3;ctx.strokeRect(BALC[0],BALC[1],BALC[2]-BALC[0],BALC[3]-BALC[1]);
  for(let x=230;x<1270;x+=70){ if(x>560&&x<900)continue; plant(x,75,11,t)}
  fillR(FLOOR,PAT.carpet);
  fillR([1050,430,1295,608],PAT.tile);
  ctx.fillStyle="rgba(120,200,255,.10)";
  for(const y0 of [352,455,560])ctx.fillRect(210,y0,640,3);
  ctx.strokeStyle="rgba(214,160,80,.5)";ctx.setLineDash([8,6]);ctx.lineWidth=2;ctx.strokeRect(590,312,250,52);ctx.setLineDash([]);
  for(const r of ROOMS){const k=r.id.startsWith("bay")?null:r.id=="sick"?"tile":"meet";if(k){fillR(r.r,PAT[k])}else{ctx.fillStyle="#2f2d34";ctx.fillRect(r.r[0],r.r[1],r.r[2]-r.r[0],r.r[3]-r.r[1])}}
  fillR([860,115,982,212],PAT.wood);
  for(const s of SIDE){fillR(s.r,s.id=="pantry"||s.id=="bath"?PAT.tile:PAT.meet)}
  ctx.fillStyle="rgba(120,160,210,.18)";ctx.fillRect(113,125,77,65);
  for(let i=0;i<3;i++){ctx.fillStyle="#f2f4f7";rrect(120+i*24,132,18,22,4);ctx.fill();ctx.strokeStyle="#9aa4b2";ctx.lineWidth=1;ctx.stroke()}
  for(let i=0;i<2;i++){ctx.fillStyle="#cfd6df";ctx.fillRect(122+i*30,170,22,10)}
  receptionArt();
  ctx.textAlign="center";ctx.textBaseline="middle";
  for(const z of ZONES){ if(z.id=="welcome"||z.id=="sofa"||z.id=="carrom")continue;
    const [x1,y1,x2,y2]=z.r;ctx.fillStyle="rgba(255,255,255,.55)";
    ctx.font=["pantry","server","bath","sick"].includes(z.id)?"600 9px system-ui":"600 11px system-ui";
    ctx.save();ctx.translate((x1+x2)/2,y1+(z.id=="hr"||z.id=="ceo"||z.id.startsWith("mr")?12:14));
    ctx.fillText(z.name.replace("Department","Dept").replace(" Room"," Rm").toUpperCase(),0,0);ctx.restore()}
  serverPanel(t);decor(t);
  for(const f of FURN)drawFurn(f,t);
  drawChairs();
  for(const n of NPCS)if(!n.hidden)drawNPC(n,t);
  for(const b of BLOCK){ if(b[4]!="w")continue; shadowRect(b[0],b[1],b[2]-b[0],b[3]-b[1],.4,3); }
  for(const b of BLOCK){ if(b[4]!="w")continue; ctx.fillStyle="#e9ecf0";ctx.fillRect(b[0],b[1],b[2]-b[0],b[3]-b[1]); }
  ctx.strokeStyle="#e9ecf0";ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(196,108);ctx.lineTo(585,108);ctx.moveTo(635,108);ctx.lineTo(1295,108);ctx.lineTo(1295,608);ctx.lineTo(1125,608);ctx.moveTo(1085,608);ctx.lineTo(196,608);ctx.lineTo(196,492);ctx.moveTo(196,532);ctx.lineTo(196,370);ctx.moveTo(196,330);ctx.lineTo(196,178);ctx.moveTo(196,148);ctx.lineTo(196,108);ctx.stroke();
  ctx.lineWidth=4;
  for(const s of [[113,125,190,190,[148,178]],[113,206,190,470,[330,370]],[113,486,190,611,[492,532]]]){
    const [x1,y1,x2,y2,d]=s;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y1);ctx.lineTo(x2,d[0]);ctx.moveTo(x2,d[1]);ctx.lineTo(x2,y2);ctx.lineTo(x1,y2);ctx.lineTo(x1,y1);ctx.stroke()}
  for(let y=118;y<600;y+=34){ctx.fillStyle="#aebbcb";ctx.fillRect(1293,y,5,26);ctx.fillStyle="#6f7e92";for(let k=0;k<5;k++)ctx.fillRect(1293,y+k*5,5,1)}
  ctx.fillStyle="rgba(140,210,255,.18)";ctx.fillRect(895,210,50,4);
}
function plant(x,y,r,t){
  ctx.fillStyle="rgba(0,0,0,.3)";ctx.beginPath();ctx.ellipse(x+3,y+4,r,r*.8,0,0,7);ctx.fill();
  ctx.fillStyle="#7a5b3c";ctx.beginPath();ctx.arc(x,y,r*.75,0,7);ctx.fill();
  for(let a=0;a<7;a++){const an=a/7*6.28+Math.sin(t/900+x)*.05;ctx.fillStyle=a%2?"#3f8f4f":"#52a862";ctx.beginPath();ctx.ellipse(x+Math.cos(an)*r*.55,y+Math.sin(an)*r*.55,r*.55,r*.28,an,0,7);ctx.fill()}
}
function receptionArt(){
  ctx.fillStyle="#f4f5f7";ctx.fillRect(1288,440,7,160);
  const pts=[[1262,452],[1280,478],[1258,502],[1282,528],[1262,556],[1282,580]];
  const cols=["#e8832a","#8a8f98","#f0b95e","#5c616a","#e8832a"];
  for(let i=0;i<pts.length-1;i++){ctx.fillStyle=cols[i%cols.length];ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.lineTo(1294,(pts[i][1]+pts[i+1][1])/2);ctx.closePath();ctx.fill()}
  ctx.save();ctx.translate(1272,596);ctx.rotate(-Math.PI/2);ctx.fillStyle="#e8832a";ctx.font="700 9px system-ui";ctx.textAlign="left";ctx.fillText("SIMPLOGICS",0,0);ctx.restore();
  for(const [x,y] of [[1070,452],[1070,484]]){shadowRect(x-14,y-11,28,22,.3,3);ctx.fillStyle="#6d717a";rrect(x-14,y-11,28,22,7);ctx.fill();ctx.strokeStyle="#44484f";ctx.stroke()}
  plant(1062,425,10,0);plant(1062,575,10,0);
  // main entrance: glass doors in the south wall, with mat and arrow
  ctx.fillStyle="rgba(150,210,255,.35)";ctx.fillRect(1085,605,40,5);ctx.strokeStyle="#bfe6ff";ctx.lineWidth=1.5;ctx.strokeRect(1085,605,40,5);ctx.fillStyle="#3b3d44";ctx.fillRect(1090,588,30,10);
  ctx.fillStyle="#e8832a";ctx.font="700 8px system-ui";ctx.textAlign="center";ctx.fillText("ENTRANCE ▲",1105,579);
}
function serverPanel(t){
  const x=124,y=488;
  ctx.fillStyle="#232830";ctx.fillRect(x,y,32,20);ctx.strokeStyle="#6b7686";ctx.lineWidth=1;ctx.strokeRect(x,y,32,20);
  ctx.fillStyle=serverOn?"#2fbf6a":"#d12b2b";ctx.beginPath();ctx.arc(x+7,y+7,3,0,7);ctx.fill();
  // lever
  ctx.fillStyle="#111";ctx.fillRect(x+16,y+4,12,12);
  ctx.strokeStyle="#d9dde3";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+22,y+10);ctx.lineTo(x+22,serverOn?y+3:y+17);ctx.stroke();
  ctx.fillStyle=serverOn?"#2fbf6a":"#d12b2b";ctx.beginPath();ctx.arc(x+22,serverOn?y+3:y+17,3,0,7);ctx.fill();
  ctx.fillStyle="#cfd6df";ctx.font="700 5px system-ui";ctx.textAlign="center";ctx.fillText(serverOn?"SERVER ON":"SERVER OFF",x+16,y+26);
}
function decor(t){
  // balcony stairs down to the atrium
  for(let i=0;i<6;i++){ctx.fillStyle=i%2?"#c9ced6":"#e4e7ec";ctx.fillRect(1246+i*7,50,7,50)}
  ctx.fillStyle="#e8832a";ctx.font="700 7px system-ui";ctx.textAlign="center";ctx.fillText("ATRIUM ↓",1267,46);
  // MR3 whiteboard (south wall), MR1 whiteboard (west wall), HR leave box
  ctx.fillStyle="#f7f8fa";ctx.fillRect(1196,388,82,12);ctx.strokeStyle="#9aa3af";ctx.lineWidth=1;ctx.strokeRect(1196,388,82,12);
  ctx.strokeStyle="#4a6fa5";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(1228,389);ctx.lineTo(1228,399);ctx.moveTo(1242,389);ctx.lineTo(1242,399);ctx.moveTo(1214,392);ctx.lineTo(1256,392);ctx.moveTo(1214,396);ctx.lineTo(1256,396);ctx.stroke();
  ctx.fillStyle="#c93a3a";ctx.font="700 8px system-ui";ctx.textAlign="center";ctx.fillText("X",1235,391);ctx.fillStyle="#2f6b3a";ctx.fillText("O",1249,395);
  ctx.fillStyle="#f7f8fa";ctx.fillRect(322,252,6,66);ctx.strokeStyle="#9aa3af";ctx.strokeRect(322,252,6,66);
  ctx.fillStyle="#2f6b3a";for(const y of [262,276,292,306]){ctx.beginPath();ctx.arc(325,y,1.4,0,7);ctx.fill()}
  ctx.fillStyle="#b93030";ctx.fillRect(1006,428,9,30);ctx.fillStyle="#111";ctx.fillRect(1008,436,5,2);
  ctx.save();ctx.translate(1011,450);ctx.rotate(-Math.PI/2);ctx.fillStyle="#fff";ctx.font="700 4px system-ui";ctx.textAlign="left";ctx.fillText("LEAVE",0,0);ctx.restore();
}
function monitorCol(){return serverOn?"rgba(120,170,255,.6)":"#0a0a0c"}
function drawFurn(f,t){
  const {k,x,y,w,h}=f;
  shadowRect(x,y,w,h,.38,3);
  if(k=="table"){ctx.fillStyle="#7a5e47";rrect(x,y,w,h,6);ctx.fill();ctx.strokeStyle="#4a3727";ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle="rgba(255,255,255,.08)";ctx.fillRect(x+4,y+3,w-8,3);
    for(let i=0;i<Math.floor(w/45);i++){ctx.fillStyle="#222";ctx.beginPath();ctx.arc(x+22+i*45,y+h/2,2.2,0,7);ctx.fill()}}
  else if(k=="desk"){ctx.fillStyle="#eceff3";ctx.fillRect(x,y,w,h);ctx.strokeStyle="#8c95a3";ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
    ctx.fillStyle="#14171b";
    if(f.dir=="b"){ // double-sided bench: divider + a monitor each side
      ctx.fillStyle="#9fc8c0";ctx.fillRect(x+w/2-.6,y,1.2,h);
      ctx.fillStyle="#14171b";ctx.fillRect(x+w/2-3.5,y+h/2-8,1.8,16);ctx.fillRect(x+w/2+1.7,y+h/2-8,1.8,16);
      ctx.fillStyle=monitorCol();ctx.fillRect(x+w/2-3.2,y+h/2-7.5,1.2,15);ctx.fillRect(x+w/2+2,y+h/2-7.5,1.2,15)}
    else if(f.dir=="r"){ctx.fillStyle="#14171b";ctx.fillRect(x+3,y+h/2-11,3,22);ctx.fillStyle=monitorCol();ctx.fillRect(x+3.5,y+h/2-10,2,20);ctx.fillStyle="#cfd3da";ctx.fillRect(x+w-12,y+h/2-6,8,12)}
    else{ctx.fillStyle="#14171b";ctx.fillRect(x+w/2-9,y+2,18,3);ctx.fillStyle=monitorCol();ctx.fillRect(x+w/2-8,y+2.5,16,2);ctx.fillStyle="#cfd3da";ctx.fillRect(x+w/2-6,y+h-11,12,8)}}
  else if(k=="bed"){ctx.fillStyle="#fff";ctx.fillRect(x,y,w,h);ctx.strokeStyle="#c98d8d";ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.fillStyle="#f3d3d3";ctx.fillRect(x+4,y+4,w-8,24);ctx.fillStyle="#cde";ctx.fillRect(x+3,y+36,w-6,h-40)}
  else if(k=="counter"){ctx.fillStyle="#f3f4f6";ctx.fillRect(x,y,w,h);ctx.strokeStyle="#9aa";ctx.strokeRect(x,y,w,h);ctx.fillStyle="#b9c4d0";ctx.beginPath();ctx.arc(x+w/2,y+h/2,6,0,7);ctx.fill()}
  else if(k=="machine"){ctx.fillStyle="#f3f4f6";ctx.fillRect(x,y,w,h);ctx.strokeStyle="#9aa";ctx.strokeRect(x,y,w,h);
    ctx.fillStyle="#2b2f36";rrect(x+3,y+3,w-6,h-6,3);ctx.fill();ctx.fillStyle="#8b94a1";ctx.fillRect(x+6,y+8,w-12,6);
    ctx.fillStyle="#e8e2d6";ctx.beginPath();ctx.arc(x+w/2,y+h-9,5,0,7);ctx.fill();ctx.fillStyle="#7a4a2a";ctx.beginPath();ctx.arc(x+w/2,y+h-9,3.3,0,7);ctx.fill();
    ctx.fillStyle=Math.sin(t/300)>0?"#e8832a":"#6a4a2a";ctx.beginPath();ctx.arc(x+w-7,y+7,1.8,0,7);ctx.fill()}
  else if(k=="rack"){ctx.fillStyle="#2c313a";ctx.fillRect(x,y,w,h);for(let i=0;i<10;i++){ctx.fillStyle=serverOn?((i+Math.floor(t/300))%3?"#2c7a4f":"#e8832a"):"#3a1010";ctx.fillRect(x+3,y+4+i*5,3,2);ctx.fillStyle="#3b414d";ctx.fillRect(x+8,y+4+i*5,9,2)}}
  else if(k=="sofa"){ctx.fillStyle="#5fa9d6";rrect(x,y,w,h,10);ctx.fill();ctx.fillStyle="#7bbde3";rrect(x+4,y+3,w-8,14,7);ctx.fill();ctx.strokeStyle="#2f6a8f";ctx.lineWidth=1.5;rrect(x,y,w,h,10);ctx.stroke()}
  else if(k=="welcome"){ctx.fillStyle="#9fc4d4";rrect(x,y,w,h,12);ctx.fill();ctx.strokeStyle="#5f8798";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="rgba(255,255,255,.25)";ctx.fillRect(x+10,y+8,w-20,6);ctx.fillStyle="#14171b";ctx.fillRect(x+w-30,y+16,20,12);
    ctx.fillStyle="#e8832a";ctx.font="700 11px system-ui";ctx.textAlign="center";ctx.fillText("WELCOME DESK",x+w/2-6,y+h-16)}
  else if(k=="arcade"){
    ctx.fillStyle="#1b1e2b";ctx.fillRect(x,y,w,h);ctx.fillStyle="#e8832a";ctx.fillRect(x,y,3,h);ctx.fillRect(x+w-3,y,3,h);
    ctx.fillStyle="#08130b";ctx.fillRect(x+5,y+3,w-10,11);
    const sx=Math.floor(t/220)%6;ctx.fillStyle="#6ee08a";for(let i=0;i<4;i++)ctx.fillRect(x+7+((sx+i)%6)*2.4,y+8,2,2);ctx.fillStyle="#e33";ctx.fillRect(x+w-9,y+5,2,2);
    ctx.fillStyle="#2c3142";ctx.fillRect(x+4,y+16,w-8,7);ctx.fillStyle="#f2c230";ctx.beginPath();ctx.arc(x+8,y+19.5,1.6,0,7);ctx.fill();ctx.fillStyle="#6ac";ctx.beginPath();ctx.arc(x+w-8,y+19.5,1.6,0,7);ctx.fill()}
  else if(k=="carrom"){
    ctx.fillStyle="#6b4425";rrect(x,y,w,h,4);ctx.fill();ctx.fillStyle="#e8cf9a";ctx.fillRect(x+6,y+6,w-12,h-12);
    ctx.strokeStyle="#6b4425";ctx.lineWidth=.8;ctx.strokeRect(x+11,y+11,w-22,h-22);ctx.beginPath();ctx.arc(x+w/2,y+h/2,9,0,7);ctx.stroke();
    ctx.fillStyle="#1d1a17";for(const [px,py] of [[x+8,y+8],[x+w-8,y+8],[x+8,y+h-8],[x+w-8,y+h-8]]){ctx.beginPath();ctx.arc(px,py,3.4,0,7);ctx.fill()}
    for(let i=0;i<9;i++){const a=i/9*6.28;ctx.fillStyle=i%2?"#f6f2e8":"#2a2623";ctx.beginPath();ctx.arc(x+w/2+Math.cos(a)*7,y+h/2+Math.sin(a)*7,2.2,0,7);ctx.fill()}
    ctx.fillStyle="#c93a3a";ctx.beginPath();ctx.arc(x+w/2,y+h/2,2.2,0,7);ctx.fill()}
}
function drawChairs(){
  const chair=(x,y,a=0)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle="rgba(0,0,0,.3)";ctx.beginPath();ctx.arc(1.5,2,5.5,0,7);ctx.fill();ctx.fillStyle="#1f2228";ctx.beginPath();ctx.arc(0,0,5.5,0,7);ctx.fill();ctx.fillStyle="#323741";ctx.fillRect(-6.5,-3,3,6);ctx.restore()};
  for(const f of FURN){
    if(f.k=="table"){const n=Math.floor(f.w/30);for(let i=0;i<n;i++){const x=f.x+(f.w/n)*(i+.5);chair(x,f.y-7,Math.PI/2);chair(x,f.y+f.h+7,-Math.PI/2)}if(f.w<60){chair(f.x-7,f.y+f.h/2,0);chair(f.x+f.w+7,f.y+f.h/2,Math.PI)}}
  }
  for(const s of SEATS)chair(s.x,s.y,s.face+Math.PI);
  for(const dy of [290,325,360]){chair(1203,dy,0);chair(1272,dy,Math.PI)}
}

/* ============ WORKERS (NPCs) ============ */
function drawNPC(n,t){
  const mad=!serverOn, sit=Math.sin(t/650+n.ph);
  ctx.save();ctx.translate(n.x,n.y+(disco>0?Math.sin(t/90+n.ph)*1.3:0));ctx.rotate(n.face+(disco>0?Math.sin(t/110+n.ph)*.7:0));
  const sq=n.hit>0?1-.3*Math.sin(n.hit/.7*Math.PI):1;
  ctx.fillStyle=n.shirt;ctx.beginPath();ctx.ellipse(-1,0,4.4,8,0,0,7);ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,.35)";ctx.lineWidth=.7;ctx.stroke();
  // arms: typing normally, flailing when furious
  const sw=mad?Math.sin(t/60+n.ph)*3:Math.sin(t/180+n.ph)*1.1;
  ctx.fillStyle=n.skin;ctx.beginPath();ctx.arc(mad?3+sw:5,-6.8+(mad?sw:sw*.5),1.9,0,7);ctx.fill();ctx.beginPath();ctx.arc(mad?3-sw:5,6.8+(mad?-sw:-sw*.5),1.9,0,7);ctx.fill();
  // head
  ctx.save();ctx.translate(1+sit*.2,0);ctx.scale(sq,1/sq*1);
  ctx.fillStyle=mad?"#e27d6a":n.skin;ctx.beginPath();ctx.arc(0,0,4.6,0,7);ctx.fill();
  ctx.fillStyle=n.hair;ctx.beginPath();ctx.arc(-.8,0,4.7,Math.PI*.42,Math.PI*1.58);ctx.fill();
  ctx.restore();
  if(n.king){ // crown
    ctx.translate(1,0);ctx.fillStyle="#f2c230";ctx.strokeStyle="#9a6d00";ctx.lineWidth=.6;
    ctx.beginPath();for(let i=0;i<5;i++){const a=i/5*6.283,r1=6.3,r2=4.4;ctx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);ctx.lineTo(Math.cos(a+.628)*r2,Math.sin(a+.628)*r2)}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="#d1342b";for(let i=0;i<5;i++){const a=i/5*6.283;ctx.beginPath();ctx.arc(Math.cos(a)*6.3,Math.sin(a)*6.3,.9,0,7);ctx.fill()}
  }
  ctx.restore();
  // stars when bonked
  if(n.hit>0){for(let i=0;i<3;i++){const a=t/120+i*2.1;ctx.fillStyle="#ffd54a";ctx.font="700 8px system-ui";ctx.textAlign="center";ctx.fillText("★",n.x+Math.cos(a)*9,n.y+Math.sin(a)*9)}}
  if(disco>0){ctx.font="8px system-ui";ctx.textAlign="center";ctx.globalAlpha=.8;ctx.fillText(["♪","♫","🎵"][(n.ph*3|0)%3],n.x+7,n.y-9-((t/220+n.ph)%5));ctx.globalAlpha=1}
  if(mad&&n.hit<=0){ctx.font="8px system-ui";ctx.textAlign="center";ctx.fillText("💢",n.x+(n.face==0?-2:2),n.y-11+Math.sin(t/90+n.ph)*1.2)}
  if(n.name){const lab=(n.king?"👑 ":"")+n.name.toUpperCase();ctx.font="700 6.5px system-ui";const w=ctx.measureText(lab).width+7;
    ctx.fillStyle=n.king?"#3a2a00e8":"#0f1217d0";rrect(n.x-w/2,n.y-18.5,w,9,3);ctx.fill();ctx.fillStyle=n.king?"#ffd54a":"#cfd6df";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(lab,n.x,n.y-14)}
}
function drawBubbles(){
  for(const n of NPCS){ if(n.sayT<=0||!n.say)continue;
    ctx.font="700 7px system-ui";const w=ctx.measureText(n.say).width+8,x=n.x,y=n.y-26;
    ctx.fillStyle="#fff";rrect(x-w/2,y-6,w,12,4);ctx.fill();ctx.beginPath();ctx.moveTo(x-2,y+6);ctx.lineTo(x+2,y+6);ctx.lineTo(x,y+10);ctx.fill();
    ctx.fillStyle="#1a1d23";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(n.say,x,y)}
}



/* =====================================================================
   THE STORY SCENE: the office, walked by Anamika (small top-down sprites, like the explorer)
   ===================================================================== */
// carve a side gap in Bay 3's west wall so Sreedev can step out of his seat; drop his NPC collision box
(function(){
  const bay3=ROOMS.find(r=>r.id==="bay3"),x=bay3.r[0];
  for(let i=BLOCK.length-1;i>=0;i--){const b=BLOCK[i];if(b[4]==="w"&&Math.abs(b[0]-(x-WT/2))<.1&&b[3]-b[1]>100){BLOCK.splice(i,1);BLOCK.push([b[0],b[1],b[2],488,"w"],[b[0],560,b[2],b[3],"w"]);break}}
  const king=NPCS.find(n=>n.king);king.hidden=true;
  const anam=NPCS.find(n=>n.name==="Anamika");anam.hidden=true;anam.loop="";S.SEAT=[anam.x,anam.y];
  for(let i=BLOCK.length-1;i>=0;i--){const b=BLOCK[i];if(b[4]==="n"&&Math.abs(b[0]-(anam.x-4))<.1&&Math.abs(b[1]-(anam.y-4))<.1){BLOCK.splice(i,1);break}}
  for(let i=BLOCK.length-1;i>=0;i--){const b=BLOCK[i];if(b[4]==="n"&&Math.abs(b[0]-(king.x-4))<.1&&Math.abs(b[1]-(king.y-4))<.1){BLOCK.splice(i,1);break}}
  for(let j=0;j<GY;j++)for(let i=0;i<GX;i++)grid[j*GX+i]=free(WORLD[0]+i*CELL+CELL/2,WORLD[1]+j*CELL+CELL/2)?1:0;
})();
S.map={free,findPath,WORLD,FLOOR,BALC,NPCS,ROOMS};

S.Office={
  enter(o){
    o=o||{};G.showClock=true;
    for(const k in TEX)PAT[k]=ctx.createPattern(TEX[k],"repeat");
    const sp=o.spawn||[700,330];this.z=o.z||2.1;this.cam={x:sp[0],y:sp[1]};
    const king=NPCS.find(n=>n.king);
    this.dev=S.person("ANAMIKA",{label:true,x:sp[0],y:sp[1],face:Math.PI/2});
    this.sree=S.person("SREEDEV",{x:king.x,y:king.y,face:0,seat:true,label:true});
    this.navya=S.person("NAVYA",{x:1210,y:520,vis:false,face:Math.PI,label:true});
    this.control=!!o.control;this.path=null;this.goal=null;this.lit=0;this.pr={};this.minY=WORLD[1];this.eWas=false;this.res=null;this.autoRes=null;this.t0=G.t;
    G.chapter(o.ch||0,o.title||"");A.setMusic("office");
  },
  exit(){G.hint("")},
  /* ---- movement API ---- */
  setControl(v){this.control=v;if(!v)this.path=null},
  setGoal(g){this.goal=g;this.control=true;this.res=null;G.hint(g.label||"");return new Promise(r=>{this.res=r})},
  walkPlayer(x,y,speed){const p=findPath(this.dev.x,this.dev.y,x,y);return new Promise(r=>{if(!p||!p.length){r();return}this.control=false;this.path=p;this.autoRes=r;this.autoSpeed=speed||110})},
  async walkActor(a,x,y,speed){const p=findPath(a.x,a.y,x,y);if(!p)return;for(const q of p)await S.goTo(a,q[0],q[1],{speed:speed||78});},
  lightsOn(){return new Promise(async r=>{for(let i=0;i<10;i++){this.lit=i+1;A.sfx("click");await G.wait(300)}r()})},
  click(x,y){if(!this.control)return;const wx=this.cam.x+(x-640)/this.z,wy=this.cam.y+(y-360)/this.z;const p=findPath(this.dev.x,this.dev.y,wx,wy);if(p&&p.length){this.path=p;this.autoSpeed=110;this.mark={x:wx,y:wy,t:0}}},
  update(dt){
    const t=G.t,P=this.dev;
    // player
    let dx=0,dy=0,auto=false;
    if(this.control){dx=(G.down("d","arrowright")?1:0)-(G.down("a","arrowleft")?1:0);dy=(G.down("s","arrowdown")?1:0)-(G.down("w","arrowup")?1:0);if(dx||dy)this.path=null}
    if(!dx&&!dy&&this.path&&this.path.length){const [tx,ty]=this.path[0],d=Math.hypot(tx-P.x,ty-P.y);
      if(d<2.5){this.path.shift();if(!this.path.length){this.path=null;if(this.autoRes){const r=this.autoRes;this.autoRes=null;r()}}}else{dx=(tx-P.x)/d;dy=(ty-P.y)/d;auto=true}}
    if(dx||dy){const l=Math.hypot(dx,dy);dx/=l;dy/=l;const sp=(auto?(this.autoSpeed||110):(G.down("shift")?150:100))*dt;const ox=P.x,oy=P.y;
      if(free(P.x+dx*sp,P.y))P.x+=dx*sp;if(free(P.x,P.y+dy*sp))P.y+=dy*sp;
      if(auto&&Math.hypot(P.x-ox,P.y-oy)<sp*.2){this.stuck=(this.stuck||0)+dt;if(this.stuck>.25&&this.path){const e=this.path[this.path.length-1];const np=findPath(P.x,P.y,e[0],e[1],false);if(np)this.path=np;this.stuck=0}}else this.stuck=0;
      let da=Math.atan2(dy,dx)-P.face;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;P.face+=da*Math.min(1,dt*14);P.pose="walk";P.ph+=dt*11;if(Math.random()<dt*2)A.sfx("step")}
    else if(!P.task)P.pose="stand";
    S.stepPerson(P.task?P:{task:null},dt);if(P.task)S.stepPerson(P,dt);
    S.stepPerson(this.sree,dt);S.stepPerson(this.navya,dt);
    // goal
    const g=this.goal;if(g){const d=Math.hypot(P.x-g.x,P.y-g.y);
      if(d<g.r){if(g.auto||G.down("e")){this.goal=null;G.hint("");const r=this.res;this.res=null;this.control=false;this.path=null;if(r)r()}else G.hint((g.label||"")+"  —  press E")}
      else G.hint(g.label||"")}
    // npc chatter (Anamika)
    for(const n of NPCS){if(n.sayT>0)n.sayT-=dt;if(n.loop){n.loopT-=dt;if(n.loopT<=0&&n.sayT<=0){n.say=n.loop;n.sayT=3.4;n.loopT=7}}}
    if(this.mark){this.mark.t+=dt;if(this.mark.t>1.2)this.mark=null}Art.updateFx(dt);
    // camera
    const hw=640/this.z,hh=360/this.z,tx=G.clamp(P.x,WORLD[0]+hw-20,WORLD[2]-hw+20),ty=G.clamp(P.y,this.minY+hh-20,WORLD[3]-hh+20);
    this.cam.x+=(tx-this.cam.x)*Math.min(1,dt*5);this.cam.y+=(ty-this.cam.y)*Math.min(1,dt*5);
  },
  north(t){
    // outside the balcony: neighbouring Technopark rooftops (lights come on one by one)
    const night=S.sky(G.time).night;ctx.save();
    ctx.fillStyle=night>.5?"#0c1410":"#4f8a4a";ctx.fillRect(-300,-420,1900,466);
    const B=[[210,-60,150,56],[400,-110,120,90],[560,-70,160,60],[760,-120,130,100],[940,-60,170,56],[1130,-110,140,80],[330,-230,170,90],[620,-250,150,100],[900,-230,180,90],[1110,-250,120,100]];
    B.forEach((b,i)=>{const on=night>.3&&i<this.lit;
      ctx.fillStyle="rgba(0,0,0,.35)";ctx.fillRect(b[0]+5,b[1]+5,b[2],b[3]);ctx.fillStyle=night>.5?"#1a2236":"#b9604a";ctx.fillRect(b[0],b[1],b[2],b[3]);
      ctx.fillStyle=night>.5?"#232d48":"#c9735a";ctx.fillRect(b[0]+6,b[1]+6,b[2]-12,b[3]-12);
      if(on){ctx.fillStyle="rgba(255,214,130,.9)";for(let wx=b[0]+12;wx<b[0]+b[2]-14;wx+=16){ctx.fillRect(wx,b[1]+b[3]-4,9,4);ctx.fillRect(wx,b[1],9,4)}
        const gr=ctx.createRadialGradient(b[0]+b[2]/2,b[1]+b[3]/2,4,b[0]+b[2]/2,b[1]+b[3]/2,120);gr.addColorStop(0,"rgba(255,206,120,.5)");gr.addColorStop(1,"rgba(255,206,120,0)");ctx.fillStyle=gr;ctx.fillRect(b[0]-120,b[1]-120,b[2]+240,b[3]+240)}});
    for(const [x,y] of [[160,-20],[300,-170],[520,-20],[820,-170],[1000,-20],[1250,-170],[700,-20]]){ctx.fillStyle="rgba(0,0,0,.25)";ctx.beginPath();ctx.arc(x+4,y+5,18,0,7);ctx.fill();ctx.fillStyle=night>.5?"#0f2a1a":"#2e7a3d";ctx.beginPath();ctx.arc(x,y,18,0,7);ctx.fill()}
    ctx.restore();
  },
  drawProps(t){
    const P=this.pr,g=ctx;
    // cup shelf, kettle, tea caddy in the pantry
    g.fillStyle="#7b5c44";g.fillRect(116,209,72,9);g.fillStyle="rgba(0,0,0,.3)";g.fillRect(116,218,72,2);
    for(const [x,c,r] of [[128,"#f3efe8",3.4],[146,"#e8a0b8",3.8],[172,"#cfeaf3",6]]){if(P.cup==="big"&&r===6)continue;g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.arc(x+1,214,r,0,7);g.fill();g.fillStyle=c;g.beginPath();g.arc(x,213,r,0,7);g.fill();g.fillStyle="rgba(255,255,255,.4)";g.beginPath();g.arc(x-1,212,r*.4,0,7);g.fill()}
    // kettle on counter 2
    g.fillStyle="rgba(0,0,0,.28)";g.beginPath();g.ellipse(139,296,10,9,0,0,7);g.fill();g.fillStyle="#dfe4ec";g.beginPath();g.arc(136,293,9,0,7);g.fill();g.strokeStyle="#8d96a5";g.lineWidth=1;g.stroke();g.fillStyle="#2b2f37";g.beginPath();g.arc(136,293,3,0,7);g.fill();g.fillStyle="#444b57";g.fillRect(143,291,8,3);g.strokeStyle="#2b2f37";g.lineWidth=2;g.beginPath();g.arc(128,293,6,1.6,4.7);g.stroke();
    g.fillStyle=P.boiling?"#4aa8ff":"#555";g.beginPath();g.arc(136,300,1.5,0,7);g.fill();
    if(P.boiling){for(let i=0;i<4;i++){g.strokeStyle=`rgba(255,255,255,${.5-i*.1})`;g.lineWidth=1.5;const o=(t*20+i*7)%20;g.beginPath();g.arc(147+i*1,291-o*.4,2+o*.1,0,7);g.stroke()}}
    // caddy + milk + sugar on counter 3
    g.fillStyle="#3d7a58";g.beginPath();g.arc(131,401,6,0,7);g.fill();g.fillStyle="#d8b24a";g.fillRect(125,399,12,3);g.fillStyle="#b8332b";g.fillRect(140,396,8,10);g.fillStyle="#f5f7fa";g.fillRect(127,413,7,9);g.fillStyle="#3a74c9";g.fillRect(127,416,7,3);g.fillStyle="#dde8ee";g.fillRect(138,414,8,8);g.fillStyle="#fff";g.fillRect(140,416,4,4);
    // placed cup (counter 4)
    if(P.cup){g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.arc(138,445,6.5,0,7);g.fill();g.fillStyle="rgba(205,235,245,.9)";g.beginPath();g.arc(136,443,6,0,7);g.fill();g.strokeStyle="rgba(255,255,255,.9)";g.lineWidth=1;g.stroke();g.fillStyle=P.water?(P.tea?"#5a2d12":"#dfeef5"):"#222";g.beginPath();g.arc(136,443,4.2,0,7);g.fill();
      if(P.tea){for(let i=0;i<3;i++){g.strokeStyle=`rgba(255,255,255,${.4-i*.1})`;g.lineWidth=1.2;const o=(t*18+i*8)%16;g.beginPath();g.arc(134+i*2,440-o*.5,2+o*.1,0,7);g.stroke()}}}
    // lift by reception
    g.fillStyle="#c9ced6";g.fillRect(1022,590,60,18);g.fillStyle="#8c93a0";g.fillRect(1051,590,2,18);g.strokeStyle="#6a7280";g.lineWidth=1.5;g.strokeRect(1022,590,60,18);
    g.fillStyle="#12141a";g.fillRect(1038,583,28,7);g.fillStyle="#ff6a3d";g.font="700 6px system-ui";g.textAlign="center";g.fillText("LIFT ▼",1052,589);
    // dining / thought prop: Sreedev's cup on his desk
    if(P.deskCup){g.fillStyle="#f4f1ea";g.beginPath();g.arc(586,498,3.6,0,7);g.fill();g.fillStyle="#5a2d12";g.beginPath();g.arc(586,498,2.5,0,7);g.fill();for(let i=0;i<2;i++){g.strokeStyle=`rgba(255,255,255,${.4-i*.12})`;g.lineWidth=1;const o=(t*16+i*8)%14;g.beginPath();g.arc(586+i*2,495-o*.5,2+o*.1,0,7);g.stroke()}}
  },
  draw(g){
    const t=G.t,z=this.z;g.save();g.translate(640,360);g.scale(z,z);g.translate(-this.cam.x,-this.cam.y);
    drawWorld(t);this.north(t);this.drawProps(t);
    // goal ring + beacon
    const gl=this.goal;if(gl){const p=.5+.5*Math.sin(t*5);g.strokeStyle=`rgba(255,209,102,${.5+p*.5})`;g.lineWidth=2;g.beginPath();g.arc(gl.x,gl.y,gl.r*.7+p*3,0,7);g.stroke();g.fillStyle="rgba(255,209,102,.15)";g.beginPath();g.arc(gl.x,gl.y,gl.r*.7,0,7);g.fill();
      g.fillStyle="#ffd166";g.beginPath();g.moveTo(gl.x,gl.y-gl.r-4-p*2);g.lineTo(gl.x-5,gl.y-gl.r-12-p*2);g.lineTo(gl.x+5,gl.y-gl.r-12-p*2);g.fill()}
    if(this.mark){g.strokeStyle=`rgba(232,131,42,${1-this.mark.t/1.2})`;g.lineWidth=1;g.beginPath();g.arc(this.mark.x,this.mark.y,3+this.mark.t*10,0,7);g.stroke()}
    for(const a of [this.sree,this.navya,this.dev])S.drawPerson(g,a,t);
    drawBubbles();
    g.restore();
    for(const a of [this.dev,this.sree,this.navya]){a.bx=640+(a.x-this.cam.x)*z;a.by=360+(a.y-this.cam.y)*z-26}
    Art.drawFx(g);G.drawBubbles(g);
    S.interiorTint(g,G.time);S.vignette(g,.4);
  }
};

})();
