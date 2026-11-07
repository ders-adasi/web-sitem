/* Duman testi: siteyi sanal tarayıcıda (jsdom) açar; her dersin her adasındaki her oyunu ve bilgi sayfalarını açıp hata arar.
   Kullanım:  npm i  →  npm test        (kendi küçük sunucusunu başlatır; çıkış kodu 0 = başarılı) */
const http = require("http"), fs = require("fs"), path = require("path"), { JSDOM } = require("jsdom");
const kok = path.join(__dirname, ".."), tur = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webmanifest": "application/json", ".png": "image/png" };
const sunucu = http.createServer((q, r) => { const f = path.join(kok, decodeURIComponent(q.url.split("?")[0]).replace(/^\/$/, "/index.html")); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": (tur[path.extname(f)] || "text/plain") + "; charset=utf-8" }); r.end(b); }); });
sunucu.listen(0, async () => {
  const hatalar = []; let acilan = 0;
  const dom = await JSDOM.fromURL(`http://localhost:${sunucu.address().port}/index.html`, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    beforeParse(w) { w.addEventListener("error", (e) => hatalar.push("JS hatası: " + e.message)); w.HTMLElement.prototype.scrollIntoView = () => {}; w.matchMedia = w.matchMedia || (() => ({ matches: false })); } });
  const w = dom.window, d = w.document, $$ = (s) => [...d.querySelectorAll(s)], click = (e) => e.dispatchEvent(new w.MouseEvent("click", { bubbles: true })), bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const btn = (re) => $$("button").find((b) => re.test(b.textContent));
  await bekle(3000);
  try {
    click(btn(/Üye ol/)); const ins = $$("input"); ins[0].value = "test"; ins[1].value = "1234"; click(btn(/Üye Ol$/));
    for (const sinif of [...new Set($$(".secici .btn").map((b) => b.textContent))]) {
      click($$(".secici .btn").find((b) => b.textContent === sinif));
      for (let di = 0; di < $$(".ders-kart").length; di++) {
        click($$(".ders-kart")[di]); const ders = d.querySelector("h1").textContent;
        for (let ai = 0; ai < $$(".ada").length; ai++) { click($$(".ada")[ai]);
          for (let gi = 0; gi < $$(".oyun-kart").length; gi++) { const ad = $$(".oyun-kart")[gi].querySelector(".oyun-ad").textContent; click($$(".oyun-kart")[gi]); await bekle(10); acilan++;
            if (!(d.querySelector(".oyun-alan") && d.querySelector(".oyun-alan").children.length)) hatalar.push(`${sinif} ${ders} / ada ${ai + 1} / ${ad}: oyun açılmadı`); click(btn(/◀ Geri/)); }
          click(btn(/◀ /)); }
        for (let si = 0; si < $$(".sayfa-dugmeleri .btn").length; si++) { const ad = $$(".sayfa-dugmeleri .btn")[si].textContent; click($$(".sayfa-dugmeleri .btn")[si]); if (!(d.querySelector(".kart") && d.querySelector(".kart").textContent.length > 30)) hatalar.push(`${ders}: "${ad}" sayfası boş`); click(btn(/◀ /)); }
        click(btn(/◀ Dersler/));
      }
    }
  } catch (e) { hatalar.push("Test akışı: " + e.message); }
  console.log(`${acilan} oyun açıldı.`); hatalar.forEach((h) => console.log("❌", h)); console.log(hatalar.length ? `${hatalar.length} sorun.` : "✅ Sorun yok.");
  sunucu.close(); process.exit(hatalar.length ? 1 : 0);
});
