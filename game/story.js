/* ================= STORY: ten chapters of October 7 (top-down, same small characters as the explorer) ================= */
(function(){
"use strict";
const $=G.$,q=new URLSearchParams(location.search);
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const pickR=a=>a[(Math.random()*a.length)|0];
const DEV=!!G.dev;

/* ---------- state + runner (so jumping chapters cancels the old script) ---------- */
const SEAT=()=>S.SEAT;
G.fresh=()=>({dish:"Biriyani",changes:4,teaMode:"now",teaMin:0,insta:false,watchTries:1,six30:"balcony",place:"beach",gifts:[],pet:false,gotShell:false,wish:false,mood:0,flowers:0});
G.state=G.fresh();
let TOKEN=0;
function runner(tk){
  const hang=()=>new Promise(()=>{});
  const W=fn=>async(...a)=>{const v=await fn(...a);if(tk!==TOKEN)await hang();return v};
  return{say:W((w,t)=>G.say(w,t)),nar:W(t=>G.say(null,t)),choose:W(G.choose),wait:W(G.wait),go:W((s,o)=>G.go(s,o)),card:W(G.card),p:W(p=>p)};
}
function clearMini(){$("mini").innerHTML=""}
function panel(html,style,id){const m=$("mini");m.insertAdjacentHTML("beforeend",`<div class="panel" id="${id}" style="${style}">${html}</div>`);return $(id)}
const CENTER="left:50%;top:50%;transform:translate(-50%,-50%)";
const TOP=w=>`left:50%;top:calc(var(--u)*86);transform:translateX(-50%);width:calc(var(--u)*${w})`;

/* ---------- office helpers (instant in dev mode) ---------- */
const O=()=>S.Office;
async function walkTo(R,x,y,speed){if(DEV){O().dev.x=x;O().dev.y=y;return}await R.p(O().walkPlayer(x,y,speed))}
async function goal(R,g){g.auto=true;if(DEV){O().dev.x=g.x;O().dev.y=g.y;return}await R.p(O().setGoal(g));O().setControl(false)}
async function actorTo(R,a,x,y,speed){if(DEV){a.x=x;a.y=y;return}await R.p(O().walkActor(a,x,y,speed))}
async function liftCut(R){G.hideDlg();await G.fadeOut(500);A.sfx("lift");await R.wait(1100);A.sfx("ding");await R.wait(500)}

/* =====================================================================
   PANELS / MINI-GAMES (DOM)
   ===================================================================== */
function cupPanel(){
  return new Promise(res=>{
    const cups=[{id:"s",n:"Small cup",d:"a sip, really",c:"#f3efe8",w:22},{id:"m",n:"Medium mug",d:"respectable",c:"#e8a0b8",w:30},{id:"b",n:"The big blue cup",d:"“DAD” painted on it",c:"#3c6fd4",w:44}];
    const p=panel(`<h3>Pantry · cup shelf</h3><p style="color:#9aa3b5">Which cup for Sreedev?</p><div class="grid" style="grid-template-columns:repeat(3,1fr)">${cups.map(c=>`<button class="btn" data-c="${c.id}" style="text-align:center;padding:calc(var(--u)*16)"><div style="margin:0 auto calc(var(--u)*8);width:calc(var(--u)*${c.w}*1.3);height:calc(var(--u)*${c.w}*1.3);border-radius:50%;background:${c.c};border:calc(var(--u)*3) solid rgba(255,255,255,.4)"></div><div>${c.n}</div><div style="font-size:calc(var(--u)*14);color:#9aa3b5">${c.d}</div></button>`).join("")}</div>`,CENTER+";width:calc(var(--u)*640)","cp");
    p.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{A.sfx("clink");p.remove();res(b.dataset.c)});
    if(DEV)setTimeout(()=>p.querySelector(`[data-c="${DEV_CUP.shift()||"b"}"]`).click(),10);
  });
}
const DEV_CUP=["s","b"];
function boilPanel(){
  return new Promise(res=>{
    const p=panel(`<h3>Kettle</h3><p style="color:#9aa3b5">Switch it on and wait for the click.</p><button class="btn p" id="kon">Switch on</button><div class="bar" style="margin-top:calc(var(--u)*14)"><i id="kbar"></i></div><div class="cap" id="kcap">Cold water.</div>`,CENTER+";width:calc(var(--u)*540)","kp");
    const go=()=>{$("kon").disabled=true;S.Office.pr.boiling=true;A.sfx("click");$("kcap").textContent="Boiling water…";const t0=performance.now(),dur=DEV?300:3300;
      (function tk(){const p01=Math.min(1,(performance.now()-t0)/dur);$("kbar").style.width=(p01*100)+"%";if(Math.random()<.2)A.sfx("kettle");if(p01>=1){S.Office.pr.boiling=false;A.sfx("ding");p.remove();res()}else requestAnimationFrame(tk)})()};
    $("kon").onclick=go;if(DEV)setTimeout(go,10);
  });
}
function caddyPanel(){
  return new Promise(res=>{
    const p=panel(`<h3>At the tea caddy</h3><p style="color:#9aa3b5">What goes in the cup?</p><div class="row" style="flex-direction:column"><button class="btn" data-i="bag">☕ Black tea bag</button><button class="btn" data-i="milk">🥛 Milk</button><button class="btn" data-i="sugar">🧂 Sugar</button></div>`,CENTER+";width:calc(var(--u)*520)","ip");
    p.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{A.sfx("click");p.remove();res(b.dataset.i)});
  });
}

