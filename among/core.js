/* ================= CORE: audio, bean characters, line-of-sight, fast pathfinding ================= */
(function(){
"use strict";
const TAU=Math.PI*2,M=window.MAP;
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ---------- audio (all synthesized) ---------- */
const AUDIO=window.AUDIO={ctx:null,muted:false,
  init(){if(this.ctx){if(this.ctx.state==="suspended")this.ctx.resume();return}try{this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.8;this.master.connect(this.ctx.destination);
    const n=this.ctx.sampleRate,b=this.ctx.createBuffer(1,n,n),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;this.nb=b}catch(e){}},
  tone(f,d=.15,type="triangle",v=.05,s=null,when=0){const c=this.ctx;if(!c||this.muted)return;const t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(s)o.frequency.exponentialRampToValueAtTime(s,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(this.master);o.start(t);o.stop(t+d+.05)},
  noise(d=.3,v=.05,fq=1500,type="lowpass",when=0){const c=this.ctx;if(!c||this.muted)return;const t=c.currentTime+when,s=c.createBufferSource();s.buffer=this.nb;const f=c.createBiquadFilter();f.type=type;f.frequency.value=fq;const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(this.master);s.start(t);s.stop(t+d+.05)},
  sfx(n){if(!this.ctx)return;const T=(...a)=>this.tone(...a);
    switch(n){
      case"click":T(520,.06,"triangle",.05);break;
      case"done":T(784,.12,"triangle",.06);T(1175,.2,"triangle",.06,null,.1);break;
      case"kill":this.noise(.25,.12,900);T(260,.3,"sawtooth",.08,60);break;
      case"report":for(let i=0;i<6;i++)T(i%2?520:880,.14,"square",.06,null,i*.16);break;
      case"meeting":T(220,.5,"sawtooth",.07);T(165,.7,"sawtooth",.07,null,.35);break;
      case"vote":T(660,.07,"square",.04);break;
      case"steal":T(1800,.06,"square",.04);T(1400,.1,"square",.04,null,.07);break;
      case"siren":for(let i=0;i<4;i++)T(i%2?600:900,.28,"sawtooth",.05,null,i*.3);break;
      case"fix":T(440,.1,"triangle",.06);T(660,.14,"triangle",.06,null,.1);T(990,.2,"triangle",.06,null,.2);break;
      case"eject":this.noise(.9,.08,700,"bandpass");T(500,.9,"sine",.05,80);break;
      case"win":[523,659,784,1047].forEach((f,i)=>T(f,.3,"triangle",.07,null,i*.14));break;
      case"lose":[392,330,262,196].forEach((f,i)=>T(f,.4,"sawtooth",.06,null,i*.2));break;
      case"coin":T(1318,.08,"square",.04);T(1760,.14,"square",.04,null,.07);break;
      case"step":this.noise(.04,.03,500);break;
    }}
};

/* ---------- bean characters (side view, like the originals) ---------- */
const sh=(hex,a)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=a<0?0:255,t=Math.abs(a);return`rgb(${Math.round(r+(f-r)*t)},${Math.round(g+(f-g)*t)},${Math.round(b+(f-b)*t)})`};
function hat(g,type){
  g.save();
  if(type==="crown"){g.fillStyle="#f2c230";g.strokeStyle="#8a6200";g.lineWidth=1.6;g.beginPath();g.moveTo(-9,-47);g.lineTo(-9,-58);g.lineTo(-4,-52);g.lineTo(0,-61);g.lineTo(4,-52);g.lineTo(9,-58);g.lineTo(9,-47);g.closePath();g.fill();g.stroke();g.fillStyle="#d1342b";g.beginPath();g.arc(0,-62,2,0,TAU);g.fill()}
  else if(type==="flower"){const c=["#ff5d8a","#ffd166"];for(let i=0;i<6;i++){g.fillStyle=c[0];g.beginPath();g.ellipse(7+Math.cos(i)*5,-50+Math.sin(i)*5,4,3,i,0,TAU);g.fill()}g.fillStyle=c[1];g.beginPath();g.arc(7,-50,3,0,TAU);g.fill()}
  else if(type==="phones"){g.strokeStyle="#222";g.lineWidth=3.4;g.beginPath();g.arc(0,-34,17,Math.PI*1.05,Math.PI*1.95);g.stroke();g.fillStyle="#222";g.beginPath();g.roundRect(-20,-36,7,13,3);g.fill();g.beginPath();g.roundRect(13,-36,7,13,3);g.fill()}
  else if(type==="cap"){g.fillStyle="#d33";g.beginPath();g.ellipse(0,-45,14,8,0,Math.PI,TAU);g.fill();g.fillRect(2,-47,17,4)}
  else if(type==="night"){g.fillStyle="#6ec8ff";g.beginPath();g.moveTo(-13,-45);g.quadraticCurveTo(0,-72,22,-52);g.lineTo(13,-45);g.closePath();g.fill();g.fillStyle="#fff";g.beginPath();g.arc(22,-52,4,0,TAU);g.fill()}
  else if(type==="band"){g.fillStyle="#ff4d4d";g.fillRect(-15,-43,30,5);g.fillRect(-18,-44,6,12)}
  else if(type==="chef"){g.fillStyle="#fff";g.beginPath();g.roundRect(-10,-62,20,18,6);g.fill();g.beginPath();g.arc(-7,-60,7,0,TAU);g.arc(7,-60,7,0,TAU);g.arc(0,-64,7,0,TAU);g.fill();g.fillRect(-12,-46,24,4)}
  else if(type==="top"){g.fillStyle="#111";g.fillRect(-9,-62,18,17);g.fillRect(-15,-46,30,4);g.fillStyle="#c33";g.fillRect(-9,-52,18,3)}
  g.restore();
}
/* origin = feet centre. dir = 1 (facing right) or -1. walk = phase. opts:{alpha,ghost,dead,scale} */
function bean(g,x,y,color,dir,walk,hatType,o){
  o=o||{};const s=o.scale||.52;g.save();g.translate(x,y);g.scale(dir*s,s);
  if(o.alpha!=null)g.globalAlpha=o.alpha;
  if(o.dead){ // lying body with a bone, like the classics
    g.rotate(-1.35);g.translate(0,-2);
  }
  const mv=Math.abs(Math.sin(walk));
  if(!o.dead){g.fillStyle="rgba(0,0,0,.28)";g.beginPath();g.ellipse(0,0,22,6,0,0,TAU);g.fill()}
  const dk=sh(color,-.32);
  // legs
  const l1=Math.sin(walk)*7,l2=-l1;
  g.fillStyle=dk;g.beginPath();g.roundRect(-14+l1*.2,-14,12,16+Math.max(0,-l1)*.5,5);g.fill();g.beginPath();g.roundRect(3+l2*.2,-14,12,16+Math.max(0,-l2)*.5,5);g.fill();
  // backpack
  g.fillStyle=dk;g.beginPath();g.roundRect(-27,-38,13,28,6);g.fill();
  // body
  const gr=g.createLinearGradient(-18,0,18,0);gr.addColorStop(0,sh(color,.15));gr.addColorStop(.6,color);gr.addColorStop(1,sh(color,-.25));
  g.fillStyle=gr;g.beginPath();g.roundRect(-18,-50,36,42,16);g.fill();
  if(o.dead){g.fillStyle="#f4f4ee";g.beginPath();g.roundRect(-5,-12,10,12,4);g.fill();g.beginPath();g.arc(-4,-1,3.4,0,TAU);g.arc(4,-1,3.4,0,TAU);g.fill()}
  g.fillStyle="rgba(255,255,255,.28)";g.beginPath();g.ellipse(-8,-42,4,7,-.4,0,TAU);g.fill();
  // visor
  g.fillStyle="#b9e6f4";g.beginPath();g.roundRect(1,-44,20,14,7);g.fill();g.fillStyle="#6aa9c9";g.beginPath();g.roundRect(3,-37,16,7,4);g.fill();g.fillStyle="#fff9";g.beginPath();g.ellipse(14,-41,5,2.4,0,0,TAU);g.fill();
  if(hatType)hat(g,hatType);
  g.restore();
}
window.BEAN={bean,sh};
window.beanIcon=(cv,color,hatType,dead)=>{const g=cv.getContext("2d");g.clearRect(0,0,cv.width,cv.height);const s=cv.width/64;g.save();g.scale(s,s);bean(g,34,60,color,1,0,hatType,{scale:.95,alpha:dead?.5:1});g.restore()};

/* ---------- walls for line of sight ---------- */
const WALLS=[];for(const b of M.BLOCK)if(b[4]==="w")WALLS.push([b[0],b[1],b[2],b[3]]);
function segHits(ax,ay,bx,by,r){ // Liang–Barsky: does segment hit the rect?
  let t0=0,t1=1;const dx=bx-ax,dy=by-ay,p=[-dx,dx,-dy,dy],q=[ax-r[0],r[2]-ax,ay-r[1],r[3]-ay];
  for(let i=0;i<4;i++){if(p[i]===0){if(q[i]<0)return false}else{const t=q[i]/p[i];if(p[i]<0){if(t>t1)return false;if(t>t0)t0=t}else{if(t<t0)return false;if(t<t1)t1=t}}}
  return true;
}
function los(ax,ay,bx,by){for(let i=0;i<WALLS.length;i++)if(segHits(ax,ay,bx,by,WALLS[i]))return false;return true}
function rayDist(ox,oy,ang,maxD){ // nearest wall hit distance along a ray
  const dx=Math.cos(ang),dy=Math.sin(ang);let best=maxD;
  for(let i=0;i<WALLS.length;i++){const r=WALLS[i];let t0=-1e9,t1=1e9,ok=true;
    if(dx===0){if(ox<r[0]||ox>r[2])ok=false}else{let a=(r[0]-ox)/dx,b=(r[2]-ox)/dx;if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b)}
    if(ok){if(dy===0){if(oy<r[1]||oy>r[3])ok=false}else{let a=(r[1]-oy)/dy,b=(r[3]-oy)/dy;if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b)}}
    if(ok&&t0<=t1&&t1>=0){const t=t0>=0?t0:t1;if(t>=0&&t<best)best=t}}
  return best;
}

