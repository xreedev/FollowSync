/* ================= DAD: HACK WEEK — game logic, bots, UI ================= */
(function(){
"use strict";
const $=id=>document.getElementById(id),M=window.MAP,NAV=window.NAV,AUDIO=window.AUDIO,BEAN=window.BEAN;
const cv=$("c"),ctx=window.AU_CTX,TAU=Math.PI*2,q=new URLSearchParams(location.search);
const BOTME=q.get("bot")==="1";
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[ri(0,a.length-1)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const money=n=>"₹"+Math.round(n).toLocaleString("en-IN");

/* ============ constants ============ */
const SPEED=92,KILL_RANGE=40,KILLCD=24,STEAL_T=2.2,STEAL_WIN=8,TARGET=100000,TASKS_EACH=5,SIGHT=215;
const CHARS=[
 {name:"Sreedev",color:"#f5c518",hat:"crown",line:"I make my tea black and my decisions fast. Not sus."},
 {name:"Anamika",color:"#ff7eb6",hat:"flower",line:"I will leave DAD on Oct 4. Not today though. Not sus."},
 {name:"Navya",color:"#9d6bff",hat:"phones",line:"I was hungry the whole time. Hungry people don't do crimes."},
 {name:"Safar",color:"#2f7bff",hat:"cap",line:"I saw nothing. I always see nothing. Ask Aswani."},
 {name:"Aswani",color:"#32c45a",hat:"night",line:"zzz… sorry, was I voting? Who died?"},
 {name:"Sidhu",color:"#20c7d8",hat:"band",line:"I was filming a vlog. Got four seconds of footage, zero of the crime."},
 {name:"Suda",color:"#ff8a1f",hat:"chef",line:"Whoever did this owes me for the tea."},
 {name:"Boss",color:"#d8282c",hat:"top",line:"I sign your salaries. Vote wisely."}];
const CLIENTS=["Mallu Mangoes Pvt Ltd","Chai Analytics","Beach Bytes","Kazhakkoottam Cloud","Technopark Taxi","Coconut Capital","Backwater Bank","Spice Route Software","Kovalam Logistics","Veli Ventures","Banana Chips Inc","Lighthouse Labs","Padmanabha Pharma","Sunset Systems"];
const TASKS=[
 {id:"tea",name:"Brew & serve the black tea",steps:[{x:166,y:243,room:"Pantry",g:["hold","Brew the black tea","Hold the button and release in the green zone.","HOLD"]},{x:1110,y:200,room:"Boardroom",g:["hold","Serve the tea","Pour it for the client.","POUR"]}]},
 {id:"wires",name:"Rewire the server",steps:[{x:181,y:538,room:"Server Room",g:["wires"]}]},
 {id:"invoice",name:"Send the client invoice",steps:[{x:1207,y:478,room:"Reception",g:["swipe"]}]},
 {id:"vault",name:"Memorise the vault password",steps:[{x:908,y:170,room:"CEO Room",g:["simon"]}]},
 {id:"bugs",name:"Squash the bugs",steps:[{x:337,y:285,room:"Meeting Room 1",g:["squash"]}]},
 {id:"call",name:"Take the client's call",steps:[{x:426,y:168,room:"Meeting Room 2",g:["keypad"]}]},
 {id:"router",name:"Calibrate the Wi-Fi router",steps:[{x:941,y:320,room:"HR Dept",g:["sliders"]}]},
 {id:"plants",name:"Water the balcony plants",steps:[{x:400,y:78,room:"Balcony",g:["hold","Water the plants","Hold to water. Don't flood the deck.","WATER"]}]},
 {id:"upload",name:"Upload the build",steps:[{x:542,y:352,room:"Bay 1",g:["stand","Upload the build","Stay put while it uploads.",8]}]},
 {id:"carrom",name:"Carrom practice",steps:[{x:724,y:296,room:"Carrom Corner",g:["timing"]}]},
 {id:"forms",name:"Stamp the leave forms",steps:[{x:942,y:420,room:"HR Dept",g:["order"]}]},
 {id:"nap",name:"Recharge on the sofa",steps:[{x:716,y:182,room:"Sofa Lounge",g:["stand","Recharge","Power nap. Stay put.",7]}]}];
const TBY={};for(const t of TASKS){TBY[t.id]=t;for(const s of t.steps){const p=NAV.snap(s.x,s.y);s.x=p[0];s.y=p[1]}}
const BELL=(()=>{const p=NAV.snap(1145,200);return{x:p[0],y:p[1],tx:1145,ty:176}})();
const SABDEF={
 server:{name:"Server crash",crit:true,dur:46,msg:"SERVER CRASH — reset the switch in the Server Room",col:"#e5383b",stations:[{x:150,y:520,label:"Reset the server"}]},
 fire:{name:"Pantry fire",crit:true,dur:55,msg:"PANTRY FIRE — activate BOTH extinguishers (Pantry + Balcony)",col:"#ff7a1c",stations:[{x:166,y:330,label:"Extinguisher A"},{x:1262,y:92,label:"Extinguisher B"}]},
 wifi:{name:"Wi-Fi outage",crit:false,dur:55,msg:"WI-FI DOWN — tasks are locked. Reset the router in HR",col:"#3a86ff",stations:[{x:941,y:320,label:"Reset the router"}]}};
for(const k in SABDEF)for(const s of SABDEF[k].stations){const p=NAV.snap(s.x,s.y);s.x=p[0];s.y=p[1]}
const DESKS=M.FURN.filter(f=>f.k==="desk").map((f,i)=>({id:i,x:f.x+f.w/2,y:f.y+f.h/2,w:f.w,h:f.h,dir:f.dir,stolen:false}));
const WANDER=[[700,300],[820,400],[480,420],[640,200],[1100,520],[300,420],[900,250],[600,520],[760,160],[430,300]].map(p=>NAV.snap(p[0],p[1]));
const SPAWN=NAV.snap(790,330);

function roomAt(x,y){
  for(const z of [...M.ROOMS,...M.SIDE])if(M.inR(x,y,z.r))return pretty(z.name);
  for(const z of M.OTHER)if(M.inR(x,y,z.r))return pretty(z.name);
  return"the Main Floor";
}
function pretty(n){return({"Welcome Desk / Reception":"Reception","Meeting Room 4":"the Boardroom","CEO Room":"the CEO Room","HR Department":"HR","Sofa Lounge":"the Sofa Lounge","Balcony":"the Balcony","Pantry":"the Pantry","Server Room":"the Server Room","Sick Room":"the Sick Room","Bathroom":"the Bathroom","Carrom Corner":"the Carrom Corner"})[n]||n}

/* ============ state ============ */
let S=null,modalOpen=false,mapOpen=false,sel={char:0,role:"random"};
const keys={},joy={on:false,ox:0,oy:0,x:0,y:0};
const popups=[],particles=[];
let W=0,H=0,DPR=1,last=performance.now(),flashT=0;

function resize(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR}
addEventListener("resize",resize);resize();

/* ============ new game ============ */
function newGame(meIdx,roleChoice){
  const P=CHARS.map((c,i)=>({id:i,name:c.name,color:c.color,hat:c.hat,line:c.line,x:0,y:0,dir:1,walk:0,moving:false,alive:true,hacker:false,isMe:i===meIdx,bot:i!==meIdx||BOTME,tasks:[],fake:[],killCd:0,stealCd:0,bellLeft:1,seen:{},ai:{state:"idle",wait:rnd(.2,2),scan:rnd(0,.4),path:[],stuck:0,gt:rnd(20,40)},vote:null,hat2:null}));
  let hk;const others=P.filter(p=>p.id!==meIdx);
  if(roleChoice==="hacker"){hk=[P[meIdx],pick(others)]}else if(roleChoice==="crew"){hk=shuffle(others).slice(0,2)}else hk=shuffle(P).slice(0,2);
  hk.forEach(p=>p.hacker=true);
  const crew=P.filter(p=>!p.hacker);
  for(const p of P){const ids=shuffle(TASKS).slice(0,TASKS_EACH);if(p.hacker)p.fake=ids.map(t=>({id:t.id,step:0,done:false}));else p.tasks=ids.map(t=>({id:t.id,step:0,done:false}))}
  P.forEach((p,i)=>{const a=i/P.length*TAU;const s=NAV.snap(SPAWN[0]+Math.cos(a)*34,SPAWN[1]+Math.sin(a)*26);p.x=s[0];p.y=s[1];if(p.hacker)p.killCd=ri(20,30);p.stealCd=rnd(8,20)});
  for(const d of DESKS)d.stolen=false;
  S={phase:"play",t:0,P,me:P[meIdx],bodies:[],tasksDone:0,tasksTotal:crew.length*TASKS_EACH,stolen:0,income:0,shownIncome:0,clients:[],sab:null,sabCd:26,killLog:[],meet:null,cam:{x:SPAWN[0],y:SPAWN[1]},target:null,hold:null,witness:null,over:null,meetings:0,revealed:false,stats:{kills:0}};
  M.setServer(true);popups.length=0;particles.length=0;
  for(const p of P){const cs=Math.random()<.5;p.ai.mode=cs}
}
function crewAlive(){return S.P.filter(p=>p.alive&&!p.hacker)}
function hackAlive(){return S.P.filter(p=>p.alive&&p.hacker)}
const name=p=>p.name;

/* ============ movement ============ */
function move(p,dx,dy,step){
  const nx=p.x+dx*step,ny=p.y+dy*step;
  if(p.isMe&&!p.alive){p.x=clamp(nx,M.WORLD[0]+20,M.WORLD[2]-20);p.y=clamp(ny,M.WORLD[1]+10,M.WORLD[3]-10)}
  else{if(M.free(nx,p.y))p.x=nx;if(M.free(p.x,ny))p.y=ny}
  if(Math.abs(dx)>.05)p.dir=dx>0?1:-1;
}
function los(a,b){return NAV.los(a.x,a.y-6,b.x,b.y-6)}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}

/* ============ tasks ============ */
function curStep(t){return TBY[t.id].steps[t.step]}
function completeStep(p,t){
  t.step++;const def=TBY[t.id];
  if(t.step>=def.steps.length){t.done=true;S.tasksDone++;clientWon(p,def)}
  if(p.isMe){AUDIO.sfx("done");renderTasks()}
}
function clientWon(p,def){
  const each=TARGET/S.tasksTotal,cname=CLIENTS[S.clients.length%CLIENTS.length];S.clients.push(cname);S.income+=each;
  const st=def.steps[def.steps.length-1];
  popups.push({x:st.x,y:st.y-26,t:0,text:"+"+money(each),sub:"New client: "+cname});
  for(let i=0;i<8;i++)particles.push({x:st.x,y:st.y-10,vx:rnd(-40,40),vy:rnd(-90,-30),life:1.1,t:0,c:"#ffd166"});
  const tk=$("ticker");tk.textContent="🤝 "+cname+" signed up!  "+money(each)+" in the bank";clearTimeout(tk._t);tk._t=setTimeout(()=>tk.textContent="",4000);
  if(!BOTME&&S.me.alive||true)AUDIO.sfx("coin");
}

/* ============ AI: bots ============ */
function goTo(p,x,y,kind,extra){const a=p.ai;a.kind=kind;a.gx=x;a.gy=y;a.extra=extra;a.path=NAV.path(p.x,p.y,x,y)||[];a.state="walk";a.stuck=0}
function aiThink(p){
  const a=p.ai;
  if(a.mission){goTo(p,a.mission.x,a.mission.y,"mission");return}
  if(p.hacker)return hackerThink(p);
  const t=p.tasks.find(t=>!t.done);
  if(t){const st=curStep(t);goTo(p,st.x,st.y,"task",{task:t});return}
  const r=pick(WANDER);goTo(p,r[0],r[1],"wander");
}
function witnessesAt(x,y,exclude){
  return S.P.filter(o=>o.alive&&!o.hacker&&o!==exclude&&Math.hypot(o.x-x,o.y-y)<SIGHT&&NAV.los(o.x,o.y-6,x,y-6));
}
function hackerThink(p){
  const a=p.ai,crew=crewAlive();
  if(p.killCd<=0&&crew.length&&Math.random()<.7){
    const cands=crew.filter(c=>!(c.isMe&&!c.bot&&false)).sort((u,v)=>dist(p,u)-dist(p,v));
    const tg=cands[0];if(tg){a.state="hunt";a.target=tg.id;a.huntT=rnd(10,16);a.rep=0;a.path=[];return}
  }
  if(p.stealCd<=0&&Math.random()<.75){
    const ds=DESKS.filter(d=>!d.stolen&&!witnessesAt(d.x,d.y,p).length).sort((u,v)=>Math.hypot(u.x-p.x,u.y-p.y)-Math.hypot(v.x-p.x,v.y-p.y)).slice(0,6);
    if(ds.length){const d=pick(ds);goTo(p,d.x,d.y,"steal",{desk:d});return}
  }
  if(!S.sab&&S.sabCd<=0&&Math.random()<.3&&hackAlive()[0]===p){triggerSab(pick(["server","fire","wifi","server","fire"]),p);}
  const f=p.fake.find(t=>!t.done);
  if(f){const st=curStep(f);goTo(p,st.x,st.y,"fake",{task:f});return}
  const r=pick(WANDER);goTo(p,r[0],r[1],"wander");
}
function followPath(p,dt){
  const a=p.ai;if(!a.path||!a.path.length)return true;
  const [tx,ty]=a.path[0],d=Math.hypot(tx-p.x,ty-p.y);
  if(d<3){a.path.shift();return!a.path.length}
  const ox=p.x,oy=p.y;move(p,(tx-p.x)/d,(ty-p.y)/d,SPEED*dt*(S.sab&&S.sab.type==="coffee"?.6:1));p.walk+=dt*13;p.moving=true;
  if(Math.hypot(p.x-ox,p.y-oy)<SPEED*dt*.25){a.stuck+=dt;if(a.stuck>.5){a.path=NAV.path(p.x,p.y,a.gx!=null?a.gx:tx,a.gy!=null?a.gy:ty)||[];a.stuck=0}}else a.stuck=0;
  return false;
}
function aiScan(p){
  for(const o of S.P){if(o===p||!o.alive)continue;const d=dist(p,o);if(d<SIGHT&&los(p,o)){p.seen[o.id]={t:S.t,room:roomAt(o.x,o.y)}}}
  if(!p.hacker||Math.random()<.2){
    for(const b of S.bodies){if(b.reported)continue;if(Math.hypot(p.x-b.x,p.y-b.y)<190&&NAV.los(p.x,p.y-6,b.x,b.y-6)){
      if(p.hacker)break;if(!p.ai.reportT&&Math.random()<.92){p.ai.reportT=rnd(.5,1.6);p.ai.reportInfo={type:"body",body:b}}}}
  }
}
function aiUpdate(p,dt){
  const a=p.ai;p.moving=false;
  if(!p.alive){a.gt-=dt;if(a.gt<=0&&!p.hacker){const t=p.tasks.find(t=>!t.done);if(t&&!(S.sab&&S.sab.type==="wifi"))completeStep(p,t);a.gt=rnd(22,40)}return}
  if(a.reportT>0){a.reportT-=dt;if(a.reportT<=0){a.reportT=0;callMeeting(p,a.reportInfo);return}}
  a.scan-=dt;if(a.scan<=0){a.scan=.45;aiScan(p)}
  if(p.hacker){p.killCd-=dt;p.stealCd-=dt}
  switch(a.state){
    case"idle":a.wait-=dt;if(a.wait<=0)aiThink(p);break;
    case"walk":{const arr=followPath(p,dt);if(arr){p.moving=false;onArrive(p)}break}
    case"do":{
      if(a.what==="task"&&S.sab&&S.sab.type==="wifi")break;
      a.t-=dt;if(a.t<=0){
        if(a.what==="task"){completeStep(p,a.extra.task)}
        else if(a.what==="fake"){a.extra.task.done=true}
        else if(a.what==="steal"){const d=a.extra.desk;if(witnessesAt(d.x,d.y,p).length&&Math.random()<.9){p.stealCd=rnd(3,7)}else stealLaptop(p,d)}
        else if(a.what==="mission"){activateStation(p,a.mission);a.mission=null}
        a.state="idle";a.wait=rnd(.3,1.2)}
      break}
    case"hunt":{
      const tg=S.P[a.target];a.huntT-=dt;
      if(!tg||!tg.alive||a.huntT<=0){a.state="idle";a.wait=1;break}
      a.rep-=dt;if(a.rep<=0||!a.path.length){a.rep=.7;a.path=NAV.path(p.x,p.y,tg.x,tg.y)||[];a.gx=tg.x;a.gy=tg.y}
      const d=dist(p,tg);
      if(d<KILL_RANGE-6&&p.killCd<=0){
        const wit=witnessesAt(tg.x,tg.y,tg).filter(w=>w!==tg);
        if(wit.length===0||Math.random()<.04){killPlayer(p,tg);break}
      }
      if(d>30)followPath(p,dt);else p.moving=false;
      break}
    case"flee":{const arr=followPath(p,dt);if(arr){a.state="idle";a.wait=rnd(1,3)}break}
  }
}
function onArrive(p){
  const a=p.ai;
  switch(a.kind){
    case"task":a.state="do";a.what="task";a.t=rnd(11,19);break;
    case"fake":a.state="do";a.what="fake";a.t=rnd(6,10);break;
    case"steal":a.state="do";a.what="steal";a.t=STEAL_T;break;
    case"mission":a.state="do";a.what="mission";a.t=1.1;break;
    default:a.state="idle";a.wait=rnd(1.5,4);
  }
}

/* ============ hacker actions ============ */
function killPlayer(k,v){
  if(!k.alive||!v.alive||S.phase!=="play")return;
  const wit=witnessesAt(v.x,v.y,v);
  v.alive=false;const body={id:v.id,x:v.x,y:v.y,color:v.color,name:v.name,room:roomAt(v.x,v.y),t:S.t,reported:false,killer:k.id};S.bodies.push(body);
  k.x=v.x+(k.x<v.x?-14:14);k.y=v.y;k.killCd=KILLCD;S.stats.kills++;
  S.killLog.push({t:S.t,killer:k.name,victim:v.name,room:body.room});
  AUDIO.sfx("kill");S.shake=.45;
  for(let i=0;i<10;i++)particles.push({x:v.x,y:v.y-12,vx:rnd(-70,70),vy:rnd(-80,-10),life:.8,t:0,c:"#e5383b"});
  for(const w of wit){
    if(w.isMe&&!w.bot){S.witness={suspect:k.id,room:body.room,t:S.t,type:"kill",body};toast("You saw "+k.name+" log "+v.name+" out! Press REPORT.");AUDIO.sfx("report")}
    else if(w.bot&&!w.ai.reportT){w.ai.reportT=rnd(.5,1.4);w.ai.reportInfo={type:"witness",suspect:k.id,body,wid:w.id};w.ai.knows={...(w.ai.knows||{}),[k.id]:"kill"}}
  }
  if(v.isMe&&!v.bot){showKilled(k)}
  if(k.bot&&!wit.length&&Math.random()<.2&&crewAlive().length>2){k.ai.reportT=rnd(.9,1.6);k.ai.reportInfo={type:"body",body,self:true}}
  if(k.bot){k.ai.state="flee";const r=pick(WANDER);k.ai.gx=r[0];k.ai.gy=r[1];k.ai.path=NAV.path(k.x,k.y,r[0],r[1])||[]}
  checkWin();
}
function stealLaptop(p,d){
  if(d.stolen)return;
  const wit=witnessesAt(d.x,d.y,p);
  d.stolen=true;S.stolen++;p.stealCd=rnd(9,17);AUDIO.sfx("steal");
  popups.push({x:d.x,y:d.y-16,t:0,text:"💻 STOLEN",sub:"",bad:true});
  for(const w of wit){
    if(w.isMe&&!w.bot){S.witness={suspect:p.id,room:roomAt(d.x,d.y),t:S.t,type:"steal"};toast("You saw "+p.name+" steal a laptop! Press REPORT.");AUDIO.sfx("report")}
    else if(w.bot&&!w.ai.reportT){w.ai.reportT=rnd(.5,1.3);w.ai.reportInfo={type:"steal",suspect:p.id,room:roomAt(d.x,d.y),wid:w.id};w.ai.knows={...(w.ai.knows||{}),[p.id]:"steal"}}
  }
  checkWin();
}
function triggerSab(type,by){
  if(S.sab)return;const def=SABDEF[type];
  S.sab={type,t:def.dur,def,stations:def.stations.map(s=>({...s,on:0})),by:by?by.id:null};
  if(type==="server")M.setServer(false);
  AUDIO.sfx("siren");S.sabCd=34;showBanner();
  // nearest crew bots rush to each station
  const used=new Set();
  for(const st of S.sab.stations){
    const c=S.P.filter(p=>p.alive&&!p.hacker&&p.bot&&!used.has(p.id)).sort((u,v)=>Math.hypot(u.x-st.x,u.y-st.y)-Math.hypot(v.x-st.x,v.y-st.y))[0];
    if(c){used.add(c.id);c.ai.mission=st;goTo(c,st.x,st.y,"mission")}
  }
}
function activateStation(p,st){
  if(!S.sab)return;
  if(S.sab.type==="fire"){st.on=22;AUDIO.sfx("fix");if(S.sab.stations.every(s=>s.on>0)){endSab(true)}}
  else{endSab(true)}
}
function endSab(fixed){
  if(!S.sab)return;const sb=S.sab;S.sab=null;S.sabCd=38;M.setServer(true);
  for(const p of S.P)p.ai.mission=null;
  if(fixed){AUDIO.sfx("fix");toast("✅ "+sb.def.name+" fixed!")}
  showBanner();
}
function showBanner(){const b=$("banner");if(S.sab){b.className="on";b.style.background=S.sab.def.col;b.textContent=S.sab.def.msg+(S.sab.def.crit?"  ·  "+Math.ceil(S.sab.t)+"s":"")}else{b.className="";b.textContent=""}}

/* ============ win / lose ============ */
function checkWin(){
  if(!S||S.phase==="over")return;
  const ca=crewAlive().length,ha=hackAlive().length;
  if(S.tasksDone>=S.tasksTotal)return end("crew","Revenue target reached! DAD survives the week.");
  if(ha===0)return end("crew","Every hacker has been locked out of the building.");
  if(ha>=ca)return end("hackers","The crew is outnumbered. DAD belongs to the hackers.");
  if(S.stolen>=STEAL_WIN)return end("hackers","Eight laptops stolen. DAD cannot ship a single line of code.");
}
function end(winner,why){
  if(S.phase==="over")return;S.over={winner,why};S.phase="over";modalOpen=false;$("tm").classList.remove("on");$("tm").innerHTML="";$("meet").classList.remove("on");
  M.setServer(true);if(S.sab)S.sab=null;showBanner();
  setTimeout(showOver,BOTME?0:900);
}

/* ============ meeting ============ */
function callMeeting(reporter,info){
  if(!S||S.phase!=="play")return;
  S.phase="meeting";modalOpen=false;$("tm").classList.remove("on");$("tm").innerHTML="";mapOpen=false;$("mapov").classList.remove("on");
  AUDIO.sfx(info.type==="button"?"meeting":"report");S.meetings++;
  const body=info.body||null;if(body)body.reported=true;
  const near=body?S.P.filter(p=>p.alive&&p.id!==body.id&&Math.hypot(p.x-body.x,p.y-body.y)<170).map(p=>p.id):[];
  const M_={reporter,info,t:0,chat:[],queue:[],acc:{},votes:{},ended:false,phase:"talk",near,tally:null,ejected:undefined,after:0,botVoteAt:{}};
  S.meet=M_;
  // accusations from knowledge
  M_.acc={};
  // schedule bot lines
  const alive=S.P.filter(p=>p.alive);let t=1.6;
  const order=shuffle(alive.filter(p=>p.bot));
  addChat(null,info.type==="body"?`📣 ${reporter.name} found ${body.name}'s body in ${body.room}.`:info.type==="witness"?`📣 ${reporter.name} saw something in ${body.room}!`:info.type==="steal"?`📣 ${reporter.name} caught a laptop theft in ${info.room}!`:`🔔 ${reporter.name} rang the All-Hands Bell.`,true);
  if(reporter.bot)M_.queue.push({t:.9,bot:reporter,kind:"report"});
  for(const b of order){if(b===reporter)continue;M_.queue.push({t:t+=rnd(1.1,2.1),bot:b,kind:b.ai.knows&&Object.keys(b.ai.knows).length&&!b.hacker?"witness":"statement"})}
  for(const b of shuffle(order).slice(0,4)){M_.queue.push({t:rnd(14,22),bot:b,kind:"followup"})}
  for(const b of shuffle(order).slice(0,3)){if(Math.random()<.5)M_.queue.push({t:rnd(5,16),bot:b,kind:"flavor"})}
  M_.queue.sort((a,b)=>a.t-b.t);
  for(const b of order)M_.botVoteAt[b.id]=rnd(10,34);
  buildMeetingUI();
}
function chatFor(b,kind){
  const M_=S.meet,info=M_.info,body=info.body;
  const alive=S.P.filter(p=>p.alive&&p!==b);
  const nameOf=p=>p.name;
  const recent=Object.entries(b.seen).filter(([id,s])=>S.t-s.t<50&&S.P[id].alive).map(([id,s])=>({p:S.P[id],s}));
  const lastTask=(()=>{const arr=(b.hacker?b.fake:b.tasks);const done=arr.filter(t=>t.done).pop()||arr.find(t=>!t.done);return done?TBY[done.id]:null})();
  const where=lastTask?`${lastTask.name.toLowerCase()} in ${pretty(lastTask.steps[0].room)}`:"wandering around";
  const known=b.ai.knows?Object.keys(b.ai.knows).map(Number)[0]:undefined;
  if(kind==="report"){
    if(info.type==="body")return info.self?`I found ${body.name} in ${body.room}. Who was near?`:`I found ${body.name} in ${body.room}. Looks like a log-out.`;
    if(info.type==="witness"){const k=S.P[info.suspect];accuse(k.id,4,b);return`It was ${k.name}! I SAW them log ${body.name} out in ${body.room}!`}
    if(info.type==="steal"){const k=S.P[info.suspect];accuse(k.id,3.5,b);return`I saw ${k.name} stealing a laptop in ${info.room}!`}
    return`Emergency! Did anyone see anything?`}
  if(b.hacker){
    const partner=S.P.find(p=>p.hacker&&p!==b);
    const crewTargets=alive.filter(p=>!p.hacker);
    if(kind==="witness"||kind==="statement"){
      if(Math.random()<.45&&crewTargets.length){const t=pick(crewTargets);accuse(t.id,1.4,b);return pick([`I saw ${t.name} near the body in ${body?body.room:"the Pit"}.`,`${t.name} was acting weird around ${pick(["the server","the pantry","the laptops"])}.`,`${t.name} didn't do a single task. Check them.`])}
      return`I was doing ${where}. Ask anyone.`}
    if(kind==="followup"){
      const heat=Object.entries(M_.acc).sort((u,v)=>v[1]-u[1])[0];
      if(heat&&+heat[0]===b.id)return`Me?! I was in ${pretty(lastTask?lastTask.steps[0].room:"HR")}. That's a lie!`;
      if(heat&&partner&&+heat[0]===partner.id&&Math.random()<.5)return`${partner.name}? No way. I was with them. Look elsewhere.`;
      if(crewTargets.length){const t=pick(crewTargets);accuse(t.id,1,b);return`I'm still saying ${t.name}.`}return`Skip. Not enough info.`}
  }else{
    if(kind==="witness"&&known!==undefined&&S.P[known]){const k=S.P[known];accuse(k.id,4,b);return pick([`${k.name}! I saw you ${b.ai.knows[known]==="steal"?"take a laptop":"do it"}!`,`It's ${k.name}. I saw it with my own eyes.`])}
    if(kind==="statement"){
      const near=recent.filter(r=>body&&r.s.room===body.room);
      if(near.length&&Math.random()<.7){const r=pick(near);accuse(r.p.id,1.6,b);return`I saw ${r.p.name} in ${r.s.room} not long ago.`}
      if(recent.length&&Math.random()<.5){const r=pick(recent);return`I saw ${r.p.name} in ${r.s.room} doing tasks. Looked normal.`}
      return`I was doing ${where}. Nothing weird.`}
    if(kind==="followup"){
      const heat=Object.entries(M_.acc).sort((u,v)=>v[1]-u[1])[0];
      if(heat&&+heat[0]===b.id)return`That's not true! I was in ${pretty(lastTask?lastTask.steps[0].room:"HR")}, check the tasks!`;
      if(heat&&heat[1]>=3&&S.P[+heat[0]])return`${S.P[+heat[0]].name} is looking really sus. I'm voting them.`;
      return pick([`No evidence. I say skip.`,`Anyone see where ${body?body.name:"everyone"} went?`,`Let's not rush this.`])}
  }
  if(kind==="flavor")return b.line;
  return`Hmm.`;
}
function accuse(id,w,by){const M_=S.meet;M_.acc[id]=(M_.acc[id]||0)+w;if(by&&by.hacker!==undefined)M_.accBy=M_.accBy||{};}
function addChat(p,text,sys){
  const M_=S.meet;M_.chat.push({p,text,sys});
  const box=$("chat");if(!box)return;const d=document.createElement("div");d.className="msg"+(sys?" sys":"")+(p&&p.isMe?" me":"");
  if(p){const c=document.createElement("canvas");c.width=c.height=60;beanIcon(c,p.color,p.hat,!p.alive);d.appendChild(c);const inner=document.createElement("div");inner.innerHTML=`<b>${p.name}</b>`;inner.appendChild(document.createTextNode(text));d.appendChild(inner)}
  else d.textContent=text;
  box.appendChild(d);box.scrollTop=box.scrollHeight;AUDIO.sfx("click");
}
function botVote(b){
  const M_=S.meet,alive=S.P.filter(p=>p.alive&&p!==b),info=M_.info;
  const score={};for(const o of alive)score[o.id]=0;
  if(!b.hacker){
    if(b.ai.knows)for(const id in b.ai.knows)if(score[id]!==undefined)score[id]+=100;
    for(const id in M_.acc)if(score[id]!==undefined)score[id]+=M_.acc[id]*.8;
    for(const id of M_.near)if(score[id]!==undefined)score[id]+=1.0;
    for(const [id,s] of Object.entries(b.seen))if(score[id]!==undefined&&info.body&&s.room===info.body.room&&S.t-s.t<50)score[id]+=1.1;
    for(const id in score)score[id]+=rnd(0,1.3);
    const best=Object.entries(score).sort((u,v)=>v[1]-u[1])[0];
    if(!best||best[1]<2.2)return Math.random()<.7?"skip":+best[0];
    return+best[0];
  }else{
    const partner=S.P.find(p=>p.hacker&&p!==b);
    for(const o of alive){if(o.hacker){score[o.id]=-50;continue}score[o.id]=(M_.acc[o.id]||0)+rnd(0,1.6)+(M_.near.includes(o.id)?1:0)}
    if(partner&&M_.acc[partner.id]>=4&&Math.random()<.35)return"skip";
    const best=Object.entries(score).sort((u,v)=>v[1]-u[1])[0];return best&&best[1]>-10?+best[0]:"skip";
  }
}
function meetingUpdate(dt){
  const M_=S.meet;if(!M_)return;
  M_.t+=dt;
  if(M_.phase==="talk"){
    while(M_.queue.length&&M_.queue[0].t<=M_.t){const it=M_.queue.shift();if(!it.bot.alive)continue;
      const txt=chatFor(it.bot,it.kind);if(txt)addChat(it.bot,txt)}
    for(const b of S.P){if(!b.alive||!b.bot||b.vote!==null&&b.vote!==undefined)continue;
      const at=M_.botVoteAt[b.id]!==undefined?M_.botVoteAt[b.id]:20;if(M_.t>=at){b.vote=botVote(b);M_.votes[b.id]=b.vote;AUDIO.sfx("vote");updateMeetingUI()}}
    const alive=S.P.filter(p=>p.alive);
    if(alive.every(p=>p.vote!==null&&p.vote!==undefined)||M_.t>48){
      for(const p of alive){if(p.vote===null||p.vote===undefined){p.vote="skip";M_.votes[p.id]="skip"}}
      M_.phase="tally";M_.after=0;tally();updateMeetingUI()}
  }else if(M_.phase==="tally"){
    M_.after+=dt;if(M_.after>(BOTME?.2:3.6)){M_.phase="eject";startEject()}
  }else if(M_.phase==="eject"){
    if(M_.ejDone){endMeeting()}
  }
  const tm=$("mtime");if(tm&&M_.phase==="talk")tm.textContent="Voting ends in "+Math.max(0,Math.ceil(48-M_.t))+"s";
}
function tally(){
  const M_=S.meet,c={};let skip=0;
  for(const id in M_.votes){const v=M_.votes[id];if(v==="skip")skip++;else c[v]=(c[v]||0)+1}
  M_.counts=c;M_.skips=skip;
  const sorted=Object.entries(c).sort((u,v)=>v[1]-u[1]);
  if(sorted.length&&sorted[0][1]>skip&&(sorted.length<2||sorted[0][1]>sorted[1][1]))M_.ejected=+sorted[0][0];else M_.ejected=null;
}
function startEject(){
  const M_=S.meet;$("meet").classList.remove("on");
  const ej=M_.ejected!==null?S.P[M_.ejected]:null;
  if(ej){ej.alive=false;ej.ejected=true}
  const hk=hackAlive().length;
  const l1=ej?`${ej.name} was locked out of the building.`:"No one was locked out. (Tie or skip)";
  const l2=ej?`${ej.name} ${ej.hacker?"WAS a Hacker.":"was NOT a Hacker."}`:"";
  const l3=ej?`${hk} Hacker${hk===1?"":"s"} remain${hk===1?"s":""}.`:"";
  if(BOTME){M_.ejDone=true;return}
  setTimeout(()=>{if(S&&S.meet===M_)M_.ejDone=true},7000);
  AUDIO.sfx("eject");const ec=$("ejc");$("eject").classList.add("on");ec.width=W*DPR;ec.height=H*DPR;const g=ec.getContext("2d");
  const t0=performance.now();const txt=$("ejtxt");txt.innerHTML="";
  const stars=Array.from({length:120},()=>({x:Math.random(),y:Math.random(),s:rnd(.5,2.4),v:rnd(.02,.12)}));
  (function frame(){
    const t=(performance.now()-t0)/1000;g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle="#04040c";g.fillRect(0,0,W,H);
    g.fillStyle="#fff";for(const s of stars){const x=((s.x*W-t*s.v*W*1.2)%W+W)%W;g.fillRect(x,s.y*H,s.s,s.s)}
    // the building exit: a door glow on the left
    if(ej){const x=-100+t/4.2*(W+200),y=H*.45+Math.sin(t*2)*18;g.save();g.translate(x,y);g.rotate(t*5);BEAN.bean(g,0,40,ej.color,1,0,ej.hat,{scale:2.2});g.restore()}
    const full=l1+(l2?"\n"+l2:"")+(l3?"\n"+l3:"");const n=Math.min(full.length,Math.floor(t*28));
    txt.style.whiteSpace="pre-line";txt.textContent=full.slice(0,n);
    if(t<5.2)requestAnimationFrame(frame);else{$("eject").classList.remove("on");M_.ejDone=true}
  })();
}
function endMeeting(){
  const M_=S.meet;S.meet=null;$("meet").classList.remove("on");
  S.bodies=S.bodies.filter(b=>false);S.phase="play";S.witness=null;
  for(const p of S.P){p.vote=null;p.ai.state="idle";p.ai.wait=rnd(.5,2.5);p.ai.path=[];p.ai.reportT=0;p.ai.knows=null;p.ai.mission=S.sab?p.ai.mission:null;if(p.hacker)p.killCd=Math.max(p.killCd,14)}
  // reposition everyone to the meeting spot
  S.P.forEach((p,i)=>{const a=i/S.P.length*TAU;const s=NAV.snap(SPAWN[0]+Math.cos(a)*34,SPAWN[1]+Math.sin(a)*26);p.x=s[0];p.y=s[1]});
  if(S.sab&&S.sab.type!=="wifi")for(const p of S.P){if(p.alive&&!p.hacker&&p.bot){const st=S.sab.stations[0];}}
  if(S.sab){const used=new Set();for(const st of S.sab.stations){const c=S.P.filter(p=>p.alive&&!p.hacker&&p.bot&&!used.has(p.id)).sort((u,v)=>Math.hypot(u.x-st.x,u.y-st.y)-Math.hypot(v.x-st.x,v.y-st.y))[0];if(c){used.add(c.id);c.ai.mission=st;goTo(c,st.x,st.y,"mission")}}}
  checkWin();
  if(S.phase==="play"&&S.me&&!S.me.alive&&!S.me.isGhostNote&&!BOTME){S.me.isGhostNote=1;toast("You're a ghost now. Finish your tasks to help the crew!")}
  renderTasks();
}

/* ---- meeting UI ---- */
function buildMeetingUI(){
  if(BOTME){return}
  const el=$("meet"),M_=S.meet;el.classList.add("on");
  el.innerHTML=`<div class="wrap"><h2>ALL-HANDS MEETING</h2><div class="why" id="mwhy"></div><div class="mtime" id="mtime"></div>
    <div class="grid"><div><div class="plist" id="plist"></div><div class="vbtns"><button class="vbtn" id="vVote" disabled>VOTE</button><button class="vbtn sk" id="vSkip">SKIP VOTE</button></div><div class="quick" id="quick"></div></div>
    <div><div class="chat" id="chat"></div></div></div></div>`;
  const why=M_.info.type==="body"?`Body found in ${M_.info.body.room}`:M_.info.type==="witness"?"A witness saw a kill":M_.info.type==="steal"?"A laptop was stolen":"Emergency bell";
  $("mwhy").textContent=why;
  const pl=$("plist");pl.innerHTML="";
  for(const p of S.P){
    const c=document.createElement("div");c.className="pc"+(p.alive?"":" dead")+(p.isMe?" me":"");c.dataset.id=p.id;
    const cv2=document.createElement("canvas");cv2.width=cv2.height=80;beanIcon(cv2,p.color,p.hat,!p.alive);c.appendChild(cv2);
    const nm=document.createElement("span");nm.textContent=p.name+(p.isMe?" (you)":"");if(S.me.hacker&&p.hacker)nm.style.color="#c1171b";c.appendChild(nm);
    const vt=document.createElement("div");vt.className="vt";c.appendChild(vt);const vd=document.createElement("div");vd.className="voted";c.appendChild(vd);
    c.onclick=()=>{if(!S.me.alive||S.me.vote!==null&&S.me.vote!==undefined||M_.phase!=="talk"||!p.alive)return;M_.sel=p.id;[...pl.children].forEach(x=>x.classList.toggle("sel",+x.dataset.id===p.id));$("vVote").disabled=false;AUDIO.sfx("click");buildQuick()};
    pl.appendChild(c)}
  $("vVote").onclick=()=>{if(M_.sel===undefined||!S.me.alive||(S.me.vote!==null&&S.me.vote!==undefined))return;castMe(M_.sel)};
  $("vSkip").onclick=()=>{if(!S.me.alive||(S.me.vote!==null&&S.me.vote!==undefined))return;castMe("skip")};
  // replay chat
  const box=$("chat");box.innerHTML="";const old=M_.chat;M_.chat=[];for(const m of old)addChat(m.p,m.text,m.sys);
  buildQuick();updateMeetingUI();
}
function castMe(v){const M_=S.meet;S.me.vote=v;M_.votes[S.me.id]=v;AUDIO.sfx("vote");$("vVote").disabled=true;$("vSkip").disabled=true;updateMeetingUI()}
function buildQuick(){
  const M_=S.meet,box=$("quick");if(!box||!S.me.alive){if(box)box.innerHTML="<i style='color:#9aa1c4'>Ghosts can't talk or vote.</i>";return}
  const sp=M_.sel!==undefined?S.P[M_.sel]:null;
  const opts=[["Where was the body?",()=>{addChat(S.me,"Where was the body found?");const r=M_.reporter;if(r.bot&&M_.info.body)setTimeout(()=>S.meet&&addChat(r,`${M_.info.body.name} was in ${M_.info.body.room}.`),900)}],
   ["I was doing my tasks",()=>{const t=(S.me.hacker?S.me.fake:S.me.tasks).find(t=>t.done)||(S.me.hacker?S.me.fake:S.me.tasks)[0];addChat(S.me,`I was ${TBY[t.id].name.toLowerCase()} in ${pretty(TBY[t.id].steps[0].room)}.`)}],
   [sp?`${sp.name} is sus!`:"Pick someone, then accuse",()=>{if(!sp)return;addChat(S.me,`${sp.name} is sus!`);accuse(sp.id,1.6,S.me);if(sp.bot&&sp.alive&&!sp.isMe)setTimeout(()=>{if(S.meet&&sp.alive){addChat(sp,sp.hacker?pick([`Me? That's a lie, ${S.me.name}.`,`${S.me.name} is trying to frame me!`]):pick([`Wait, me?! I was just doing my tasks!`,`${S.me.name}, that's not fair!`]));if(sp.hacker)accuse(S.me.id,.8,sp)}},1100)}],
   [sp?`${sp.name} is NOT sus`:"…",()=>{if(!sp)return;addChat(S.me,`I trust ${sp.name}.`);M_.acc[sp.id]=Math.max(0,(M_.acc[sp.id]||0)-1.2)}],
   ["Let's skip",()=>{addChat(S.me,"Not enough info. Let's skip.")}]];
  box.innerHTML="";opts.forEach(([t,f])=>{const b=document.createElement("button");b.textContent=t;b.onclick=()=>{if(M_.phase==="talk")f()};box.appendChild(b)});
}
function updateMeetingUI(){
  const M_=S.meet;if(!M_||BOTME)return;const pl=$("plist");if(!pl)return;
  for(const c of pl.children){const p=S.P[+c.dataset.id];const vt=c.querySelector(".vt"),vd=c.querySelector(".voted");vt.innerHTML="";
    const hasVoted=p.vote!==null&&p.vote!==undefined;vd.textContent=(M_.phase==="talk"&&hasVoted&&p.alive)?"✔ voted":"";
    if(M_.phase!=="talk"){for(const id in M_.votes){if(M_.votes[id]===p.id){const d=document.createElement("i");d.style.background=S.P[id].color;vt.appendChild(d)}}}}
  if(M_.phase!=="talk"){const sk=Object.values(M_.votes).filter(v=>v==="skip").length;$("mtime").textContent=sk?`${sk} skipped`:""}
}

/* ============ rendering ============ */
function fogRadius(){
  if(!S.me.alive)return 9999;
  if(S.sab&&S.sab.type==="server"&&!S.me.hacker)return 85;
  return S.me.hacker?290:215;
}
function visibleTo(o){
  const me=S.me;if(o===me)return true;if(!me.alive)return o.alive||!!o.ghostVis;
  if(!o.alive)return false;
  const d=dist(me,o);if(d>fogRadius()+10)return false;return NAV.los(me.x,me.y-6,o.x,o.y-6);
}
function render(){
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle="#04050b";ctx.fillRect(0,0,W,H);
  if(!S||S.phase==="title")return;
  const me=S.me;let z=clamp(Math.min(W/440,H/300),1.8,3.2),cx=S.cam.x,cy=S.cam.y;
  if(mapOpen){z=Math.min(W/1260,H/640)*.96;cx=(M.WORLD[0]+M.WORLD[2])/2;cy=(M.WORLD[1]+M.WORLD[3])/2}
  ctx.save();if(S.shake>0&&!mapOpen)ctx.translate(rnd(-5,5)*S.shake,rnd(-5,5)*S.shake);
  ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-cx,-cy);
  const t=S.t;
  M.drawWorld(performance.now());
  drawLaptops();drawStations(t);drawBell(t);drawBodies();drawSabFx(t);
  if(!mapOpen){
    const list=S.P.filter(p=>(p.alive||(p.isMe&&!p.alive))&&visibleTo(p)).sort((a,b)=>a.y-b.y);
    for(const p of list)drawPlayer(p,t);
  }else drawPlayer(me,t);
  for(const pt of particles){ctx.globalAlpha=Math.max(0,1-pt.t/pt.life);ctx.fillStyle=pt.c;ctx.fillRect(pt.x,pt.y,2.4,2.4);ctx.globalAlpha=1}
  for(const p of popups){const a=Math.max(0,1-p.t/2.2);ctx.globalAlpha=a;ctx.textAlign="center";ctx.font="700 11px system-ui";ctx.lineWidth=3;ctx.strokeStyle="#000";ctx.strokeText(p.text,p.x,p.y-p.t*14);ctx.fillStyle=p.bad?"#ff6b6e":"#ffd166";ctx.fillText(p.text,p.x,p.y-p.t*14);if(p.sub){ctx.font="600 7px system-ui";ctx.strokeText(p.sub,p.x,p.y-p.t*14+9);ctx.fillStyle="#fff";ctx.fillText(p.sub,p.x,p.y-p.t*14+9)}ctx.globalAlpha=1}
  if(mapOpen)drawMapPins();
  ctx.restore();
  if(!mapOpen&&me.alive)drawFog(z,cx,cy);
  // sabotage tints
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(S.sab){const sb=S.sab,pu=.5+.5*Math.sin(performance.now()/180);
    if(sb.type==="server"){ctx.fillStyle=`rgba(229,56,59,${.12+.14*pu})`;ctx.fillRect(0,0,W,H)}
    else if(sb.type==="fire"){ctx.fillStyle=`rgba(255,120,20,${.08+.1*pu})`;ctx.fillRect(0,0,W,H)}
    else{ctx.fillStyle=`rgba(58,134,255,${.05+.05*pu})`;ctx.fillRect(0,0,W,H)}}
  const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.5)");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
}
function drawFog(z,cx,cy){
  const me=S.me,R=fogRadius(),n=150;ctx.setTransform(DPR,0,0,DPR,0,0);
  const sx=wx=>W/2+(wx-cx)*z,sy=wy=>H/2+(wy-cy)*z;
  ctx.beginPath();ctx.rect(0,0,W,H);
  for(let i=0;i<=n;i++){const a=i/n*TAU,d=NAV.rayDist(me.x,me.y-6,a,R),px=sx(me.x+Math.cos(a)*d),py=sy(me.y-6+Math.sin(a)*d);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)}
  ctx.closePath();ctx.fillStyle="rgba(3,4,10,.97)";ctx.fill("evenodd");
  // soft edge inside the visible area
  ctx.save();ctx.beginPath();for(let i=0;i<=n;i++){const a=i/n*TAU,d=NAV.rayDist(me.x,me.y-6,a,R),px=sx(me.x+Math.cos(a)*d),py=sy(me.y-6+Math.sin(a)*d);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)}ctx.closePath();ctx.clip();
  const g=ctx.createRadialGradient(sx(me.x),sy(me.y-6),R*z*.55,sx(me.x),sy(me.y-6),R*z);g.addColorStop(0,"rgba(3,4,10,0)");g.addColorStop(1,"rgba(3,4,10,.9)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
}
function drawPlayer(p,t){
  const ghost=!p.alive;
  BEAN.bean(ctx,p.x,p.y+8,p.color,p.dir,p.moving?p.walk:Math.sin(t*2+p.id)*.15,p.hat,{alpha:ghost?.45:1,scale:.5});
  ctx.textAlign="center";ctx.font="700 7.5px system-ui";ctx.lineWidth=2.2;ctx.strokeStyle="#000";
  const col=(S.me.hacker&&p.hacker)?"#ff4d4f":"#fff";
  ctx.strokeText(p.name,p.x,p.y-28);ctx.fillStyle=col;ctx.fillText(p.name,p.x,p.y-28);
  if(p.doing){}
}
function drawBodies(){for(const b of S.bodies){if(!mapOpen&&S.me.alive){const d=Math.hypot(S.me.x-b.x,S.me.y-b.y);if(d>fogRadius()||!NAV.los(S.me.x,S.me.y-6,b.x,b.y-6))continue}
  BEAN.bean(ctx,b.x,b.y+8,b.color,1,0,null,{dead:true,scale:.5});ctx.fillStyle="#fff";ctx.font="600 6px system-ui";ctx.textAlign="center";ctx.fillText("logged out",b.x,b.y-14)}}