function watchGame(){
  return new Promise(res=>{
    const st=document.createElement("style");st.id="wstyle";st.textContent="@keyframes wshake{0%,100%{transform:rotate(0)}15%{transform:rotate(-4deg) translateX(-6px)}30%{transform:rotate(4deg) translateX(6px)}45%{transform:rotate(-3deg)}60%{transform:rotate(3deg)}}.wsh{animation:wshake .45s infinite}";document.head.appendChild(st);
    const p=panel(`<h3 style="text-align:center">⌚ Your watch buzzes</h3>
      <div style="display:flex;justify-content:center;margin:calc(var(--u)*6) 0"><svg id="wsvg" class="wsh" viewBox="0 0 220 260" style="width:calc(var(--u)*170)">
        <rect x="70" y="0" width="80" height="70" rx="14" fill="#2a2f3b"/><rect x="70" y="190" width="80" height="70" rx="14" fill="#2a2f3b"/>
        <rect x="26" y="52" width="168" height="156" rx="38" fill="#14171d" stroke="#59627a" stroke-width="5"/><rect x="40" y="66" width="140" height="128" rx="28" fill="#0a1a2a"/>
        <circle cx="62" cy="96" r="12" fill="#ffd166"/><text x="62" y="101" font-size="14" text-anchor="middle" font-weight="700" fill="#2a1a00">S</text>
        <text x="82" y="94" font-size="14" fill="#e8f2ff" font-weight="700">Sreedev</text><text x="82" y="112" font-size="11" fill="#8fb3d9">new message</text>
        <text x="110" y="150" font-size="20" text-anchor="middle" fill="#7fe0ff" font-weight="700">*types*</text>
        <circle cx="86" cy="172" r="4" fill="#7fe0ff"><animate attributeName="opacity" values=".2;1;.2" dur="1s" repeatCount="indefinite"/></circle><circle cx="110" cy="172" r="4" fill="#7fe0ff"><animate attributeName="opacity" values=".2;1;.2" dur="1s" begin=".2s" repeatCount="indefinite"/></circle><circle cx="134" cy="172" r="4" fill="#7fe0ff"><animate attributeName="opacity" values=".2;1;.2" dur="1s" begin=".4s" repeatCount="indefinite"/></circle></svg></div>
      <p style="text-align:center">The watch shakes. Type the reply exactly.</p><input id="wi" placeholder="your reply…" autocomplete="off" spellcheck="false">
      <div class="cap" id="wmsg"></div><div class="row" style="justify-content:center"><button class="btn p" id="wok">Send</button></div>`,TOP(540),"wp");
    let wrong=0;const inp=$("wi");setTimeout(()=>inp&&inp.focus(),50);
    const tryIt=()=>{const v=inp.value.trim().toLowerCase().replace(/\s+/g," ");
      if(v==="sreedev therane"){A.sfx("right");G.state.watchTries=wrong+1;p.remove();document.getElementById("wstyle")?.remove();res()}
      else{wrong++;A.sfx("wrong");$("wmsg").textContent="Hmm, that's not quite it. Try again."+(wrong>=2?"  Type exactly:  sreedev therane":"");inp.select()}};
    $("wok").onclick=tryIt;inp.addEventListener("keydown",e=>{if(e.key==="Enter")tryIt()});
    if(DEV)setTimeout(()=>{inp.value="nope";tryIt();inp.value="sreedev";tryIt();inp.value="  Sreedev   Therane ";tryIt()},20);
  });
}
function lunchGame(){
  return new Promise(res=>{
    const dishes=["Fried rice","Noodles","Biriyani"];let n=0,last=null;
    const react=[(d,o)=>`Hmm, ${d.toLowerCase()}… good idea. But what about ${o.toLowerCase()}?`,(d,o)=>`Okay, ${d.toLowerCase()}. Final. …Wait, is ${o.toLowerCase()} better today?`,(d,o)=>`${cap(d)}? Yes. Definitely. Probably. Let me look at the menu again.`,
      (d,o)=>`Fine, fine, ${d.toLowerCase()}! I've decided. (He has not decided.)`,(d,o)=>`You know what, ${d.toLowerCase()} it is. Unless… no. ${cap(d)}. Yes.`];
    const p=panel(`<h3>Hmm. Everything looks good. You choose.</h3><p style="color:#9aa3b5">Suda Suda's menu board. Suggest a dish for Sreedev.</p>
      <div class="grid" style="grid-template-columns:repeat(3,1fr)">${dishes.map(d=>`<button class="btn" data-d="${d}" style="font-size:calc(var(--u)*24);padding:calc(var(--u)*22) 0">${d}</button>`).join("")}</div>
      <div class="cap" id="lmsg" style="font-style:normal;color:#ffd9a8;min-height:calc(var(--u)*56)">Sreedev is staring at the menu.</div>
      <div class="row"><button class="btn p" id="lok" disabled>Order …</button><span id="lcnt" style="color:#9aa3b5;align-self:center;font-size:calc(var(--u)*17)"></span></div>`,TOP(720),"lp");
    const ok=$("lok");
    const suggest=d=>{const o=pickR(dishes.filter(x=>x!==d)),line=react[n%react.length](d,o);n++;last=d;A.sfx("click");
      $("lmsg").textContent="“"+line+"”";if(G.scene===S.Atrium)G.bubble(S.Atrium.sree,line,3800);$("lcnt").textContent=n+(n===1?" suggestion":" suggestions");
      if(n>=3){ok.disabled=false;ok.textContent="Order "+d+" (finally!)"}};
    p.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>suggest(b.dataset.d));
    ok.onclick=()=>{p.remove();res({dish:last,n})};
    if(DEV)setTimeout(()=>{suggest("Fried rice");suggest("Noodles");suggest("Biriyani");suggest("Fried rice");ok.click()},20);
  });
}
function slowTea(){
  return new Promise(res=>{
    const caps=["Saving the file. Gently.","Admiring the screen.","Checking the phone, briefly.","Finding the perfect cardigan.","Almost. Probably."],msgs=["Hello??","I can hear the clock NOT moving.","I'm wilting.","Tea… please…"];
    const p=panel(`<h3>Taking her own sweet time…</h3><div class="bar"><i id="sbar"></i></div><div class="cap" id="scap">${caps[0]}</div><div id="smsg" style="margin-top:calc(var(--u)*14);min-height:calc(var(--u)*92)"></div>
      <div class="row"><button class="btn" id="sinsta">Check Instagram first</button></div>`,TOP(640),"sp");
    const dur=DEV?500:26000,t0=performance.now();let ci=0,mi=0,done=false;
    const addMsg=t=>{$("smsg").insertAdjacentHTML("beforeend",`<div style="margin:calc(var(--u)*4) 0;padding:calc(var(--u)*8) calc(var(--u)*14);background:#1d2a3f;border-radius:calc(var(--u)*16);display:inline-block;font-size:calc(var(--u)*19)">💬 <b style="color:#ffd166">Sreedev</b> ${t}</div><br>`);A.sfx("pop")};
    (function tick(){if(done)return;const p01=Math.min(1,(performance.now()-t0)/dur);$("sbar").style.width=(p01*100)+"%";G.time=16*60+4+21*p01;
      const nc=Math.min(caps.length-1,Math.floor(p01*caps.length));if(nc!==ci){ci=nc;$("scap").textContent=caps[ci]}
      const nm=Math.floor(p01*(msgs.length+1))-1;while(mi<msgs.length&&mi<=nm)addMsg(msgs[mi++]);
      if(p01>=1){done=true;p.remove();res()}else requestAnimationFrame(tick)})();
    $("sinsta").onclick=()=>{G.state.insta=true;addMsg("Are you scrolling?!");if(G.scene===S.Office)G.bubble(S.Office.sree,"Are you scrolling?!",2200);$("sinsta").disabled=true};
  });
}
function urgeGame(){
  return new Promise(res=>{
    const caps=["Let's go.","Let's GO.","Sreedev.","SREEDEV.","*pokes shoulder*","*pokes again*","He's closing tabs!","He's saving!"];let n=0;
    const p=panel(`<h3>Hurry him up!</h3><div class="bar"><i id="ubar"></i></div><div class="cap" id="ucap" style="font-size:calc(var(--u)*24);color:#ffd9a8;font-style:normal">Press the button. A lot.</div>
      <div class="row"><button class="btn p" id="ugo" style="font-size:calc(var(--u)*30);padding:calc(var(--u)*18) calc(var(--u)*44)">Let's gooo</button><span id="ucnt" style="align-self:center;color:#9aa3b5">0 / 15</span></div>`,TOP(620),"up");
    const go=()=>{n++;A.sfx("click");$("ubar").style.width=(n/15*100)+"%";$("ucnt").textContent=n+" / 15";const t=caps[Math.min(7,Math.floor((n-1)/2))];$("ucap").textContent=t;
      const sc=G.scene;if(sc&&sc.dev&&!/^\*/.test(t)&&!/^He's/.test(t))G.bubble(sc.dev,t,1200);if(sc&&sc.sree&&/^He's/.test(t))G.bubble(sc.sree,t.replace("He's","I'm").replace("!","…"),1200);
      if(n>=15){p.remove();res()}};
    $("ugo").onclick=go;if(DEV)setTimeout(()=>{for(let i=0;i<15;i++)go()},20);
  });
}
function waitGame(){
  return new Promise(res=>{
    const caps=["*sigh*","*louder sigh*","Counting the ceiling lights.","He's typing faster now.","He's… done?"];
    const p=panel(`<h3>Waiting while he finishes…</h3><div class="bar"><i id="wbar"></i></div><div class="cap" id="wcap" style="font-size:calc(var(--u)*24);color:#ffd9a8;font-style:normal">${caps[0]}</div>`,TOP(620),"wtp");
    const dur=DEV?400:14000,t0=performance.now();let ci=0;
    (function tick(){const p01=Math.min(1,(performance.now()-t0)/dur);$("wbar").style.width=(p01*100)+"%";G.time=18*60+30+58*p01;
      const nc=Math.min(caps.length-1,Math.floor(p01*caps.length));if(nc!==ci){ci=nc;$("wcap").textContent=caps[ci];if(G.scene&&G.scene.dev)G.bubble(G.scene.dev,caps[ci],2200)}
      if(p01>=1){p.remove();res()}else requestAnimationFrame(tick)})();
  });
}

