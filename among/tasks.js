/* ================= TASKS: the little task screens, like the originals (DOM) — each returns Promise<boolean> ================= */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const beep=(f,d=.1,type="triangle",v=.05,s)=>window.AUDIO&&AUDIO.tone(f,d,type,v,s);
const FAST=/[?&]fast=1/.test(location.search);

/* ---- shell: modal with title, close, body; resolves true on win, false on close ---- */
function run(title,sub,build){
  return new Promise(res=>{
    const m=$("tm");m.innerHTML=`<div class="tm-box"><div class="tm-bar"><b>${title}</b><button class="tm-x" id="tmx">✕</button></div><div class="tm-sub">${sub||""}</div><div id="tmb"></div></div>`;
    m.classList.add("on");let done=false;
    const fin=ok=>{if(done)return;done=true;if(cleanup)cleanup();m.classList.remove("on");m.innerHTML="";res(ok)};
    $("tmx").onclick=()=>fin(false);window.__tmAuto=null;
    const cleanup=build($("tmb"),()=>{beep(880,.14);beep(1320,.2,"triangle",.05);setTimeout(()=>fin(true),FAST?10:500)});
    if(window.__AUTOTASK&&window.__tmAuto)setTimeout(()=>window.__tmAuto(fin),20);
  });
}
const done=(ok)=>ok;

