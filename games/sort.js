/* Sıralama bulmacası: kartları sürükle-bırak (ya da dokun-dokun) ile doğru sıraya diz (veri: unit.siralama = [["başlık", [doğru sırada öğeler]], ...]) */
Games.sort = {
  ad: "Sıralama Bulmacası", ikon: "🧩", acik: "Kartları sürükle (ya da dokun) ve doğru sıraya diz.", uygun: (u) => !!u.siralama,
  start(ctx) {
    const { el, shuffle, ses } = UI, R = shuffle(ctx.unit.siralama).slice(0, 4), root = ctx.root; let r = 0, pt = 0;
    const go = () => {
      const [t, a] = R[r]; let pool = shuffle(a.map((_, j) => j)), sl = a.map(() => -1), sel = -1, res = null;
      const put = (k, j) => { if (res !== null) return; if (sl[k] >= 0) pool.push(sl[k]); sl[k] = j; pool = pool.filter(x => x !== j); sel = -1; draw(); };
      const draw = () => {
        const slots = sl.map((v, k) => el("div", { class: "sira-yuva" + (res !== null ? (sl[k] === k ? " dogru" : " yanlis") : ""), ondragover: e => e.preventDefault(),
          ondrop: e => { e.preventDefault(); const j = e.dataTransfer.getData("text"); if (j !== "") put(k, +j); },
          onclick: () => { if (res !== null) return; if (sel >= 0) put(k, sel); else if (sl[k] >= 0) { pool.push(sl[k]); sl[k] = -1; draw(); } } }, v < 0 ? String(k + 1) : a[v]));
        const cards = pool.map(j => el("div", { class: "sira-kart" + (sel === j ? " sec" : ""), draggable: "true", ondragstart: e => e.dataTransfer.setData("text", String(j)), onclick: () => { if (res === null) { sel = j; draw(); } } }, a[j]));
        const alt = res !== null
          ? [el("div", { class: "geri-bildirim " + (res ? "ok" : "no") }, res ? "🎉 Mükemmel sıralama!" : "🌱 Doğrusu: " + a.join(" → ")),
             el("button", { class: "btn buyuk", onclick: () => { r++; r < R.length ? go() : ctx.bitir({ dogru: pt, toplam: R.length, puan: pt * 20, yanlis: [], ozet: `${R.length} sıralamadan ${pt} tanesini doğru yaptın.` }); } }, r === R.length - 1 ? "Sonucu Gör ▶" : "Sonraki ▶")]
          : (pool.length ? [] : [el("button", { class: "btn buyuk", onclick: () => { res = sl.every((v, k) => v === k); res ? (pt++, ses.dogru()) : ses.yanlis(); draw(); } }, "✔ Kontrol et")]);
        root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `Bulmaca ${r + 1} / ${R.length}`), el("span", {}, `⭐ ${pt * 20} puan`)),
          el("div", { class: "kart soru-kart" }, el("h2", { class: "soru" }, t), el("div", { class: "sira-satir" }, slots), el("div", { class: "sira-satir" }, cards)), ...alt);
      };
      draw();
    };
    go();
  }
};
