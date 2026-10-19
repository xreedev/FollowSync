/* Everyday: offline-first service worker. Bump VERSION when files change. */
const VERSION="everyday-v3";
const FILES=["game.html","install.html","manifest.json",
  "game/engine.js","game/art.js","game/s_office.js","game/sprites.js","game/s_map.js","game/s_outdoor.js","game/s_top.js","game/s_ride.js","game/s_end.js","game/story.js",
  "icons/icon.svg","icons/icon-192.png","icons/icon-512.png","icons/maskable-192.png","icons/maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>hit);
    return hit||net;
  }));
});
