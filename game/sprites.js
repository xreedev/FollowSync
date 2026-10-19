/* ================= SPRITES: the same small top-down people as the office explorer ================= */
(function(){
"use strict";
const TAU=Math.PI*2;
/* look of each character — Devika is the orange player from the explorer; Sreedev is the crowned worker */
const LOOK={
  DEVIKA:{shirt:"#e8832a",edge:"#9a4f10",skin:"#f1c9a5",hair:"#1d1a1c",card:true,color:"#ff9d4a"},
  SREEDEV:{shirt:"#7a1f3d",edge:"rgba(0,0,0,.4)",skin:"#d9a577",hair:"#1c1614",crown:true,color:"#ffd166"},
  NAVYA:{shirt:"#7f6bd0",edge:"rgba(0,0,0,.4)",skin:"#f1c9a5",hair:"#2a1a16",color:"#b9a2ff"},
  BROTHER:{shirt:"#3b8d6e",edge:"rgba(0,0,0,.4)",skin:"#d9a577",hair:"#17120f",color:"#7be0b0"},
  VENDOR:{shirt:"#e6e0cf",edge:"rgba(0,0,0,.4)",skin:"#b97d52",hair:"#222",color:"#ffb27a"}
};
LOOK["HER BROTHER"]=LOOK.BROTHER;
S.LOOK=LOOK;

/* a story actor: {name,x,y,face,pose,ph,...}. Drawn at world scale k (1 = the explorer's size) */
S.person=function(name,o){return Object.assign({name,x:0,y:0,face:0,pose:"stand",ph:0,vis:true,hold:null,helmet:false,label:false,say:"",task:null,seat:false,bx:0,by:0,k:1},o||{})};
S.drawPerson=function(g,a,t,k){
  if(!a.vis)return;const L=LOOK[a.name]||LOOK.NAVYA;k=(k||1)*(a.k||1);
  const moving=a.pose==="walk"||a.pose==="jog",sw=moving?Math.sin(a.ph)*(a.pose==="jog"?5:3.6):0,bob=moving?Math.abs(Math.sin(a.ph))*.7:0,sit=Math.sin(t*1.5+(a.x||0));
  g.save();g.translate(a.x,a.y);g.scale(k,k);
  g.fillStyle="rgba(0,0,0,.33)";g.beginPath();g.ellipse(1.5,2.5,9,7,0,0,TAU);g.fill();
  g.rotate(a.face);
  g.fillStyle="#262a33";g.beginPath();g.ellipse(sw,3.4,3.6,2.4,0,0,TAU);g.fill();g.beginPath();g.ellipse(-sw,-3.4,3.6,2.4,0,0,TAU);g.fill();
  g.fillStyle=L.shirt;g.beginPath();g.ellipse(0,0,5.6,8.6,0,0,TAU);g.fill();g.strokeStyle=L.edge;g.lineWidth=1;g.stroke();
  // arms (typing sway when seated, carried item when holding)
  const aw=a.seat?Math.sin(t*9+a.x)*1.1:sw;
  g.fillStyle=L.skin;g.beginPath();g.ellipse(-aw*.7+(a.hold?4:0),8.4,2.6,2.6,0,0,TAU);g.fill();g.beginPath();g.ellipse(aw*.7+(a.hold?4:0),-8.4,2.6,2.6,0,0,TAU);g.fill();
  if(a.hold){
    const it=a.hold;g.save();g.translate(7.5,0);
    if(it==="cup"||it==="tea"||it==="bigcup"){g.fillStyle="#f4f1ea";g.beginPath();g.arc(0,0,3.6,0,TAU);g.fill();g.strokeStyle="#c9c2b2";g.lineWidth=.6;g.stroke();g.fillStyle="#5a2d12";g.beginPath();g.arc(0,0,2.5,0,TAU);g.fill()}
    else if(it==="flowers"){for(let i=0;i<5;i++){g.fillStyle=["#e0405a","#ff6a85","#ffb3c1"][i%3];g.beginPath();g.arc(Math.cos(i*1.3)*2.3,Math.sin(i*1.3)*2.3,2,0,TAU);g.fill()}}
    else if(it==="jasmine"){g.fillStyle="#fff";for(let i=0;i<7;i++){g.beginPath();g.arc(Math.cos(i*.9)*3.4,Math.sin(i*.9)*3.4,1.5,0,TAU);g.fill()}}
    else if(it==="gift"){g.fillStyle="#d94a6a";g.fillRect(-3,-3,6,6);g.fillStyle="#ffd166";g.fillRect(-.6,-3,1.2,6);g.fillRect(-3,-.6,6,1.2)}
    g.restore();
  }
  if(L.card){g.fillStyle="#fff";g.fillRect(1.2,-1.2,3,2.4)}
  g.fillStyle=L.skin;g.beginPath();g.arc(.5,0,4.5-bob*.3,0,TAU);g.fill();
  g.fillStyle=L.hair;g.beginPath();g.arc(-.8,0,4.7,Math.PI*.42,Math.PI*1.58);g.fill();
  if(a.helmet){g.fillStyle=a.helmet===true?"#1a1d24":a.helmet;g.beginPath();g.arc(.4,0,5.3,0,TAU);g.fill();g.fillStyle="rgba(150,200,255,.7)";g.beginPath();g.arc(1.6,0,3.9,-.8,.8);g.lineTo(.6,0);g.fill()}
  if(L.crown&&!a.helmet){g.translate(.6,0);g.fillStyle="#f2c230";g.strokeStyle="#9a6d00";g.lineWidth=.6;g.beginPath();for(let i=0;i<5;i++){const an=i/5*TAU;g.lineTo(Math.cos(an)*6.3,Math.sin(an)*6.3);g.lineTo(Math.cos(an+.628)*4.4,Math.sin(an+.628)*4.4)}g.closePath();g.fill();g.stroke();
    g.fillStyle="#d1342b";for(let i=0;i<5;i++){const an=i/5*TAU;g.beginPath();g.arc(Math.cos(an)*6.3,Math.sin(an)*6.3,.9,0,TAU);g.fill()}}
  g.restore();
  if(a.label){const lab=(L.crown?"👑 ":"")+a.name.toUpperCase();g.font="700 6.5px system-ui";const w=g.measureText(lab).width+7;
    g.fillStyle=L.crown?"#3a2a00e8":"#0f1217d0";g.beginPath();g.roundRect(a.x-w/2,a.y-18.5*k,w,9,3);g.fill();g.fillStyle=L.crown?"#ffd54a":"#cfd6df";g.textAlign="center";g.textBaseline="middle";g.fillText(lab,a.x,a.y-14*k);g.textBaseline="alphabetic"}
};
/* walk/pose update for story actors (straight-line tasks; the map scenes also use A* paths) */
S.stepPerson=function(a,dt){
  const tk=a.task;if(!tk)return;
  const dx=tk.x-a.x,dy=tk.y-a.y,d=Math.hypot(dx,dy);
  if(d<2.2){a.x=tk.x;a.y=tk.y;a.task=null;a.pose=tk.end||"stand";if(tk.face!=null)a.face=tk.face;const r=tk.res;if(r)r();return}
  const st=Math.min(d,tk.speed*dt);a.x+=dx/d*st;a.y+=dy/d*st;a.pose=tk.pose||"walk";a.ph+=st*.14;
  let da=Math.atan2(dy,dx)-a.face;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;a.face+=da*Math.min(1,dt*14);
};
S.goTo=(a,x,y,o={})=>new Promise(res=>{a.task={x,y,speed:o.speed||70,pose:o.pose||"walk",end:o.end||"stand",face:o.face,res}});
S.goPath=async(a,pts,o={})=>{for(const p of pts)await S.goTo(a,p[0],p[1],o)};

/* dialogue badge: a tiny sprite on a coloured disc (no faces) */
G.drawPortrait=function(cvs,who,expr){
  const L=LOOK[who];const g=cvs.getContext("2d");g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,208,208);
  g.fillStyle="#161a24";g.fillRect(0,0,208,208);
  const col=L?L.color:"#aab3c2";const gr=g.createRadialGradient(104,104,10,104,104,120);gr.addColorStop(0,col+"55");gr.addColorStop(1,"#10131b");g.fillStyle=gr;g.fillRect(0,0,208,208);
  if(!L)return;
  const a=S.person(who,{x:104,y:112,face:-Math.PI/2,pose:"stand"});S.drawPerson(g,a,0,8.2);
};
})();