/* ---------- fast A* on the map grid (binary heap) ---------- */
const {grid,GX,GY,CELL,WORLD}=M;
const N=GX*GY,gS=new Float32Array(N),from=new Int32Array(N),stamp=new Uint32Array(N);let sid=0;
const w2g=(x,y)=>[Math.floor((x-WORLD[0])/CELL),Math.floor((y-WORLD[1])/CELL)];
const g2w=(i,j)=>[WORLD[0]+i*CELL+CELL/2,WORLD[1]+j*CELL+CELL/2];
function nearestCell(x,y){let [i,j]=w2g(x,y);i=Math.max(0,Math.min(GX-1,i));j=Math.max(0,Math.min(GY-1,j));if(grid[j*GX+i])return[i,j];
  for(let r=1;r<70;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=i+di,b=j+dj;if(a<0||b<0||a>=GX||b>=GY)continue;if(grid[b*GX+a])return[a,b]}return null}
function snap(x,y){const c=nearestCell(x,y);return c?g2w(c[0],c[1]):[x,y]}
function path(sx,sy,tx,ty){
  const s=nearestCell(sx,sy),t=nearestCell(tx,ty);if(!s||!t)return null;sid++;
  const S=s[1]*GX+s[0],T=t[1]*GX+t[0];const heap=[[0,S]];gS[S]=0;stamp[S]=sid;from[S]=-1;
  const hf=i=>Math.hypot(i%GX-t[0],((i/GX)|0)-t[1]);
  const push=(f,n)=>{heap.push([f,n]);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=heap[i][0])break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){let l=2*i+1,r=l+1,m=i;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m}}return top};
  const D=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];const closed=new Set();let found=false;
  while(heap.length){const [,cur]=pop();if(closed.has(cur))continue;closed.add(cur);if(cur===T){found=true;break}
    const ci=cur%GX,cj=(cur/GX)|0;
    for(const [dx,dy,c] of D){const a=ci+dx,b=cj+dy;if(a<0||b<0||a>=GX||b>=GY)continue;const n=b*GX+a;if(!grid[n]||closed.has(n))continue;if(dx&&dy&&(!grid[cj*GX+a]||!grid[b*GX+ci]))continue;
      const ng=gS[cur]+c;if(stamp[n]!==sid||ng<gS[n]){stamp[n]=sid;gS[n]=ng;from[n]=cur;push(ng+hf(n),n)}}}
  if(!found)return null;
  const pts=[];for(let n=T;n!==-1;n=from[n])pts.push(g2w(n%GX,(n/GX)|0));pts.reverse();
  const ok=(a,b)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(d/3);for(let k=0;k<=n;k++)if(!M.free(a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n,3.5))return false;return true};
  const out=[pts[0]];let i=0;while(i<pts.length-1){let j=pts.length-1;while(j>i+1&&!ok(pts[i],pts[j]))j--;out.push(pts[j]);i=j}
  out.shift();return out;
}
window.NAV={los,rayDist,path,snap,WALLS,rnd};
})();
