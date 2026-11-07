/* Çevrimdışı çalışma: aynı kökenli dosyaları önce ağdan alır, başarısız olursa önbellekten verir (dosya listesi gerekmez). */
const SURUM = "dos-v3";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== SURUM).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;       // Supabase vb. dış istekler önbelleğe alınmaz
  e.respondWith(fetch(r).then((res) => { if (res.ok) { const c = res.clone(); caches.open(SURUM).then((ch) => ch.put(r, c)); } return res; }).catch(() => caches.match(r).then((m) => m || caches.match("index.html"))));
});
