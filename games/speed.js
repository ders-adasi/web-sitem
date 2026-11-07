/* Hız yarışı: verilen cevap doğru mu? (soru havuzundan üretilir; süre seçilebilir) */
Games.speed = {
  ad: "Hız Yarışı", ikon: "⚡", acik: "Doğru mu yanlış mı? Süreye karşı yarış!", uygun: (u) => !!u.salon,
  start(ctx) {
    const { el, shuffle, ses } = UI, root = ctx.root, P = ctx.unit.sorular;
    const sec = el("select", {}, [["30", "30 sn"], ["60", "60 sn"], ["0", "Süresiz (15 soru)"]].map(([v, t]) => el("option", { value: v }, t)));
    const basla = () => {
      const ts = +sec.value; let sc = 0, n = 0, t = ts, cur, iv;
      const bit = () => { clearInterval(iv); root._tus = null; ctx.bitir({ dogru: sc, toplam: Math.max(n, 1), puan: sc * 5, yanlis: [], ozet: `${n} önermeden ${sc} tanesini doğru bildin.` }); };
      const nx = () => {
        const q = shuffle(P)[0], tr = Math.random() < .5, an = tr ? q.o[q.d] : shuffle(q.o.filter((_, j) => j !== q.d))[0]; cur = tr;
        const ans = (b) => { (b === 1) === cur ? (sc++, ses.dogru()) : ses.yanlis(); n++; if (!ts && n >= 15) return bit(); nx(); };
        root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", { class: "sure" }, ts ? `⏱ ${t}` : `Soru ${n + 1} / 15`), el("span", {}, `⭐ ${sc * 5} puan`)),
          el("div", { class: "kart soru-kart" }, UI.gorsel(q.k), el("h2", { class: "soru" }, q.s), el("div", { class: "geri-bildirim ok" }, "Cevap: ", el("b", {}, an))),
          el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: () => ans(1) }, "✅ Doğru (1)"), el("button", { class: "btn buyuk ikinci", onclick: () => ans(0) }, "❌ Yanlış (2)")));
        root._tus = (e) => { if (e.key === "1") ans(1); if (e.key === "2") ans(0); };
      };
      if (ts) iv = setInterval(() => { if (!document.body.contains(root)) return clearInterval(iv); t--; if (t <= 0) return bit(); const x = root.querySelector(".sure"); if (x) x.textContent = "⏱ " + t; }, 1000);
      nx();
    };
    root.replaceChildren(el("div", { class: "kart" }, el("h2", {}, "⚡ Hız Yarışı"), el("p", {}, "Verilen cevabın doğru olup olmadığını hızlıca seç. Yanlış cevap puan düşürmez."),
      el("label", { class: "etiket" }, "Süre: ", sec), el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: basla }, "Başla"))));
  }
};