function drawLaptops(){for(const d of DESKS){ctx.save();ctx.translate(d.x,d.y);
  if(d.stolen){ctx.strokeStyle="rgba(255,255,255,.2)";ctx.lineWidth=.8;ctx.strokeRect(-5,-3.5,10,7)}
  else{ctx.fillStyle="#2a2d36";ctx.fillRect(-5.5,-3,11,7);ctx.fillStyle="#9fe6ff";ctx.fillRect(-4.8,-6,9.6,4.6);ctx.fillStyle="#2c6f8f";ctx.fillRect(-3,-5,5,1);ctx.fillRect(-3,-3.5,3,1)}
  ctx.restore()}}
function drawStations(t){
  if(!S||mapOpen)return;const me=S.me;
  const list=(me.hacker?me.fake:me.tasks);
  for(const task of list){if(task.done)continue;const st=curStep(task),bob=Math.sin(t*5+st.x)*2;
    ctx.fillStyle=me.hacker?"rgba(255,209,102,.5)":"#ffd166";ctx.font="900 15px system-ui";ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="#000";ctx.strokeText("!",st.x,st.y-22+bob);ctx.fillText("!",st.x,st.y-22+bob);
    ctx.strokeStyle="rgba(255,209,102,.35)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(st.x,st.y,9+Math.sin(t*4)*1.5,0,TAU);ctx.stroke()}
  if(S.sab)for(const st of S.sab.stations){const pu=.5+.5*Math.sin(performance.now()/150);ctx.strokeStyle=`rgba(255,80,80,${.5+.5*pu})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(st.x,st.y,10+pu*4,0,TAU);ctx.stroke();ctx.fillStyle=st.on>0?"#7bf19b":"#ff6b6e";ctx.font="900 17px system-ui";ctx.textAlign="center";ctx.strokeStyle="#000";ctx.lineWidth=3;ctx.strokeText("⚠",st.x,st.y-18);ctx.fillText("⚠",st.x,st.y-18)}
}
function drawBell(t){
  const near=S&&S.me.alive&&Math.hypot(S.me.x-BELL.x,S.me.y-BELL.y)<46,x=BELL.tx,y=BELL.ty;
  if(near){ctx.fillStyle="rgba(255,209,102,.25)";ctx.beginPath();ctx.arc(x,y,16+Math.sin(t*6)*2,0,TAU);ctx.fill()}
  ctx.fillStyle="#6b4a14";ctx.beginPath();ctx.ellipse(x,y+4,9,3.5,0,0,TAU);ctx.fill();
  ctx.fillStyle="#e6b422";ctx.beginPath();ctx.moveTo(x-8,y+3);ctx.quadraticCurveTo(x-8,y-9,x,y-9);ctx.quadraticCurveTo(x+8,y-9,x+8,y+3);ctx.closePath();ctx.fill();ctx.fillStyle="#fff7a8";ctx.beginPath();ctx.ellipse(x-3,y-3,2,4,-.3,0,TAU);ctx.fill();
  ctx.fillStyle="#d1342b";ctx.beginPath();ctx.arc(x,y-10,2.4,0,TAU);ctx.fill();
  ctx.font="700 5.5px system-ui";ctx.fillStyle="#fff";ctx.textAlign="center";ctx.fillText("ALL-HANDS BELL",x,y+14);
}
function drawSabFx(t){
  if(!S.sab)return;
  if(S.sab.type==="fire"){for(let i=0;i<5;i++){const fx=130+i*14+Math.sin(t*9+i)*3,fh=12+Math.sin(t*11+i*2)*5+i%2*5;ctx.fillStyle="#ff7a1c";ctx.beginPath();ctx.moveTo(fx-5,262);ctx.quadraticCurveTo(fx,262-fh,fx+5,262);ctx.fill();ctx.fillStyle="#ffd24a";ctx.beginPath();ctx.moveTo(fx-2.5,262);ctx.quadraticCurveTo(fx,262-fh*.55,fx+2.5,262);ctx.fill()}
    for(let i=0;i<4;i++){ctx.fillStyle=`rgba(80,80,80,${.35-i*.07})`;ctx.beginPath();ctx.arc(140+Math.sin(t*1.5+i)*10,240-((t*18+i*14)%60),7+i*2,0,TAU);ctx.fill()}}
}
function drawMapPins(){
  const me=S.me,list=(me.hacker?me.fake:me.tasks);
  for(const task of list){if(task.done)continue;const st=curStep(task);ctx.fillStyle="#ffd166";ctx.beginPath();ctx.arc(st.x,st.y,9,0,TAU);ctx.fill();ctx.fillStyle="#000";ctx.font="900 13px system-ui";ctx.textAlign="center";ctx.fillText("!",st.x,st.y+5)}
  if(S.sab)for(const st of S.sab.stations){ctx.fillStyle="#e5383b";ctx.beginPath();ctx.arc(st.x,st.y,10,0,TAU);ctx.fill();ctx.fillStyle="#fff";ctx.font="900 13px system-ui";ctx.textAlign="center";ctx.fillText("!",st.x,st.y+5)}
  ctx.fillStyle="#e6b422";ctx.beginPath();ctx.arc(BELL.tx,BELL.ty,8,0,TAU);ctx.fill();ctx.fillStyle="#000";ctx.font="800 9px system-ui";ctx.fillText("🔔",BELL.tx,BELL.ty+3);
  ctx.strokeStyle="#fff";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(me.x,me.y,10,0,TAU);ctx.stroke();
  // room labels
  ctx.font="700 12px system-ui";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.strokeStyle="#000";ctx.lineWidth=3;
  for(const [n,x,y] of [["PANTRY",150,330],["SERVER",150,548],["BAY 1",542,126],["BOARDROOM",1150,130],["CEO",920,130],["HR",942,310],["RECEPTION",1190,540],["BALCONY",700,76],["MEETING 1/2",378,230],["BAYS 2–6",620,470],["POOL OF DESKS",0,0]]){if(!x)continue;ctx.strokeText(n,x,y);ctx.fillText(n,x,y)}
}

/* ============ HUD ============ */
function renderTasks(){
  const el=$("tasks"),me=S.me,list=me.hacker?me.fake:me.tasks;
  const min=el.classList.contains("min");
  let h=`<h4><span>${me.hacker?"Fake tasks":"Your tasks"}</span><span>${list.filter(t=>t.done).length}/${list.length} ▾</span></h4>`;
  if(me.hacker)h+=`<div class="note">Blend in. Don't actually fix anything.</div>`;
  const first=list.find(t=>!t.done);
  for(const t of list){const def=TBY[t.id],st=curStep(t);h+=`<div class="t ${t.done?"done":(t===first?"cur":"")}">${t.done?"✔ ":""}${def.steps[Math.min(t.step,def.steps.length-1)].room}: ${def.name}${def.steps.length>1&&!t.done?" ("+(t.step+1)+"/"+def.steps.length+")":""}</div>`}
  el.innerHTML=h;el.querySelector("h4").onclick=()=>{el.classList.toggle("min")};
}
function toast(t,ms=2600){const e=$("toast");e.textContent=t;e.className="on";clearTimeout(e._t);e._t=setTimeout(()=>e.className="",ms)}
function updateHUD(dt){
  const me=S.me;
  S.shownIncome+=(Math.max(0,S.income-S.stolen*3000)-S.shownIncome)*Math.min(1,dt*4);
  $("incbar").style.width=clamp(S.tasksDone/S.tasksTotal*100,0,100)+"%";
  $("cli").textContent=S.clients.length;$("inc").textContent=Math.round(S.shownIncome).toLocaleString("en-IN")+" / "+TARGET.toLocaleString("en-IN");
  const left=DESKS.length-S.stolen;$("lap").textContent=left;
  $("rolechip").textContent=me.hacker?"🕶️ HACKER":"👷 CREW";$("rolechip").style.color=me.hacker?"#ff6b6e":"#6aa8ff";
  // target / buttons
  S.target=findTarget();
  const tg=S.target,bUse=$("bUse"),lbl=$("useLbl");
  bUse.className="ab use"+(tg?" pulse":" off");
  lbl.textContent=!tg?"USE":tg.kind==="steal"?"STEAL":tg.kind==="bell"?"BELL":tg.kind==="sab"?"FIX":tg.kind==="fake"?"FAKE":"USE";
  const body=nearBody();
  const showRep=me.alive&&(body||S.witness&&S.t-S.witness.t<9);
  $("bRep").style.display=me.alive?"":"none";$("bRep").className="ab rep"+(showRep?(S.witness&&!body?" pulse":""):" off");
  $("bKill").style.display=me.hacker&&me.alive?"":"none";$("bSab").style.display=me.hacker&&me.alive?"":"none";
  if(me.hacker){const tgt=killTarget();$("bKill").className="ab kill"+(me.killCd<=0&&tgt?" pulse":" off");$("cdKill").style.setProperty("--p",clamp(me.killCd/KILLCD*100,0,100)+"%");
    $("bSab").className="ab sab"+(S.sabCd<=0&&!S.sab?"":" off");$("cdSab").style.setProperty("--p",clamp(S.sabCd/40*100,0,100)+"%")}
  // hold progress ring on USE
  const cd=bUse.querySelector(".cd")||(()=>{const d=document.createElement("div");d.className="cd";bUse.appendChild(d);return d})();
  cd.style.setProperty("--p",S.hold?(100-S.hold.t/S.hold.need*100)+"%":"0%");
  if(S.sab)showBanner();
}
function nearBody(){if(!S.me.alive)return null;for(const b of S.bodies)if(!b.reported&&Math.hypot(S.me.x-b.x,S.me.y-b.y)<62&&NAV.los(S.me.x,S.me.y-6,b.x,b.y-6))return b;return null}
function killTarget(){const me=S.me;let best=null,bd=KILL_RANGE;for(const p of S.P){if(!p.alive||p.hacker)continue;const d=dist(me,p);if(d<bd){bd=d;best=p}}return best}
function findTarget(){
  const me=S.me;if(!me)return null;let best=null,bd=40;
  const consider=(kind,x,y,ref)=>{const d=Math.hypot(me.x-x,me.y-y);if(d<bd){bd=d;best={kind,x,y,ref}}};
  if(me.alive||true){
    const list=me.hacker?me.fake:me.tasks;for(const t of list){if(t.done)continue;const st=curStep(t);consider(me.hacker?"fake":"task",st.x,st.y,t)}
    if(S.sab)for(const st of S.sab.stations)consider("sab",st.x,st.y,st);
    if(me.alive&&me.bellLeft>0&&!(S.sab&&S.sab.def.crit))consider("bell",BELL.x,BELL.y,null);
    if(me.alive&&me.hacker){for(const d of DESKS){if(d.stolen)continue;consider("steal",d.x,d.y,d)}}
  }
  return best;
}

/* ============ input & actions ============ */
addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();keys[k]=true;AUDIO.init();
  if(!S||S.phase!=="play")return;
  if(modalOpen){if(k==="escape")document.getElementById("tmx")&&document.getElementById("tmx").click();return}
  if(k==="e"||k===" ")useDown();else if(k==="r")doReport();else if(k==="q")doKill();else if(k==="f")doSab();else if(k==="m")toggleMap();
  if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(k))e.preventDefault();
});
addEventListener("keyup",e=>{const k=e.key.toLowerCase();keys[k]=false;if(k==="e"||k===" ")useUp()});
function useDown(){
  if(!S||S.phase!=="play"||modalOpen)return;const tg=S.target;if(!tg)return;
  if(tg.kind==="task"){if(S.sab&&S.sab.type==="wifi"){toast("Wi-Fi is down! Reset the router in HR first.");return}openTask(tg.ref)}
  else if(tg.kind==="bell"){S.me.bellLeft--;callMeeting(S.me,{type:"button"})}
  else if(tg.kind==="sab")S.hold={kind:"sab",ref:tg.ref,t:0,need:S.sab&&S.sab.type==="fire"?.8:1.4,x:tg.x,y:tg.y};
  else if(tg.kind==="steal")S.hold={kind:"steal",ref:tg.ref,t:0,need:STEAL_T,x:tg.x,y:tg.y};
  else if(tg.kind==="fake")S.hold={kind:"fake",ref:tg.ref,t:0,need:2.5,x:tg.x,y:tg.y};
}
function useUp(){if(S)S.hold=null}
function openTask(task){
  const st=curStep(task),g=st.g,type=g[0];modalOpen=true;AUDIO.sfx("click");
  let p;const T=window.TASKGAMES;
  if(type==="hold")p=T.hold(g[1],g[2],g[3]);else if(type==="stand")p=T.stand(g[1],g[2],g[3]);else p=T[type]();
  p.then(ok=>{modalOpen=false;if(ok&&S&&S.phase==="play")completeStep(S.me,task);renderTasks()});
}
function doReport(){
  if(!S||S.phase!=="play"||!S.me.alive||modalOpen)return;
  const b=nearBody();
  if(b)return callMeeting(S.me,{type:"body",body:b});
  if(S.witness&&S.t-S.witness.t<9){const w=S.witness;const body=w.body||{id:-1,name:"?",room:w.room};return callMeeting(S.me,w.type==="kill"?{type:"witness",suspect:w.suspect,body}:{type:"steal",suspect:w.suspect,room:w.room})}
}
function doKill(){
  const me=S.me;if(!S||S.phase!=="play"||!me.hacker||!me.alive||modalOpen||me.killCd>0)return;
  const t=killTarget();if(t)killPlayer(me,t);
}
function doSab(){
  const me=S.me;if(!S||S.phase!=="play"||!me.hacker||!me.alive||modalOpen||S.sabCd>0||S.sab)return;
  const m=document.createElement("div");m.style.cssText="position:fixed;right:110px;bottom:20px;z-index:20;display:flex;flex-direction:column;gap:8px";
  for(const k of ["server","fire","wifi"]){const b=document.createElement("button");b.className="vbtn";b.style.cssText="background:"+SABDEF[k].col+";padding:10px 16px;border:0;border-radius:10px;color:#fff;font-weight:900";b.textContent="⚡ "+SABDEF[k].name;b.onclick=()=>{m.remove();triggerSab(k,me)};m.appendChild(b)}
  const x=document.createElement("button");x.textContent="Cancel";x.style.cssText="padding:6px;border-radius:8px;border:0;background:#444;color:#fff";x.onclick=()=>m.remove();m.appendChild(x);document.body.appendChild(m);
}
function toggleMap(){mapOpen=!mapOpen;$("mapov").classList.toggle("on",mapOpen)}
$("bUse").addEventListener("pointerdown",e=>{AUDIO.init();useDown();e.preventDefault()});
addEventListener("pointerup",()=>useUp());
$("bRep").onclick=()=>doReport();$("bKill").onclick=()=>doKill();$("bSab").onclick=()=>doSab();
$("bMap").onclick=()=>toggleMap();$("mapx").onclick=()=>toggleMap();
$("bSnd").onclick=()=>{AUDIO.muted=!AUDIO.muted;$("bSnd").textContent=AUDIO.muted?"🔇":"🔊"};
// pointer steering (floating joystick)
cv.addEventListener("pointerdown",e=>{AUDIO.init();if(!S||S.phase!=="play")return;joy.on=true;joy.ox=joy.x=e.clientX;joy.oy=joy.y=e.clientY;const j=$("joy");j.style.display="block";j.style.left=(e.clientX-65)+"px";j.style.top=(e.clientY-65)+"px";j.firstElementChild.style.transform="translate(0,0)"});
addEventListener("pointermove",e=>{if(!joy.on)return;joy.x=e.clientX;joy.y=e.clientY;const dx=clamp(joy.x-joy.ox,-55,55),dy=clamp(joy.y-joy.oy,-55,55);$("joy").firstElementChild.style.transform=`translate(${dx}px,${dy}px)`});
addEventListener("pointerup",()=>{joy.on=false;$("joy").style.display="none"});