/* ---------- gifts ---------- */
const GIFTS=[{id:"jasmine",e:"🌼",n:"Jasmine garland",d:"fresh mulla poo"},{id:"roses",e:"🌹",n:"Red roses",d:"a proper bouquet"},{id:"box",e:"🎁",n:"Surprise gift box",d:"even she doesn't know what's inside"},
  {id:"note",e:"💌",n:"Handwritten note",d:"a few words"},{id:"choc",e:"🍫",n:"Chocolate",d:"dark, with sea salt"},{id:"shell",e:"🐚",n:"Seashell",d:"from St. Andrews"}];
const SURPRISES=[{e:"👑",n:"A tiny wooden crown",l:"For the king of Bay 3."},{e:"🏍️",n:"A CB300R keychain",l:"So the bike knows who it belongs to."},{e:"☕",n:"A mug: “World's Okayest Coder”",l:"Brutally honest. I love it."},{e:"⌚",n:"A spare watch strap",l:"In case you break the watch again."},{e:"🎟️",n:"Two tickets to a late-night movie",l:"Nothing on at 6:30. Just saying."}];
const NOTES=["Same tea tomorrow?","You said thirty minutes. I counted.","Thank you for being slow at tea and fast at everything else.","Three rounds, one ride, zero regrets."];
function picker(avail){
  return new Promise(res=>{
    const p=panel(`<h3>A little something?</h3><p style="color:#9aa3b5">Give Sreedev…</p><div class="grid" style="grid-template-columns:repeat(3,1fr)">${avail.map(g=>`<button class="btn" data-g="${g.id}" style="text-align:center;padding:calc(var(--u)*14)"><div style="font-size:calc(var(--u)*46)">${g.e}</div><div>${g.n}</div><div style="font-size:calc(var(--u)*14);color:#9aa3b5">${g.d}</div></button>`).join("")}</div><div class="row"><button class="btn" id="gno">Not now</button></div>`,CENTER+";width:calc(var(--u)*760)","gp");
    p.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{A.sfx("gift");p.remove();res(b.dataset.g)});$("gno").onclick=()=>{p.remove();res(null)};
    if(DEV)setTimeout(()=>{const b=p.querySelector("[data-g]");b?b.click():$("gno").click()},20);
  });
}
function revealCard(emoji,title,line){
  return new Promise(res=>{
    if(!document.getElementById("gstyle")){const s=document.createElement("style");s.id="gstyle";s.textContent="@keyframes gbob{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-10px) rotate(6deg)}}";document.head.appendChild(s)}
    const p=panel(`<div style="text-align:center"><div style="font-size:calc(var(--u)*110);animation:gbob .6s infinite alternate">${emoji}</div><h3>${title}</h3><p style="color:#ffd9a8;font-style:italic">${line}</p><div class="row" style="justify-content:center"><button class="btn p" id="gok">Aww</button></div></div>`,CENTER+";width:calc(var(--u)*560)","rc");
    $("gok").onclick=()=>{p.remove();res()};if(DEV)setTimeout(()=>$("gok").click(),20);
  });
}
async function giftMoment(R,ctx){
  const S_=G.state,avail=GIFTS.filter(g=>!S_.gifts.includes(g.id)&&(g.id!=="shell"||S_.gotShell));if(!avail.length)return;
  const sc=G.scene,dev=sc.dev,sree=sc.sree;
  const id=await R.p(picker(avail));if(!id)return;S_.gifts.push(id);
  const holds={jasmine:"jasmine",roses:"flowers",box:"gift"};if(holds[id])dev.hold=holds[id];
  A.sfx("heart");const ax=sree.bx||640,ay=(sree.by||320)+10;Art.burst(ax,ay,id==="roses"||id==="jasmine"?"petal":"heart",18);Art.burst(ax,ay,"heart",8);
  const by={balcony:"…on a balcony, at night, with all the lights on. Unfair. Very unfair.",beach:"…with the waves right there. You planned this.",restaurant:"…over dinner. You are dangerous.",visitors:"…before you go. That's cheating."}[ctx]||"";
  if(id==="jasmine"){await R.say("ANAMIKA","For you. Mulla poo, fresh.");await R.say("SREEDEV","Jasmine? The whole place smells like home now. "+by)}
  else if(id==="roses"){await R.say("ANAMIKA","Don't make a face. They're just roses.");await R.say("SREEDEV","Roses. …I forgot how to talk for a second. "+by)}
  else if(id==="choc"){await R.say("ANAMIKA","Dark chocolate. Sea salt. Don't eat it all.");await R.say("SREEDEV","Half is mine. The other half is… also mine.")}
  else if(id==="shell"){await R.say("ANAMIKA","I found it earlier. It's for you.");await R.say("SREEDEV","A shell from St. Andrews. It's going on my desk. Next to the crown.")}
  else if(id==="note"){const nt=pickR(NOTES);S_.noteText=nt;await R.p(revealCard("💌","Her handwriting","“"+nt+"”"));await R.say("SREEDEV","I'm keeping this. In the drawer, under the nameplate.")}
  else if(id==="box"){const sp=pickR(SURPRISES);S_.surprise=sp.n;await R.say("ANAMIKA","Open it. No peeking first.");A.sfx("gift");await R.p(revealCard(sp.e,sp.n,sp.l));await R.say("SREEDEV",sp.l.replace("Nothing on at 6:30. Just saying.","You are impossible. I love it."))}
  dev.hold=null;
}

