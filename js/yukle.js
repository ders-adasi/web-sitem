/* Yükleyici: data/kayit.js içindeki listeleri sırayla yükler (görseller → oyunlar → sayfalar → ders paketleri).
   Yeni oyun/ders eklemek için yalnızca data/kayit.js'e bir satır eklemek yeterlidir. */
(function () {
  const K = window.KAYIT || {}, yukle = (src) => new Promise((res) => { const s = document.createElement("script"); s.src = src; s.async = false; s.onload = res; s.onerror = () => { console.warn("Yüklenemedi:", src); res(); }; document.head.appendChild(s); });
  const sira = [...(K.gorseller || []), ...(K.oyunlar || []), ...(K.sayfalar || []), ...(K.paketler || [])];
  window.Paketler = { sira, hazir: sira.reduce((p, src) => p.then(() => yukle(src)), Promise.resolve()) };
})();