/* ============ main update ============ */
function update(dt){
  if(!S)return;
  for(const p of popups)p.t+=dt;for(let i=popups.length-1;i>=0;i--)if(popups[i].t>2.4)popups.splice(i,1);
  for(const p of particles){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt}for(let i=particles.length-1;i>=0;i--)if(particles[i].t>particles[i].life)particles.splice(i,1);
  if(S.shake>0)S.shake=Math.max(0,S.shake-dt*1.4);
  if(S.phase==="meeting"){meetingUpdate(dt);return}
  if(S.phase!=="play")return;
  S.t+=dt;
  const me=S.me;
  // me movement
  if(!me.bot){
    me.moving=false;
    if(!modalOpen){
      let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
      if(joy.on){const jx=joy.x-joy.ox,jy=joy.y-joy.oy;if(Math.hypot(jx,jy)>12){dx=jx;dy=jy}}
      const l=Math.hypot(dx,dy);
      if(l>.05){dx/=Math.max(1,l);dy/=Math.max(1,l);const k=Math.min(1,l);move(me,dx/ (l>1?1:1),dy,SPEED*dt*(S.sab&&S.sab.type==="coffee"?.6:1));me.moving=true;me.walk+=dt*13;if(Math.random()<dt*2.5)AUDIO.sfx("step")}
    }
    if(me.hacker){me.killCd-=dt;me.stealCd-=dt}
  }else aiUpdate(me,dt);
  for(const p of S.P)if(p!==me)aiUpdate(p,dt);
  // hold actions
  if(S.hold){const h=S.hold;const tg=S.target;
    if(!tg||Math.hypot(me.x-h.x,me.y-h.y)>46||modalOpen){S.hold=null}
    else{h.t+=dt;if(h.t>=h.need){S.hold=null;
      if(h.kind==="steal")stealLaptop(me,h.ref);
      else if(h.kind==="sab")activateStation(me,h.ref);
      else if(h.kind==="fake"){h.ref.done=true;renderTasks();AUDIO.sfx("done")}}}}
  // sabotage
  if(S.sab){const sb=S.sab;sb.t-=dt;for(const st of sb.stations)if(st.on>0)st.on-=dt;
    if(Math.floor(sb.t*2)%2===0&&Math.random()<.02)AUDIO.sfx("siren");
    if(Math.floor(sb.t)!==sb._lt){sb._lt=Math.floor(sb.t);showBanner()}
    if(sb.t<=0){if(sb.def.crit)end("hackers",sb.type==="server"?"The server never came back. DAD went bankrupt.":"The pantry burned down. DAD went bankrupt.");else endSab(false)}}
  else if(S.sabCd>0)S.sabCd-=dt;
  // camera
  S.cam.x+=(me.x-S.cam.x)*Math.min(1,dt*8);S.cam.y+=(me.y-S.cam.y)*Math.min(1,dt*8);
  checkWin();
}