/* ---------- Sreedev's random flowers (about half the chapters) ---------- */
const FLOWER_ITEMS=[{h:"flowers",n:"red roses",l:["Here. Don't ask. They were just… there.","These are for you. Please don't make a face."]},{h:"jasmine",n:"a jasmine garland",l:["Mulla poo. I bought it before I could talk myself out of it.","I walked past a flower stall. I walked back."]},{h:"flowers",n:"a bunch of marigolds",l:["The pantry vase had these. I'm telling you they were for you.","Marigolds. They match your mood. Sunny, mostly."]}];
const FLOWER_REPLY=["Where did you even get these?","Sreedev. …Thank you.","Obviously I'm keeping them.","You are very strange. I like it.","Put them down before you drop them. Wait, no. Give."];
async function flowerMoment(R,ch){
  if(!G.flowerPlan||!G.flowerPlan[ch])return;
  const sc=G.scene;if(!sc||!sc.dev||!sc.sree)return;
  const it=pickR(FLOWER_ITEMS),S_=G.state;
  sc.sree.hold=it.h;A.sfx("gift");
  await R.say("SREEDEV",pickR(it.l));
  sc.sree.hold=null;sc.dev.hold=it.h;A.sfx("heart");const ax=sc.dev.bx||640,ay=(sc.dev.by||320)+10;Art.burst(ax,ay,"petal",14);Art.burst(ax,ay,"heart",8);
  G.toast("🌹 Sreedev gave you "+it.n);S_.flowers++;
  await R.say("ANAMIKA",pickR(FLOWER_REPLY));
  sc.dev.hold=null;
}
function skipBtn(fn){clearSkip();const b=document.createElement("button");b.className="btn";b.id="skipb";b.textContent="Skip ▶";b.style.cssText="position:absolute;right:calc(var(--u)*30);top:calc(var(--u)*100);pointer-events:auto";b.onclick=()=>{clearSkip();fn()};$("mini").appendChild(b)}
function clearSkip(){const b=$("skipb");if(b)b.remove()}

/* =====================================================================
   CHAPTERS
   ===================================================================== */
