const C="squareq-v2";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"])).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Primero la red (así siempre ves la última versión y las carpetas pre-cargadas nuevas); sin conexión, usa lo guardado.
// Solo se guardan respuestas correctas: un error del servidor (404, 503…) nunca pisa la copia buena.
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||new URL(r.url).origin!==location.origin) return;
  e.respondWith(fetch(r).then(res=>{
    if(res.status===200&&res.type==="basic"&&!res.redirected){const cp=res.clone();e.waitUntil(caches.open(C).then(c=>c.put(r,cp)).catch(()=>{}));}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