/* ============ overlays: title, reveal, killed, game over ============ */
function showSplash(html){const s=$("splash");$("spin").innerHTML=html;s.classList.add("on")}
function hideSplash(){$("splash").classList.remove("on")}
function showReveal(){
  const me=S.me;const hk=S.P.filter(p=>p.hacker);
  const crewRow=S.P.filter(p=>!p.hacker||(me.hacker&&p.hacker));
  const list=me.hacker?hk:S.P;
  showSplash(`<p style="letter-spacing:6px;color:#9aa1c4">WEEK 1 · DAD · NILA BUILDING</p><h2 style="color:${me.hacker?"#ff4d4f":"#6aa8ff"}">${me.hacker?"HACKER":"CREW"}</h2>
    <p>${me.hacker?`Log people out, steal <b>8 laptops</b>, sabotage the office. ${hk.length>1?"Your partner is <b style='color:#ff6b6e'>"+hk.find(p=>p!==me).name+"</b>.":""}`:`Finish your tasks to win clients. <b>2 Hackers</b> are among you.`}</p>
    <div class="row" id="rrow"></div><p style="color:#ffd166;font-style:italic">Boss: “Week one. Eight employees. One client list. Don't mess it up.”</p><button class="bigbtn" id="goBtn">LET'S GO</button>`);
  const row=$("rrow");for(const p of list){const c=document.createElement("canvas");c.width=c.height=100;beanIcon(c,p.color,p.hat);row.appendChild(c)}
  $("goBtn").onclick=()=>{hideSplash();AUDIO.sfx("click")};
  if(BOTME)hideSplash();
}
function showKilled(k){
  $("flash").style.opacity=.85;setTimeout(()=>$("flash").style.opacity=0,120);
  showSplash(`<h2 style="color:#ff4d4f">LOGGED OUT</h2><p>${k.name} was a Hacker. You're a ghost now: you can still finish tasks and help the crew win.</p><button class="bigbtn" id="okBtn">OK</button>`);
  $("okBtn").onclick=()=>{hideSplash();renderTasks()};
}
function showOver(){
  if(!S||!S.over)return;const o=S.over,me=S.me;const won=(o.winner==="crew")!==me.hacker;
  AUDIO.sfx(won?"win":"lose");
  const log=S.killLog.map(k=>`<div>⏱ ${Math.floor(k.t/60)}:${String(Math.floor(k.t%60)).padStart(2,"0")} · <b>${k.killer}</b> logged out <b>${k.victim}</b> in ${k.room}</div>`).join("")||"<div>Nobody was logged out.</div>";
  showSplash(`<h2 style="color:${won?"#7bf19b":"#ff4d4f"}">${won?"VICTORY":"DEFEAT"}</h2><p style="font-size:1.3em"><b>${o.winner==="crew"?"CREW WINS":"HACKERS WIN"}</b></p><p>${o.why}</p>
    <p>👥 ${S.clients.length} clients · ₹ ${Math.round(Math.max(0,S.income-S.stolen*3000)).toLocaleString("en-IN")} earned · 💻 ${S.stolen} laptops stolen · ${S.meetings} meetings</p>
    <div class="row" id="orow"></div><div class="log"><b>Hackers:</b> ${S.P.filter(p=>p.hacker).map(p=>p.name).join(" & ")}<br>${log}</div><button class="bigbtn" id="againBtn">PLAY AGAIN</button>`);
  const row=$("orow");for(const p of S.P){const c=document.createElement("canvas");c.width=c.height=100;beanIcon(c,p.color,p.hat,!p.alive);c.title=p.name+(p.hacker?" (Hacker)":"");c.style.outline=p.hacker?"3px solid #e5383b":"none";c.style.borderRadius="12px";row.appendChild(c)}
  $("againBtn").onclick=()=>{hideSplash();toTitle()};
}
function toTitle(){S.phase="title";$("hud").classList.remove("on");$("title").classList.add("on");$("tm").classList.remove("on");$("meet").classList.remove("on");M.setServer(true)}
function startRun(){
  AUDIO.init();$("title").classList.remove("on");$("hud").classList.add("on");
  newGame(sel.char,sel.role);renderTasks();showReveal();
}