async function ch1(R){
  G.setTime(10,30);
  await R.card("Chapter 1","Black Tea","10:30 AM · the office in Nila");
  await R.go(S.Office,{spawn:SEAT(),control:false,ch:1,title:"Black Tea"});const Of=O();
  await R.nar("Objective: make black tea for Sreedev.");
  // cup shelf
  await goal(R,{x:166,y:236,r:24,label:"Objective: the pantry. Reach the cup shelf"});
  for(;;){const c=DEV?DEV_CUP.shift()||"b":await R.p(cupPanel());
    if(c==="b")break;await R.say("ANAMIKA","Too small. He drinks a lot of tea.")}
  await R.say("ANAMIKA","One cup. The big one. He drinks a lot of tea.");
  Of.pr.cup="big";A.sfx("clink");
  // kettle
  await goal(R,{x:166,y:296,r:22,label:"Next: the kettle"});
  await R.p(boilPanel());
  await R.nar("Click. … Bubbling!");
  // tea caddy
  await goal(R,{x:166,y:408,r:22,label:"Next: the tea caddy"});
  const seq=DEV?["milk","sugar","bag"]:null;
  for(;;){
    const ing=DEV?seq.shift():await R.p(caddyPanel());
    if(ing==="milk")await R.say("ANAMIKA","Milk? No. He'd give me that look. Black tea.");
    else if(ing==="sugar")await R.say("ANAMIKA","Sugar? Not for him. Black. Tea.");
    else{await R.say("ANAMIKA","Black tea. Nothing else. Just how he likes it.");break}
  }
  Of.pr.water=1;A.sfx("pour");await R.wait(900);Of.pr.tea=1;A.sfx("clink");await R.wait(500);
  Of.dev.hold="cup";Of.pr.cup=null;Of.pr.tea=0;Of.pr.water=0;
  await R.nar("She takes it to Sreedev's desk in Bay 3.");
  await goal(R,{x:582,y:502,r:20,label:"Take the tea to Sreedev in Bay 3"});
  Of.dev.hold=null;Of.pr.deskCup=true;A.sfx("clink");Of.dev.face=0;
  await R.say("SREEDEV","Black tea! You're the best.");
  await R.say("ANAMIKA","Obviously.");
}
async function ch2(R){
  G.setTime(10,58);
  if(G.scene!==S.Office){await R.go(S.Office,{spawn:SEAT(),ch:2,title:"The Watch"})}
  O().pr.deskCup=true;
  await R.card("Chapter 2","The Watch","11:00 AM");G.chapter(2,"The Watch");
  await R.p(G.runTime(660,900));
  G.bubble(O().sree,"*types*",2600);
  await R.nar("11:00 AM. Your watch buzzes.");
  A.sfx("buzz");G.shake=.6;
  await R.p(watchGame());
  G.bubble(O().sree,"Haha!",1400);
  await R.say("SREEDEV","Haha. I see you. Back to work, both of us.");
  await R.nar("The morning slips by…");
  await R.p(G.runTime(750,1600));
}
async function ch3(R){
  await R.card("Chapter 3","Lunch?","12:30 PM");G.chapter(3,"Lunch?");G.setTime(12,30);
  if(G.scene!==S.Office)await R.go(S.Office,{spawn:SEAT(),ch:3,title:"Lunch?"});
  const Of=O(),N=Of.navya,Sr=Of.sree;
  N.vis=true;N.x=1010;N.y=430;
  await actorTo(R,N,566,462,86);
  G.bubble(N,"Lunch?",2400);
  await R.say("NAVYA","Lunch? I'm starving.");
  await R.say("ANAMIKA","Sreedev, lunch?");
  await R.say("SREEDEV","Two minutes. Just this one thing.");
  const beats=[[758,"Just pushing this commit…","NAVYA","He said two minutes eight minutes ago."],[765,"The build is running, wait wait.","ANAMIKA","Sreedev!"],[772,"One last bug. Promise.","NAVYA","I'm going to eat my keyboard."],[778,"Saving… saving… saved!","ANAMIKA","Finally?"]];
  for(const [m,bub,who,line] of beats){await R.p(G.runTime(m,650));G.bubble(Sr,bub,3000);await R.wait(900);await R.say(who,line)}
  await R.p(G.runTime(780,500));
  await R.nar("1:00 PM.");
  await R.say("SREEDEV","Okay, okay, let's go! Suda Suda?");
  await R.say("NAVYA","I'm going ahead. You two take your time. Clearly.");
  // Navya heads for the lift by reception; Sreedev follows her; Anamika follows both
  const nv=actorTo(R,N,1052,568,95);await R.wait(700);
  Sr.seat=false;const sv=actorTo(R,Sr,1052,572,86);await R.wait(500);
  await walkTo(R,1040,566,90);
  await R.p(Promise.all([nv,sv]));
}
async function ch4(R){
  const S_=G.state;
  await R.card("Chapter 4","Suda Suda","1:00 PM · the canteen in Nila");G.chapter(4,"Suda Suda");
  await R.nar("They take the lift by reception down to the canteen atrium. Suda Suda is one of the four kiosks.");
  await liftCut(R);
  await G.go(S.Atrium,{ch:4,title:"Suda Suda",fade:700});
  const T=S.Atrium;T.navya.vis=true;T.navya.x=190;T.navya.y=540;T.dev.x=182;T.dev.y=560;T.sree.x=158;T.sree.y=548;
  if(DEV){T.navya.x=480;T.navya.y=222;T.dev.x=442;T.dev.y=326;T.sree.x=444;T.sree.y=352}
  else{
    T.walkRoute(T.navya,[[300,540],[300,420],[460,420],[490,300],[480,222]],{speed:110});await R.wait(500);
    const dv=T.walkRoute(T.dev,[[300,556],[300,430],[450,424],[442,326]],{speed:84});await R.wait(500);
    const sv=T.walkRoute(T.sree,[[300,550],[300,424],[452,420],[444,352]],{speed:84});await R.p(Promise.all([dv,sv]));
  }
  T.dev.face=Math.PI;T.sree.face=Math.PI;T.dev.pose="stand";T.sree.pose="stand";
  await R.say("ANAMIKA","Fried rice, noodles or biriyani?");
  await R.say("SREEDEV","Hmm. Let me think.");
  G.hideDlg();
  const r=await R.p(lunchGame());S_.dish=r.dish;S_.changes=r.n;
  await R.say("SREEDEV",`${r.dish}. Final answer. Locking it in.`);
  await R.say("ANAMIKA",`That took ${r.n} changes of mind. A new record.`);
  await R.nar("Lunch at Suda Suda. Worth the wait. Mostly.");
  await R.say("SREEDEV","Okay, I need to walk this off. Rounds around Nila?");
}
async function ch5(R){
  G.setTime(14,15);await R.card("Chapter 5","Three Rounds of Nila","About 2:15 PM");G.chapter(5,"Three Rounds of Nila");
  await R.go(S.Loop);
  G.bubble(S.Loop.sree,"Three rounds. Let's go!",3000);await R.wait(800);
  const lines=["One down!","Two! My legs have opinions.","Three! Lunch officially cancelled out."];
  const run=S.Loop.run(l=>{G.bubble(S.Loop.sree,lines[l-1],2800)});
  if(DEV)S.Loop.devFinish();
  await R.p(run);await R.wait(500);
  await R.say("SREEDEV","Three rounds around Nila. Done!");
  await R.say("ANAMIKA","You were slower than me.");
  await R.say("SREEDEV","I was pacing myself. Strategically. Back to the office?");
}
async function ch6(R){
  const S_=G.state;
  G.setTime(16,0);await R.card("Chapter 6","Tea Time","4:00 PM");G.chapter(6,"Tea Time");
  await R.go(S.Office,{spawn:SEAT(),ch:6,title:"Tea Time"});const Of=O();Of.pr.deskCup=false;
  await R.nar("Back at the desk. The afternoon crawls.");
  await R.say("SREEDEV","Tea time! Come on, let's go downstairs and have tea. Pleeease?");
  await R.say("ANAMIKA","Hmm. Let me think about it.");
  await R.say("SREEDEV","…Is that a yes?");
  await R.say("ANAMIKA","It's a \"later\".");
  const c=await R.choose("It's 4:00 PM. Sreedev wants tea downstairs.",[{t:"Go now",s:"“Fine. Suda Suda. Up. Walk.”"},{t:"Take her own sweet time",s:"tidy up, check Instagram, keep him waiting"}]);
  if(c===1){
    S_.teaMode="wait";await R.p(slowTea());S_.teaMin=25;G.time=16*60+25;
    await R.say("SREEDEV","It's 4:25. I asked at 4:00.");
    await R.say("ANAMIKA","Good things take time.");
  }else{
    S_.teaMode="now";S_.teaMin=0;
    await R.say("ANAMIKA","Fine. Suda Suda. Up. Walk.");
    await R.say("SREEDEV","Yes! A tea expedition.");G.time=16*60+15;
  }
  await liftCut(R);
  await G.go(S.Atrium,{ch:6,title:"Tea Time",fade:700});
  const T=S.Atrium;T.dev.x=182;T.dev.y=560;T.sree.x=158;T.sree.y=548;
  if(DEV){T.dev.x=442;T.dev.y=326;T.sree.x=444;T.sree.y=352}
  else{const dv=T.walkRoute(T.dev,[[300,556],[300,430],[450,424],[442,326]],{speed:90});await R.wait(400);const sv=T.walkRoute(T.sree,[[300,550],[300,424],[452,420],[444,352]],{speed:90});await R.p(Promise.all([dv,sv]))}
  T.dev.face=Math.PI;T.sree.face=Math.PI;
  await R.say("VENDOR","Two teas. Black for him, no sugar. I remember.");
  await R.say("ANAMIKA","…Of course you do.");
  A.sfx("clink");T.dev.hold="tea";T.sree.hold="tea";
  await R.say("SREEDEV",c===1?"…Okay, this is very good tea. Worth the wait.":"Suda Suda knows me better than HR does.");
  T.dev.hold=null;T.sree.hold=null;
  await R.nar("The afternoon disappears into work.");
}
async function ch7(R){
  const S_=G.state;
  G.setTime(18,30);await R.card("Chapter 7","Six Thirty","6:30 PM");G.chapter(7,"Six Thirty");
  await R.go(S.Office,{spawn:SEAT(),ch:7,title:"Six Thirty"});const Of=O();
  await R.nar("6:30 PM.");
  await R.say("ANAMIKA","It's 6:30! Let's go.");
  await R.say("SREEDEV","I have some work… thirty more minutes?");
  G.bubble(Of.dev,"!!",1800);
  await R.say("ANAMIKA","Sreedev!! You said that yesterday.");
  await R.nar("She's annoyed. What now?");
  const c=await R.choose("What now?",[{t:"Go to the balcony",s:"\"Fine. I'll be on the balcony.\""},{t:"Stay and urge him to finish",s:"Press “Let's gooo” fifteen times"},{t:"Wait while he completes his work",s:"\"Fine. I'll wait.\""}]);
  if(c===0){
    S_.six30="balcony";
    await R.say("ANAMIKA","Fine. I'll be on the balcony.");
    Of.minY=-150;
    await walkTo(R,612,92,100);
    await R.nar("She walks to the balcony railing. The Technopark lights come on, one building at a time.");
    G.time=18*60+40;
    await R.p(Of.lightsOn());await R.wait(600);
    Of.sree.seat=false;
    if(DEV){Of.sree.x=560;Of.sree.y=92}else await R.p(Of.walkActor(Of.sree,570,92,70));
    Of.sree.face=0;Of.dev.face=Math.PI;
    await R.say("SREEDEV","Okay, okay. Laptop's closed. I'm all yours.");
    await R.say("ANAMIKA","Hmph. …Fine.");
    await giftMoment(R,"balcony");
  }else if(c===1){
    S_.six30="urge";await R.p(urgeGame());
    await R.say("SREEDEV","Done! Done. Laptop closed. Let's go.");
  }else{
    S_.six30="wait";
    await R.say("ANAMIKA","Fine. I'll wait.");
    await R.p(waitGame());
    await R.say("SREEDEV","Done! Sorry, sorry. Thank you for waiting.");
  }
}
async function ch8(R){
  const S_=G.state;
  G.setTime(19,30);await R.card("Chapter 8","Seven Thirty","7:30 PM");G.chapter(8,"Seven Thirty");
  await R.go(S.Office,{spawn:SEAT(),ch:8,title:"Seven Thirty"});
  const first={balcony:"Sorry for the balcony exile. Dinner's on me.",urge:"You win. Fifteen 'let's go's is a new record.",wait:"You waited a whole hour. You pick tonight."}[S_.six30];
  await R.say("SREEDEV",first);
  await R.nar("7:30 PM. Where to?");
  const c=await R.choose("Where to?",[{t:"Istanbul (Rolls & Grills)",s:"smoke, spice, and al faham"},{t:"Saint Andrews Beach",s:"6.1 km away, with the sea at night"},{t:"Waffles",s:"dessert for dinner"}]);
  if(c===0){S_.place="istanbul";await R.say("SREEDEV","Istanbul it is. Al faham, extra mayo.")}
  else if(c===1){S_.place="beach";await R.say("SREEDEV","St. Andrews? At night? …Yes. Let's go.")}
  else{S_.place="waffles";await R.say("SREEDEV","Waffles. Dessert for dinner. Respect.")}
  await R.say("SREEDEV","The bike's in the parking. Come on.");
  await R.go(S.Parking);const Pk=S.Parking;
  if(!DEV){S.goTo(Pk.sree,560,372,{speed:70});await S.goTo(Pk.dev,560,436,{speed:70});await R.wait(300)}else{Pk.sree.x=560;Pk.sree.y=372;Pk.dev.x=560;Pk.dev.y=436}
  Pk.sree.face=Math.PI/2;Pk.dev.face=-Math.PI/2;
  await R.nar("At the CB300R.");
  await R.say("SREEDEV","Helmet on. Hold tight.");
  await R.p(Pk.helmets());
}
async function rideTo(R,route,tFrom,tTo){
  await R.go(S.Ride,{route,night:true,tFrom,tTo,fade:600});
  const p=S.Ride.run();if(DEV)S.Ride.devFinish();
  await R.p(p);
}
async function ch9(R){
  const S_=G.state;
  G.setTime(19,35);await R.card("Chapter 9","The Ride","7:35 PM");G.chapter(9,"The Ride");
  const place=S_.place;
  await rideTo(R,S.ROUTES[place],19*60+35,place==="beach"?20*60+5:19*60+55);
  if(place==="beach")await beachScene(R);else await restaurantScene(R,place);
  await R.say("SREEDEV","It's getting late. Bike?");
  await R.say("SREEDEV","Okay. Let's get you to the visitors' area.");
  await R.nar("They ride back to Technopark Phase 1.");
  const back=S.reverseRoute(S.ROUTES[place],"Back to Technopark Phase 1","Technopark Phase 1 · Visitors' Area");
  await rideTo(R,back,place==="beach"?21*60:20*60+50,21*60+15);
}
const SWEET=[["Say something sweet","“I'm glad it's you on this bench.”","SREEDEV","I'm glad it's you on this bench.","ANAMIKA","…That was actually nice. Keep going."],["Say something sweet","“Can we come here again?”","SREEDEV","Can we come here again? Not for any reason. Just to sit.","ANAMIKA","Yes. Obviously yes."]];
const HYPO=[["Ask a hypothetical question","“Hypothetically, if a giant crab…”","SREEDEV","Hypothetically, if a giant crab walked out of the sea right now, whose leg would you throw first? Yours or mine?","ANAMIKA","…And the mood is gone. Thank you, Sreedev."],["Ask a hypothetical question","“If I disappeared tomorrow…”","SREEDEV","Hypothetically, if I disappeared tomorrow, how long before you noticed? Before the tea ran out?","ANAMIKA","Three minutes. It's a short tea."]];
const COMPLAIN=[["Complain about something","the sand, the wind, anything","SREEDEV","There is sand in my shoes. I can feel it in my soul.","ANAMIKA","We are on a beach. That is what a beach is."],["Complain about something","the humidity","SREEDEV","Why is it so humid? My hair has given up and so have I.","ANAMIKA","Your hair gave up at 10:30 this morning."]];
async function sitTalk(R,round){
  const S_=G.state;
  const c=await R.choose(round===0?"The waves are loud. What do you say?":"A quiet minute. What now?",[{t:SWEET[round][0],s:SWEET[round][1]},{t:HYPO[round][0],s:HYPO[round][1]},{t:COMPLAIN[round][0],s:COMPLAIN[round][1]}]);
  const row=[SWEET,HYPO,COMPLAIN][c][round];
  await R.say(row[2],row[3]);await R.say(row[4],row[5]);
  if(c===0){S_.mood+=2;Art.burst(640,300,"heart",8);A.sfx("heart")}else if(c===1){S_.mood-=2;A.sfx("wrong")}else{S_.mood-=1}
  return c;
}
async function beachScene(R){
  const S_=G.state;G.setTime(20,5);
  await R.go(S.Beach,{fade:700});const B=S.Beach;
  await R.nar("Saint Andrews Beach. Waves in the dark, the church behind, salt in the air.");
  await R.say("SREEDEV","Worth the ride?");
  await R.say("ANAMIKA","Worth the whole day.");
  await R.nar("Walk along the shore to the old bench.");
  if(!DEV)await R.p(B.walkTo(0));else{B.dev.x=B.stations[0];B.sree.x=B.stations[0]-34}
  G.time=20*60+15;
  await R.nar("A stray dog trots out of the dark, tail swinging.");
  B.dog.tx=700;await R.p(new Promise(r=>{if(DEV){B.dog.x=700;B.dog.tx=null;r();return}B.dogCb=r}));
  B.dev.face=0;S_.pet=false;A.sfx("whoosh");
  await R.say("ANAMIKA","Dog! DOG! Sreedev, there's a DOG!");
  if(!DEV){S.goTo(B.sree,B.dev.x-30,B.dev.y,{speed:50});}
  await R.say("SREEDEV","I see it. I'm calm. I am extremely calm.");
  await R.say("ANAMIKA","Why are you behind me?!");
  await R.say("SREEDEV","Tactical positioning.");
  B.dog.tx=1250;await R.wait(DEV?10:1200);
  await R.say("ANAMIKA","It's leaving. …It just wanted to be friends.");
  await R.say("SREEDEV","It can be friends from over there.");
  if(!DEV)await R.p(B.walkTo(1));else{B.dev.x=B.stations[1];B.sree.x=B.stations[1]-34}
  G.time=20*60+30;
  const bx=B.stations[1]+60;B.dev.x=bx-12;B.dev.y=444;B.sree.x=bx+12;B.sree.y=444;B.dev.face=-Math.PI/2;B.sree.face=-Math.PI/2;B.dev.seat=true;B.sree.seat=true;B.sitting=true;B.dev.pose="stand";B.sree.pose="stand";
  await R.nar("They sit on the bench. Mostly, that is the whole plan. Sitting, and talking, and nothing else.");
  await R.say("ANAMIKA","So. Say something.");
  await sitTalk(R,0);
  G.time=20*60+42;
  await R.say("SREEDEV","…Right. Anyway.");
  await sitTalk(R,1);
  await giftMoment(R,"beach");
  G.time=20*60+55;
  await R.nar("A thin white mist is sliding in from the sea.");
  B.fogOn=true;await R.wait(DEV?10:2500);
  await R.say("ANAMIKA","Sreedev. Is that fog?");
  await R.say("SREEDEV","Nope. Not looking at it. We are both afraid of fog. Leaving.");
  await R.say("ANAMIKA","Bike. Now. You first.");
  B.sitting=false;B.dev.seat=false;B.sree.seat=false;
}
async function restaurantScene(R,kind){
  G.setTime(19,58);
  await R.go(S.Restaurant,{kind,fade:700});
  if(kind==="istanbul"){
    await R.nar("Istanbul Rolls & Grills. Smoke, spice, and a table by the wall.");
    await R.say("SREEDEV","Al faham, kuboos, extra mayonnaise.");
    await R.say("ANAMIKA","You decided that in two seconds. Where was this at lunch?");
    await R.say("SREEDEV","Dinner is easy. Lunch is complicated.");
  }else{
    await R.nar("Waffles. Warm, sweet, and a corner booth.");
    await R.say("SREEDEV","One with extra chocolate. And one… also with extra chocolate.");
    await R.say("ANAMIKA","You took longer to choose lunch than this.");
    await R.say("SREEDEV","Because waffles are easy. Lunch is a life decision.");
  }
  G.time=20*60+40;
  await R.say("ANAMIKA","Okay. Be honest. Was today a good day?");
  await R.say("SREEDEV","The tea, the laps, the waiting… yes. Obviously yes.");
  await giftMoment(R,"restaurant");
}
async function ch10(R){
  const S_=G.state;
  G.setTime(21,15);await R.card("Chapter 10","Visitors' Area","9:15 PM");G.chapter(10,"Visitors' Area");
  await R.go(S.Visitors);const V=S.Visitors;
  await R.nar("9:15 PM. Technopark Phase 1, visitors' area.");
  await R.say("SREEDEV","Message me when you reach.");
  await R.say("ANAMIKA","I will.");
  await R.nar("Her brother Sidhu's Mahindra BE 6 pulls up.");
  await R.p(V.arrive());
  V.bro.vis=true;V.bro.x=760;V.bro.y=540;V.doorGlow=1;A.sfx("door");
  if(!DEV)await S.goTo(V.bro,640,370,{speed:60});else{V.bro.x=640;V.bro.y=370}
  G.bubble(V.bro,"Ready?",2600);
  await R.say("SIDHU","Ready? Amma's waiting.");
  await giftMoment(R,"visitors");
  if(S_.gifts.length){V.sree.hold="cup";await R.say("SREEDEV","Wait. One thing for the road.");await R.say("SREEDEV","A flask of black tea. No sugar. Don't tell Suda Suda I made it.");V.sree.hold=null;await R.say("ANAMIKA","…You're the worst. Thank you.")}
  await R.say("SREEDEV","See you tomorrow. Same tea?");
  await R.say("ANAMIKA","Black. No sugar. I know.");
  G.bubble(V.sree,"Bye!",2200);
  if(!DEV){S.goTo(V.bro,760,540,{speed:60});await S.goTo(V.dev,760,540,{speed:70})}
  V.doorGlow=1.4;A.sfx("door");V.dev.vis=false;await R.wait(500);V.bro.vis=false;await R.wait(500);
  V.leaving=true;V.carV=40;A.sfx("whoosh");await R.wait(2800);
  G.bubble(V.sree,"…",4200);await R.wait(3200);
}
function summary(){
  const S_=G.state;
  const place={beach:"Saint Andrews Beach",istanbul:"Istanbul Rolls & Grills",waffles:"Waffles"}[S_.place];
  const six={balcony:"The balcony, and the lights",urge:"Fifteen 'let's go's",wait:"Waited until 7:28"}[S_.six30];
  const gn={jasmine:"jasmine garland",roses:"red roses",box:"a surprise box"+(S_.surprise?` (${S_.surprise})`:""),note:"a handwritten note"+(S_.noteText?` — “${S_.noteText}”`:""),choc:"dark chocolate",shell:"a seashell"};
  return[["Tea","Black. Nothing else. Just how he likes it."],["The watch",`Replied in ${S_.watchTries} ${S_.watchTries===1?"try":"tries"}`],["Lunch",`${S_.dish}, after ${S_.changes} changes of mind`],["Three rounds","Done. He was slower."],
    ["Tea time",S_.teaMode==="wait"?`Made him wait ${S_.teaMin} minutes${S_.insta?" (after a peek at Instagram)":""}`:"Went downstairs at once"],["At 6:30",six],["Evening",place],
    ["Flowers from Sreedev",S_.flowers?S_.flowers+(S_.flowers===1?" bunch":" bunches"):"None this time"],["Beach mood",S_.mood>=3?"Romantic":S_.mood>=0?"Pleasant":"Ruined, mostly by Sreedev"],["Gifts",S_.gifts.length?S_.gifts.map(g=>gn[g]).join(", "):"None this time"],["Extras","afraid of dogs and fog, both of them"]];
}

