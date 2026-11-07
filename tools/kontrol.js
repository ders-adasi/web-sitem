/* Ders paketlerini doğrular:  node tools/kontrol.js      (hata varsa çıkış kodu 1)
   Denetler: zorunlu alanlar, benzersiz ünite kimlikleri, soru/şık/doğru-indeks tutarlılığı, oyun verisi biçimleri, bilgi sayfası verileri. */
const vm = require("vm"), fs = require("fs"), path = require("path");
const kok = path.join(__dirname, ".."), w = {}; vm.createContext(w); w.window = w;
vm.runInContext(fs.readFileSync(path.join(kok, "data/kayit.js"), "utf8"), w);
const hatalar = [], uyarilar = [], e = (m) => hatalar.push(m), u = (m) => uyarilar.push(m);
try { vm.runInContext(fs.readFileSync(path.join(kok, "data/temalar.js"), "utf8"), w); } catch (x) {}
for (const f of w.KAYIT.paketler) { try { vm.runInContext(fs.readFileSync(path.join(kok, f), "utf8"), w, { filename: f }); } catch (x) { e(`${f}: yüklenemedi (${x.message})`); } }
const idler = new Set(); let ders = 0, unite = 0, soru = 0;
const dizi = (v) => Array.isArray(v);
for (const [sinif, dd] of Object.entries(w.DERS_VERILERI || {})) for (const [k, dk] of Object.entries(dd)) {
  ders++; const T = `${sinif}. sınıf ${k}`;
  ["ad", "ikon"].forEach((a) => !dk[a] && e(`${T}: "${a}" eksik`)); if (!dk.kazanimAd) u(`${T}: kazanimAd yok (ebeveyn panelinde kazanım başarısı görünmez)`); if (!dizi(dk.uniteler) || !dk.uniteler.length) { e(`${T}: ünite yok`); continue; }
  if (!(w.DERS_TEMA && w.DERS_TEMA[k]) && !dk.tema) u(`${T}: renk teması yok (data/temalar.js)`);
  for (const un of dk.uniteler) { unite++; const U = `${T} / ${un.id}`;
    if (!un.id) e(`${T}: kimliksiz ünite`); else if (idler.has(un.id)) e(`${U}: kimlik başka ünitede de var`); idler.add(un.id);
    ["ad", "bolge", "ikon"].forEach((a) => !un[a] && e(`${U}: "${a}" eksik`)); if (!dizi(un.kazanimlar)) e(`${U}: kazanimlar dizi olmalı`);
    (un.sorular || []).forEach((q, i) => { soru++; const Q = `${U} soru ${i + 1}`;
      if (typeof q.s !== "string" || !q.s) e(`${Q}: soru metni yok`); if (!dizi(q.o) || q.o.length < 2) e(`${Q}: en az 2 şık gerekir`); else { if (!(q.d >= 0 && q.d < q.o.length)) e(`${Q}: doğru indeks (d) geçersiz`); if (new Set(q.o).size !== q.o.length) u(`${Q}: aynı şık tekrar ediyor`); }
      if (!q.a) u(`${Q}: açıklama yok`); if (q.k && dk.kazanimAd && !dk.kazanimAd[q.k]) u(`${Q}: "${q.k}" kazanım adı tanımlı değil`); });
    if (!un.salon && !(un.sorular || []).length) u(`${U}: soru yok`);
    (un.dy || []).forEach((d, i) => { if (typeof d[0] !== "string" || typeof d[1] !== "boolean") e(`${U} dy ${i + 1}: [cümle, true/false, açıklama] biçiminde olmalı`); });
    (un.bosluk || []).forEach((b, i) => { if (!/___/.test(b[0])) e(`${U} bosluk ${i + 1}: "___" yok`); if (String(b[1]).split("|").length < 2) e(`${U} bosluk ${i + 1}: en az 2 seçenek`); });
    (un.eslestirme || []).forEach((p, i) => { if (!p.ar || !p.tr) e(`${U} eslestirme ${i + 1}: {ar, tr} gerekir`); });
    (un.siralama || []).forEach((s, i) => { if (!dizi(s[1]) || s[1].length < 3) e(`${U} siralama ${i + 1}: en az 3 öğe`); });
    (un.kelimeler || []).forEach(([wd], i) => { if (wd.length > 10) u(`${U} kelime "${wd}" 10 harften uzun (tabloya sığmayabilir)`); });
  }
  for (const s of dk.sayfalar || []) { const v = { sozluk: dk.sozluk, zaman: dk.zaman, agac: dk.agac, hikaye: dk.hikayeler, inceleme: true }[s.id]; if (!v) e(`${T}: "${s.id}" sayfasının verisi yok`); }
  if (dk.setler) for (const [a, l] of Object.entries(dk.setler)) if (!dizi(l) || !l.length) e(`${T}: setler.${a} boş`);
}
console.log(`${ders} ders, ${unite} ünite, ${soru} soru denetlendi.`);
uyarilar.slice(0, 30).forEach((m) => console.log("⚠️ ", m)); if (uyarilar.length > 30) console.log(`⚠️  … ${uyarilar.length - 30} uyarı daha`);
hatalar.forEach((m) => console.log("❌", m)); console.log(hatalar.length ? `\n${hatalar.length} hata var.` : "\n✅ Hata yok.");
process.exit(hatalar.length ? 1 : 0);