/* ---- 1. hold to fill (tea, plants, serving) ---- */
function hold(title,sub,label){
  return run(title,sub||"Hold the button and release inside the green zone.",(b,win)=>{
    b.innerHTML=`<div class="tm-meter"><div class="tm-zone" style="left:68%;width:24%"></div><i id="hfill"></i></div><button class="tm-btn big" id="hbtn">${label||"HOLD"}</button><div class="tm-msg" id="hmsg"></div>`;
    let down=false,v=0,raf,last=performance.now();
    const loop=n=>{const dt=(n-last)/1000;last=n;if(down){v=Math.min(1,v+dt*.45)}$("hfill").style.width=(v*100)+"%";raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
    const dn=e=>{down=true;v=0;$("hmsg").textContent="";e.preventDefault()};
    const up=()=>{if(!down)return;down=false;if(v>=.68&&v<=.92){win()}else{$("hmsg").textContent=v<.68?"Not enough. Try again.":"Too much! Spilled. Try again.";beep(180,.2,"sawtooth");v=0}};
    $("hbtn").addEventListener("pointerdown",dn);addEventListener("pointerup",up);
    window.__tmAuto=fin=>{setTimeout(()=>{v=.8;down=true;up()},30)};
    return()=>{cancelAnimationFrame(raf);removeEventListener("pointerup",up)};
  });
}

/* ---- 2. wires ---- */
function wires(){
  return run("Rewire the server","Connect each coloured cable to its matching port.",(b,win)=>{
    const cols=["#e53935","#1e88e5","#fdd835","#43a047"],right=shuffle([0,1,2,3]);let sel=null,n=0;
    b.innerHTML=`<div class="wires"><svg id="wsvg" viewBox="0 0 300 220"></svg>${cols.map((c,i)=>`<button class="wp l" style="top:${14+i*50}px;background:${c}" data-i="${i}"></button>`).join("")}${right.map((c,i)=>`<button class="wp r" style="top:${14+i*50}px;background:${cols[c]}" data-c="${c}" data-slot="${i}"></button>`).join("")}</div><div class="tm-msg" id="wmsg"></div>`;
    const svg=$("wsvg");
    b.querySelectorAll(".wp.l").forEach(x=>x.onclick=()=>{if(x.dataset.done)return;sel=+x.dataset.i;b.querySelectorAll(".wp.l").forEach(y=>y.classList.remove("sel"));x.classList.add("sel");beep(500,.06)});
    b.querySelectorAll(".wp.r").forEach(x=>x.onclick=()=>{if(sel==null||x.dataset.done)return;
      if(+x.dataset.c===sel){x.dataset.done=1;const l=b.querySelector(`.wp.l[data-i="${sel}"]`);l.dataset.done=1;l.classList.remove("sel");
        svg.insertAdjacentHTML("beforeend",`<line x1="26" y1="${14+sel*50+18}" x2="274" y2="${14+(+x.dataset.slot)*50+18}" stroke="${cols[sel]}" stroke-width="9" stroke-linecap="round"/>`);sel=null;n++;beep(700+n*120,.1);if(n===4)win()}
      else{$("wmsg").textContent="Wrong port!";beep(180,.15,"sawtooth");sel=null;b.querySelectorAll(".wp.l").forEach(y=>y.classList.remove("sel"))}});
    window.__tmAuto=()=>{for(let i=0;i<4;i++){b.querySelector(`.wp.l[data-i="${i}"]`).click();b.querySelector(`.wp.r[data-c="${i}"]`).click()}};
  });
}

/* ---- 3. swipe the client card ---- */
function swipe(){
  return run("Send the invoice","Swipe the client's card through the reader. Not too fast, not too slow.",(b,win)=>{
    b.innerHTML=`<div class="swipe"><div class="reader"><div class="light" id="slight"></div></div><div class="card" id="scard"><span>CLIENT</span><i></i></div></div><div class="tm-msg" id="smsg">Drag the card to the right.</div>`;
    const card=$("scard"),track=card.parentElement;let sx=0,t0=0,drag=false;
    card.addEventListener("pointerdown",e=>{drag=true;sx=e.clientX;t0=performance.now();card.setPointerCapture(e.pointerId)});
    card.addEventListener("pointermove",e=>{if(!drag)return;const w=track.clientWidth-card.clientWidth;card.style.left=Math.max(0,Math.min(w,e.clientX-sx))+"px"});
    card.addEventListener("pointerup",e=>{drag=false;const w=track.clientWidth-card.clientWidth,x=parseFloat(card.style.left||0),dt=performance.now()-t0;
      if(x<w*.92){$("smsg").textContent="Swipe all the way.";card.style.left="0px";return}
      if(dt<420){$("smsg").textContent="Too fast. Try again.";$("slight").style.background="#e53935";beep(180,.2,"sawtooth")}
      else if(dt>1500){$("smsg").textContent="Too slow. Try again.";$("slight").style.background="#e53935";beep(180,.2,"sawtooth")}
      else{$("smsg").textContent="Accepted. Invoice sent!";$("slight").style.background="#43a047";win();return}
      card.style.left="0px"});
    window.__tmAuto=()=>{$("scard").style.left="9999px";$("smsg").textContent="";$("slight").style.background="#43a047";win()};
  });
}

/* ---- 4. memorise the vault password (Simon) ---- */
function simon(){
  return run("Vault password","Watch the sequence, then repeat it.",(b,win)=>{
    const cols=["#e53935","#1e88e5","#fdd835","#43a047"],notes=[392,523,659,784];let seq=[],step=0,accept=false,dead=false;
    b.innerHTML=`<div class="simon">${cols.map((c,i)=>`<button class="sp" data-i="${i}" style="background:${c}"></button>`).join("")}</div><div class="tm-msg" id="smsg2">Watch…</div>`;
    const pads=[...b.querySelectorAll(".sp")];
    const flash=i=>{pads[i].classList.add("on");beep(notes[i],.25,"sine");setTimeout(()=>pads[i].classList.remove("on"),FAST?10:320)};
    const play=async()=>{accept=false;$("smsg2").textContent="Watch…";await new Promise(r=>setTimeout(r,FAST?5:600));for(const i of seq){if(dead)return;flash(i);await new Promise(r=>setTimeout(r,FAST?5:520))}accept=true;step=0;$("smsg2").textContent="Your turn!"};
    seq=Array.from({length:5},()=>RI(0,3));play();
    pads.forEach(p=>p.onclick=()=>{if(!accept)return;const i=+p.dataset.i;flash(i);
      if(i!==seq[step]){$("smsg2").textContent="Wrong! Watch again.";beep(180,.3,"sawtooth");play();return}
      step++;if(step===seq.length){accept=false;win()}});
    window.__tmAuto=()=>{accept=true;step=0;seq.forEach(i=>pads[i].click())};
    return()=>{dead=true};
  });
}

/* ---- 5. squash the bugs ---- */
function squash(){
  return run("Squash the bugs","Click every bug before it hides in the code.",(b,win)=>{
    b.innerHTML=`<div class="bugs" id="bugs"></div><div class="tm-msg" id="bmsg">0 / 7</div>`;let n=0;
    const box=$("bugs");
    for(let i=0;i<7;i++){const e=document.createElement("button");e.className="bug";e.textContent="🐞";e.style.left=R(4,88)+"%";e.style.top=R(4,82)+"%";box.appendChild(e);
      const tm=setInterval(()=>{if(!e.isConnected){clearInterval(tm);return}e.style.left=R(4,88)+"%";e.style.top=R(4,82)+"%"},FAST?200:R(900,1500));
      e.onclick=()=>{e.remove();n++;$("bmsg").textContent=n+" / 7";beep(500+n*80,.06);if(n===7)win()}}
    window.__tmAuto=()=>box.querySelectorAll(".bug").forEach(x=>x.click());
  });
}

/* ---- 6. take the client's call: enter the code ---- */
function keypad(){
  return run("Client call","Type the code the client reads out.",(b,win)=>{
    const code=Array.from({length:5},()=>RI(0,9)).join("");let cur="";
    b.innerHTML=`<div class="kp-code">${code}</div><div class="kp-in" id="kpin">·····</div><div class="kp">${[1,2,3,4,5,6,7,8,9,"C",0,"OK"].map(k=>`<button class="kb" data-k="${k}">${k}</button>`).join("")}</div>`;
    b.querySelectorAll(".kb").forEach(x=>x.onclick=()=>{const k=x.dataset.k;beep(600,.04);
      if(k==="C")cur="";else if(k==="OK"){if(cur===code)win();else{cur="";beep(180,.2,"sawtooth")}}else if(cur.length<5)cur+=k;
      $("kpin").textContent=cur.padEnd(5,"·")});
    window.__tmAuto=()=>{cur=code;b.querySelector('[data-k="OK"]').click()};
  });
}

/* ---- 7. calibrate the router (sliders) ---- */
function sliders(){
  return run("Calibrate the Wi-Fi router","Set every slider inside its green band.",(b,win)=>{
    const tg=Array.from({length:5},()=>RI(15,85));
    b.innerHTML=`<div class="sl">${tg.map((t,i)=>`<div class="slc"><div class="slband" style="bottom:${t-9}%;height:18%"></div><input type="range" orient="vertical" min="0" max="100" value="${RI(0,100)}" data-t="${t}" class="slr"></div>`).join("")}</div><div class="tm-msg" id="slm">Line them up…</div>`;
    const rs=[...b.querySelectorAll(".slr")];
    const chk=()=>{const ok=rs.every(r=>Math.abs(+r.value-+r.dataset.t)<=8);$("slm").textContent=ok?"Signal locked!":"Line them up…";if(ok){rs.forEach(r=>r.disabled=true);win()}};
    rs.forEach(r=>{r.oninput=chk});
    window.__tmAuto=()=>{rs.forEach(r=>r.value=r.dataset.t);chk()};
  });
}

/* ---- 8. timing bar (carrom) ---- */
function timing(){
  return run("Carrom practice","Stop the striker inside the green zone. Pot 3 coins.",(b,win)=>{
    b.innerHTML=`<div class="tmb"><div class="zone" style="left:42%;width:16%"></div><i id="tcur"></i></div><button class="tm-btn big" id="tstop">STOP</button><div class="tm-msg" id="tmsg">0 / 3</div>`;
    let x=0,dir=1,n=0,raf,last=performance.now(),sp=1.1;
    const loop=nw=>{const dt=(nw-last)/1000;last=nw;x+=dir*dt*sp;if(x>1){x=1;dir=-1}if(x<0){x=0;dir=1}$("tcur").style.left=(x*100)+"%";raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
    $("tstop").onclick=()=>{if(x>=.42&&x<=.58){n++;sp+=.35;beep(600+n*150,.12);$("tmsg").textContent=n+" / 3";if(n===3)win()}else{$("tmsg").textContent="Missed! "+n+" / 3";beep(180,.2,"sawtooth")}};
    window.__tmAuto=()=>{n=2;x=.5;$("tstop").click()};
    return()=>cancelAnimationFrame(raf);
  });
}

/* ---- 9. stamp the leave forms in order ---- */
function order(){
  return run("Stamp the leave forms","Stamp the forms in number order: 1 to 5.",(b,win)=>{
    const pos=shuffle([[8,10],[56,6],[28,44],[66,50],[12,76]]);let nx=1;
    b.innerHTML=`<div class="forms" id="forms"></div><div class="tm-msg" id="fmsg">Next: 1</div>`;
    const box=$("forms");
    for(let i=1;i<=5;i++){const f=document.createElement("button");f.className="form";f.style.left=pos[i-1][0]+"%";f.style.top=pos[i-1][1]+"%";f.innerHTML=`<b>${i}</b><span>LEAVE</span>`;
      f.onclick=()=>{if(i!==nx){$("fmsg").textContent="Wrong order! Next: "+nx;beep(180,.15,"sawtooth");return}f.classList.add("stamped");f.innerHTML="✔";nx++;beep(400+i*100,.08,"square",.04);$("fmsg").textContent=nx>5?"All approved!":"Next: "+nx;if(nx>5)win()};box.appendChild(f)}
    window.__tmAuto=()=>{for(let i=1;i<=5;i++){const f=[...box.children].find(c=>c.querySelector("b")&&c.querySelector("b").textContent==String(i));if(f)f.click()}};
  });
}

/* ---- 10. stand-in-place progress (upload, power nap) ---- */
function stand(title,sub,secs){
  return run(title,sub,(b,win)=>{
    b.innerHTML=`<div class="tm-meter"><i id="sfill"></i></div><div class="tm-msg" id="smsg3">Stay put…</div>`;
    const dur=(FAST?.3:secs||7)*1000,t0=performance.now();let raf,fin=false;
    const loop=()=>{const p=Math.min(1,(performance.now()-t0)/dur);$("sfill").style.width=(p*100)+"%";if(p>=1&&!fin){fin=true;win()}else if(!fin)raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  });
}

window.TASKGAMES={
  hold:(t,s,l)=>hold(t,s,l),wires,swipe,simon,squash,keypad,sliders,timing,order,
  stand:(t,s,secs)=>stand(t,s,secs)
};
})();