/* =====================================================================
   RUN / MENU / BOOT
   ===================================================================== */
const CH=[ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8,ch9,ch10];
const NAMES=["Black Tea","The Watch","Lunch?","Suda Suda","Three Rounds of Nila","Tea Time","Six Thirty","Seven Thirty","The Ride","Visitors' Area"];
function resetUI(){G.hideDlg();clearMini();$("choices").classList.remove("on");G.hint("");G.clearBubbles();G.paused=false;const mm=document.getElementById("menuPanel");if(mm)mm.remove();A.engine(null);G.fade=0;G.fadeTo=0}
G.begin=async function(from,fresh){
  TOKEN++;const tk=TOKEN,R=runner(tk);
  if(fresh||from===1)G.state=G.fresh();else if(!G.state)G.state=G.fresh();
  resetUI();G.showClock=true;
  G.flowerPlan={};for(const c of [1,2,3,4,5,6,7,10])G.flowerPlan[c]=Math.random()<.5;
  try{
    for(let i=from;i<=10;i++){
      await CH[i-1](R);if(tk!==TOKEN)return;await flowerMoment(R,i);if(tk!==TOKEN)return;resetUI();
      try{localStorage.setItem("oct7_max",Math.max(+localStorage.getItem("oct7_max")||0,i))}catch(e){}
    }
    resetUI();await G.go(S.Ending,{sum:summary(),fade:900});window.__done=true;
  }catch(e){console.error(e);window.__err=String(e&&e.stack||e)}
};
G.toTitle=async function(){TOKEN++;resetUI();await G.go(S.Title,{fade:500})};
G.openMenu=function(){
  if(document.getElementById("menuPanel")){document.getElementById("menuPanel").remove();G.paused=false;return}
  G.paused=true;
  const p=panel(`<h3>Menu</h3><div class="grid" style="grid-template-columns:1fr 1fr"><button class="btn p" id="mmR">Resume</button><button class="btn" id="mmT">Title screen</button></div><p style="margin-top:calc(var(--u)*14);color:#9aa3b5">Jump to a chapter</p>
    <div class="grid" style="grid-template-columns:1fr 1fr">${NAMES.map((n,i)=>`<button class="btn" data-c="${i+1}" style="font-size:calc(var(--u)*17)">${i+1}. ${n}</button>`).join("")}</div>`,CENTER+";width:calc(var(--u)*640);z-index:5","menuPanel");
  $("mmR").onclick=()=>{p.remove();G.paused=false};$("mmT").onclick=()=>{p.remove();G.paused=false;G.toTitle()};
  p.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{p.remove();G.paused=false;A.sfx("click");G.begin(+b.dataset.c)});
};

G.start();
const sc=q.get("scene"),T={title:S.Title,office:S.Office,atrium:S.Atrium,loop:S.Loop,parking:S.Parking,beach:S.Beach,visitors:S.Visitors,ending:S.Ending};
if(q.get("play")||DEV&&q.get("auto")||q.get("ch")){G.go(S.Title,{fade:0}).then(()=>G.begin(+(q.get("ch")||1)))}
else if(sc==="istanbul"||sc==="waffles")G.go(S.Restaurant,{fade:0,kind:sc});
else if(sc==="ride"){G.go(S.Ride,{fade:0,route:S.ROUTES.beach});S.Ride.started=true;S.Ride.x=+(q.get("x")||0);G.time=1170}
else if(sc==="ending")G.go(S.Ending,{fade:0,sum:summary()});
else G.go(T[sc]||S.Title,{fade:0,spawn:[+(q.get("sx")||700),+(q.get("sy")||330)]});
window.G=G;
})();