/* ---- title UI ---- */
(function(){
  const box=$("chars");
  CHARS.forEach((c,i)=>{const d=document.createElement("div");d.className="cc"+(i===0?" sel":"");const cvs=document.createElement("canvas");cvs.width=cvs.height=128;beanIcon(cvs,c.color,c.hat);d.appendChild(cvs);const n=document.createElement("div");n.textContent=c.name;d.appendChild(n);
    d.onclick=()=>{sel.char=i;[...box.children].forEach((x,j)=>x.classList.toggle("sel",j===i));AUDIO.init();AUDIO.sfx("click")};box.appendChild(d)});
  $("roles").querySelectorAll(".rb").forEach(b=>b.onclick=()=>{sel.role=b.dataset.r;$("roles").querySelectorAll(".rb").forEach(x=>x.classList.toggle("sel",x===b));AUDIO.init();AUDIO.sfx("click")});
  $("startBtn").onclick=startRun;
  if(q.get("char"))sel.char=+q.get("char");if(q.get("role"))sel.role=q.get("role");
})();

/* ============ loop + dev API ============ */
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(S&&S.phase!=="title"){update(dt);render();if(S.phase==="play"||S.phase==="meeting")updateHUD(dt)}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.AU={get S(){return S},startRun,step(dt){update(dt)},newGame,callMeeting,triggerSab,killPlayer,DESKS,TASKS,SABDEF,render,CHARS,sel,renderTasks,
  stepN(n,dt=.05){for(let i=0;i<n&&S&&S.phase!=="over";i++){update(dt)}}};
if(q.get("auto")==="1"){sel.char=+(q.get("char")||0);sel.role=q.get("role")||"random";startRun();}
})();
