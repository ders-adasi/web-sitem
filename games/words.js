/* Kelime avı: ipucuna uyan kelimeyi harf tablosunda bul (veri: unit.kelimeler = [["KELİME", "ipucu"], ...]) */
Games.words = {
  ad: "Kelime Avı", ikon: "🔎", acik: "İpucuna uyan kelimeyi tabloda bul.", uygun: (u) => !!u.kelimeler,
  start(ctx) {
    const { el, shuffle, ses } = UI, root = ctx.root, N = 10, g = Array(N * N).fill(""), ws = []; let sel = []; const fd = new Set(), fc = new Set();
    shuffle(ctx.unit.kelimeler).slice(0, 6).forEach(([w, c]) => { const cs = [...w];
      for (let t = 0; t < 300; t++) { const v = Math.random() < .5, x = (Math.random() * (v ? N : N - cs.length + 1)) | 0, y = (Math.random() * (v ? N - cs.length + 1 : N)) | 0, ix = cs.map((_, i) => (y + (v ? i : 0)) * N + x + (v ? 0 : i));
        if (ix.every((p, i) => !g[p] || g[p] === cs[i])) { ix.forEach((p, i) => g[p] = cs[i]); ws.push([w, c]); break; } } });
    const AL = [..."ABCÇDEFGHİIJKLMNOÖPRSŞTUÜVYZ"]; g.forEach((c, i) => { if (!c) g[i] = AL[(Math.random() * AL.length) | 0]; });
    const lin = (s) => s.length > 1 && s.every((p, i) => i === 0 || ((Math.abs(p - s[i - 1]) === N || (Math.abs(p - s[i - 1]) === 1 && ((p / N) | 0) === ((s[i - 1] / N) | 0))) && p - s[i - 1] === s[1] - s[0]));
    const tap = (i) => { sel = sel.includes(i) ? sel.filter(x => x !== i) : [...sel, i]; const s = sel.map(k => g[k]).join(""), m = lin(sel) && ws.find(([w]) => !fd.has(w) && (s === w || s === [...w].reverse().join("")));
      if (m) { fd.add(m[0]); sel.forEach(k => fc.add(k)); sel = []; ses.dogru(); if (fd.size === ws.length) return ctx.bitir({ dogru: ws.length, toplam: ws.length, puan: 60, yanlis: [], ozet: "Tüm kelimeleri buldun!" }); } draw(); };
    const draw = () => root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `Bulunan: ${fd.size}/${ws.length}`), el("span", {}, "Harflere sırayla dokun")),
      el("div", { class: "kelime-izgara", style: `grid-template-columns:repeat(${N},1fr)` }, g.map((c, i) => el("button", { class: "kelime-hucre" + (fc.has(i) ? " bulundu" : sel.includes(i) ? " sec" : ""), onclick: () => tap(i) }, c))),
      el("div", { class: "kart" }, ws.map(([w, c]) => el("p", {}, fd.has(w) ? `✅ ${w} – ` : "🔹 ", c))), el("div", { class: "alt-cubuk" }, el("button", { class: "btn ikinci", onclick: () => { sel = []; draw(); } }, "Seçimi temizle")));
    draw();
  }
};
