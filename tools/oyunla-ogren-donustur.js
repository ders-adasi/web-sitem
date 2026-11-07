/* "Oyunla Öğren" sitesinin (Peygamberimizin Hayatı, Matematik, İngilizce) verisini Ders Ormanı paket biçimine dönüştürür.
   Kullanım:  npm i jsdom   →   node tools/oyunla-ogren-donustur.js <oyunla-ogren klasörü> <ders-oyun-sitesi klasörü>   */
const { JSDOM } = require("jsdom"), fs = require("fs"), path = require("path");
const [src, out] = [process.argv[2] || "../oyunla-ogren", process.argv[3] || ".."];
JSDOM.fromFile(path.join(src, "index.html"), { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true }).then((dom) => setTimeout(() => {
  const w = dom.window;
  const D = JSON.parse(w.eval(`JSON.stringify({IMG,ICO:typeof ICO!==\"undefined\"?ICO:{},DATA,SUBJ:Object.fromEntries(Object.entries(SUBJ).map(([k,v])=>[k,{ad:v.ad,em:v.em,okul:v.okul,games:v.games,lab:v.lab,pages:v.pages,ordHint:v.ordHint,shT:v.shT,whoT:v.whoT,treeT:v.treeT}]))})`));
  const mk = (s) => typeof s !== "string" ? s : s.replace(/<br\s*\/?>/g, "\n").replace(/<i>/g, "{i}").replace(/<\/i>/g, "{/i}").replace(/<b>/g, "{b}").replace(/<\/b>/g, "{/b}");
  const META = { siyer: { id: "siyer", pre: "siyer5", dil: "tr", dosya: "siyer.js" }, mat: { id: "matematik", pre: "mat5", dil: "tr", dosya: "matematik.js" }, eng: { id: "ingilizce", pre: "ing5", dil: "en", dosya: "ingilizce.js" } };
  const stripE = (s) => String(s).replace(/^\S+\s/, "");
  const taglar = {};
  for (const [key, M] of Object.entries(META)) {
    const p = D.DATA[key], S = D.SUBJ[key], KZ = p.KZ, R = p.R, Q = p.Q, ICO = p.ICO || (key === "siyer" ? D.ICO : {}), inBook = (k) => KZ[k] && KZ[k][1];
    const kodu = (t) => { const m = /^([A-Z]+(?:\.\d+)+(?:\.[A-Z]\d*)?)\s/.exec(t); return m ? m[1] : ""; };
    const conv = (q, k) => ({ s: mk(q[0]), o: q[1].map(mk), d: q[2], i: "Konu: " + KZ[k][0].replace(/^[A-Z]+(?:\.\d+)+(?:\.[A-Z]\d*)?\s*[·\-]?\s*/, ""), a: mk(q[3]), k });
    const ctr = {}, units = [];
    const unitFrom = (id, ad, bolge, kz, qids, i, ek) => {
      const av = [...new Set(kz.map((x) => x[0]).filter(inBook))];
      const bil = av.map((k) => p.INFO[k]).filter(Boolean).map((x) => (x[2] && !String(x[2]).startsWith("<") ? [x[0], x[1], x[2]] : [x[0], x[1] + (x[2] || "")]));
      const kel = []; const seen = new Set(); av.forEach((k) => (p.KW[k] || []).forEach(([wd, ip]) => { if (wd.length <= 9 && !seen.has(wd)) { seen.add(wd); kel.push([wd, mk(ip)]); } }));
      const pairs = []; for (let j = 0; j < 6; j++) pairs.push(p.PAIRS[((ek ? p.PAIRS.length - 6 : i * 3) + j) % p.PAIRS.length]);
      const u = { id, ad, bolge, ikon: ICO[av[0]] || "📚", ar: av.slice(0, 4).map((k) => ICO[k] || "").join(""),
        kazanimlar: kz.map(([k, c]) => `${mk(KZ[k][0])} (${c} soru)${inBook(k) ? "" : " – kitapta işlenmediği için eklenmedi"}`),
        sorular: qids.map(([k, j]) => conv(Q[k][j], k)), sinav: !ek || true,
        dy: av.flatMap((k) => (p.DYB[k] || []).map((d) => [mk(d[0]), !!d[1], mk(d[2])])),
        bosluk: av.flatMap((k) => (p.BD[k] || []).map((b) => [mk(b[0]).replace("____", "___"), [b[1], ...b[2]].join("|")])),
        kelimeler: kel, eslestirme: pairs.map((x) => ({ ar: x[0], tr: x[1] })), siralama: [p.ORD[ek ? 3 : i % 3]].filter(Boolean), bilgi: bil };
      Object.keys(u).forEach((k) => { if (Array.isArray(u[k]) && !u[k].length && k !== "sorular") delete u[k]; });
      return u;
    };
    for (let i = 0; i < 10; i++) {
      const kz = [], qids = [];
      for (const k in R) { const c = +R[k][i]; if (!c) continue; kz.push([k, c]); if (!inBook(k)) continue; for (let j = 0; j < c; j++) { ctr[k] = ctr[k] || 0; qids.push([k, ctr[k]++ % Q[k].length]); } }
      const u = unitFrom(`${M.pre}-s${i + 1}`, `${(i % 5) + 1}. Senaryo`, i < 5 ? "1. Yazılı" : "2. Yazılı", kz, qids, i, false);
      if (S.okul === i) u.okul = true; units.push(u);
    }
    if (p.Q.aile) { const kz = [["aile", p.Q.aile.length]]; units.push(unitFrom(`${M.pre}-ek-aile`, "Aile Hayatında Peygamberimiz", "Ek konu", kz, p.Q.aile.map((_, j) => ["aile", j]), 10, true)); }
    // Oyun Salonu: tüm içerik havuzu
    const all = Object.keys(Q).filter(inBook), pool = (f) => all.flatMap(f);
    const salon = { id: `${M.pre}-salon`, ad: "Oyun Salonu", bolge: "Oyun Salonu", ikon: "🎮", ar: "🎲🧩🚀", salon: true,
      kazanimlar: ["Tüm konulardan karışık oyunlar ve çalışma kartları."],
      sorular: pool((k) => Q[k].map((q) => conv(q, k))), dy: pool((k) => (p.DYB[k] || []).map((d) => [mk(d[0]), !!d[1], mk(d[2])])),
      bosluk: pool((k) => (p.BD[k] || []).map((b) => [mk(b[0]).replace("____", "___"), [b[1], ...b[2]].join("|")])),
      kelimeler: [...new Map(pool((k) => (p.KW[k] || []).filter((x) => x[0].length <= 9).map((x) => [x[0], mk(x[1])]))).entries()],
      eslestirme: p.PAIRS.map((x) => ({ ar: x[0], tr: x[1] })), siralama: p.ORD, bilgi: all.map((k) => p.INFO[k]).filter(Boolean).map((x) => (x[2] && !String(x[2]).startsWith("<") ? [x[0], x[1], x[2]] : [x[0], x[1] + (x[2] || "")])) };
    salon.kelimeler = salon.kelimeler.map(([a, b]) => [a, b]);
    units.push(salon);
    const hasVoc = p.VOC && Object.keys(p.VOC).length;
    if (hasVoc) units.forEach((u) => { const ks = u.salon ? all : [...new Set(u.sorular.map((q) => q.k))]; const seenW = {}; u.ses = ks.flatMap((k) => p.VOC[k] || []).filter((w) => !/[ ’']/.test(w[0]) && !seenW[w[0].toLowerCase()] && (seenW[w[0].toLowerCase()] = 1)); });
    if (key === "mat") units.forEach((u) => { u.hesap = true; u.aci = true; });
    const oyunAd = {}; const map = { ord: "sort", who: "who", hdt: "hdt", sit: "sit" }; Object.entries(S.lab || {}).forEach(([g, t]) => { if (map[g]) oyunAd[map[g]] = stripE(t); });
    const OG = { quiz: "quiz", mem: "match", info: "cards", spd: "speed", ord: "sort", who: "who", mapg: "mapg", hdt: "hdt", ws: "words", sit: "sit", duel: "duel", boss: "boss", dy: "dy", bd: "fill", hang: "hang", exam: "exam", sheet: "sheet", calc: "calc", angg: "angg", lis: "lis", bee: "bee" };
    const oyunSira = (S.games || []).map((g) => OG[g]).filter(Boolean);
    const sayfalar = (S.pages || []).map(([f, t]) => ({ gl: ["sozluk", t], tl: ["zaman", t], tree: ["agac", t], story: ["hikaye", t] }[f.replace("()", "")])).filter(Boolean).map(([id, t]) => ({ id, ad: t }));
    if (key === "siyer") oyunAd.hdt = "Hadis Tamamla";
    sayfalar.push({ id: "inceleme", ad: "🧑‍🏫 İçerik İnceleme" });
    const veri = { ad: S.ad, ikon: S.em, dil: M.dil, kazanimAd: Object.fromEntries(Object.entries(KZ).map(([k, v]) => [k, mk(v[0])])), kazanimKod: Object.fromEntries(Object.entries(KZ).map(([k, v]) => [k, kodu(v[0])])),
      uniteler: units, setler: { who: p.WHO, sit: p.SIT.map((s) => ({ s: mk(s[0]), o: s[1], d: 0, a: mk(s[2]) })), hdt: p.HD.map((h) => ({ s: mk(h[0]).replace("____", "___"), o: [h[1], ...h[2]], d: 0, a: mk(h[3]) })) },
      sozluk: p.GL, zaman: (p.TL || []).length ? p.TL : undefined, agac: p.TREE, agacAd: stripE(S.treeT || "🌳 Ağaç"), hikayeler: (p.STO || []).length ? p.STO.map((h) => [h[0], h[1], h[2], (h[3] || []).map((id) => { const [k, j] = String(id).split(":"); return Q[k] && Q[k][+j] ? conv(Q[k][+j], k) : null; }).filter(Boolean)]) : undefined, harita: key === "siyer" ? true : undefined,
      oyunSira, oyunAd, siralaIpucu: S.ordHint, sayfalar };
    Object.keys(veri).forEach((k) => veri[k] === undefined && delete veri[k]);
    fs.writeFileSync(path.join(out, "data/5", M.dosya), `/* 5. Sınıf ${S.ad} – "Oyunla Öğren" sitesinden dönüştürüldü (senaryo = ortak yazılı sınav senaryosu). Soru eklemek için ilgili ünitenin "sorular" listesine {s,o,d,i,a,k} ekleyin. */\nwindow.DERS_VERILERI=window.DERS_VERILERI||{};window.DERS_VERILERI["5"]=window.DERS_VERILERI["5"]||{};\nwindow.DERS_VERILERI["5"].${M.id}=${JSON.stringify(veri)};\n`);
    console.log(M.id, units.length, "ünite", units.reduce((t, u) => t + u.sorular.length, 0), "soru");
  }
  fs.writeFileSync(path.join(out, "data/gorseller-kitap.js"), "/* Bilgi kartlarındaki ders kitabı görselleri (\"Oyunla Öğren\" sitesinden). Herkese açık yayından önce kullanım izni kontrol edilmelidir. */\nwindow.GORSEL=window.GORSEL||{};window.GORSEL.FOTO=" + JSON.stringify(D.IMG) + ";\n");
  process.exit(0);
}, 800));
