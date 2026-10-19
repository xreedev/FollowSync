/* ================= SCENES: beach, restaurants, visitors' area, ending ================= */
(function(){
"use strict";
const TAU=Math.PI*2;const {rr,circ,lg,rg,shade}=Art;const $=G.$;
const hash=(n)=>{let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};

/* =====================================================================
   ENDING
   ===================================================================== */
S.Ending={
  enter(o){
    G.showClock=false;G.hideDlg();G.chapter(0,"");this.t0=G.t;this.sum=o.sum||[];A.setMusic("warm");
    const m=$("mini");m.innerHTML=`<div id="endwrap" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;pointer-events:none">
      <div id="e1" style="font-family:Georgia,serif;font-size:calc(var(--u)*92);color:#fff5e6;opacity:0;transition:opacity 2s;text-shadow:0 0 40px rgba(255,150,90,.6)">October 7</div>
      <div id="e2" style="font-family:Georgia,serif;font-size:calc(var(--u)*30);color:#ffd9a8;opacity:0;transition:opacity 2s;margin-top:calc(var(--u)*18);line-height:1.5">Of all the ordinary days at Technopark,<br>this is the one I keep replaying.</div>
      <div id="e3" style="font-family:Georgia,serif;font-size:calc(var(--u)*28);color:#e8dcc8;opacity:0;transition:opacity 2s;margin-top:calc(var(--u)*28);line-height:1.5;font-style:italic">Thank you for the tea, the laps, the waiting,<br>and the ride.</div>
      <div id="e4" style="font-family:Georgia,serif;font-size:calc(var(--u)*30);color:#ffb26b;opacity:0;transition:opacity 2s;margin-top:calc(var(--u)*26)">– Sreedev</div>
      <div id="e5" class="panel" style="position:relative;opacity:0;transition:opacity 1.5s;margin-top:calc(var(--u)*30);text-align:left;pointer-events:auto;min-width:calc(var(--u)*640)"><h3>Your October 7</h3><div id="sumlist"></div>
        <div class="row"><button class="btn p" id="eReplay">Replay October 7</button><button class="btn" id="eMenu">Main menu</button></div></div></div>`;
    $("sumlist").innerHTML=this.sum.map(s=>`<p style="margin:calc(var(--u)*5) 0"><b style="color:#ffd166">${s[0]}</b> &nbsp;${s[1]}</p>`).join("");
    const show=(id,ms)=>setTimeout(()=>{const e=$(id);if(e)e.style.opacity=1},G.dev?30:ms);show("e1",400);show("e2",2800);show("e3",5600);show("e4",8000);show("e5",10400);
    $("eReplay").onclick=()=>{A.sfx("start");if(G.begin)G.begin(1,true)};$("eMenu").onclick=()=>{if(G.toTitle)G.toTitle()};
    this.fire=Array.from({length:40},()=>({x:Math.random()*1280,y:Math.random()*720,p:Math.random()*6}));
  },
  exit(){$("mini").innerHTML=""},
  draw(g){
    const t=G.t;g.fillStyle=lg(g,0,0,0,720,[[0,"#05070f"],[1,"#1a1030"]]);g.fillRect(0,0,1280,720);Art.stars(g,t,180,31);
    g.fillStyle=rg(g,640,700,10,700,[[0,"rgba(255,140,80,.35)"],[1,"rgba(255,140,80,0)"]]);g.fillRect(0,0,1280,720);
    for(const f of this.fire){const a=.3+.7*Math.abs(Math.sin(t*1.1+f.p));g.fillStyle=`rgba(255,226,150,${a*.7})`;g.beginPath();g.arc(f.x+Math.sin(t*.4+f.p)*30,f.y-((t*14+f.p*40)%720)*0+Math.cos(t*.3+f.p)*20,2,0,TAU);g.fill()}
    S.vignette(g,.6);
  }
};
})();
