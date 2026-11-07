/* Matematik oyunları: Hesap Yarışı (unit.hesap) ve Açıyı Tahmin Et (unit.aci) */
Games.calc = {
  ad: "Hesap Yarışı", ikon: "🧮", acik: "45 saniyede olabildiğince çok işlem çöz.", uygun: (u) => !!u.hesap,
  start(ctx) {
    const { el, shuffle, ses } = UI, root = ctx.root, Rn = (n) => Math.floor(Math.random() * n); let sc = 0, t = 45, iv;
    const bar = el("i", { style: "width:100%" }), tm = el("b", {}, "45"), puan = el("b", {}, "0"), h2 = el("h2", { class: "soru" }), opts = el("div", { class: "secenekler" });
    root.replaceChildren(el("div", { class: "kart", style: "text-align:center" }, el("p", {}, "🧮 Hesap Yarışı · ⏱ ", tm, " sn · Puan ", puan), el("div", { class: "ilerleme" }, bar), h2, opts));
    const nx = () => { const o = Rn(4); let a, b, c, s;
      if (o === 0) { a = 1000 + Rn(90000); b = 1000 + Rn(90000); c = a + b; s = a + " + " + b; } else if (o === 1) { a = 20000 + Rn(80000); b = 1000 + Rn(a - 5000); c = a - b; s = a + " − " + b; }
      else if (o === 2) { a = 12 + Rn(88); b = 3 + Rn(17); c = a * b; s = a + " × " + b; } else { b = 3 + Rn(17); c = 10 + Rn(90); a = b * c; s = a + " ÷ " + b; }
      const w = []; shuffle([1, -1, 10, -10, 100, -100, 1000, -1000]).forEach((d) => { if (c + d > 0 && w.length < 3) w.push(c + d); });
      h2.textContent = s + " = ?"; opts.replaceChildren(...shuffle([c, ...w]).map((x) => el("button", { class: "secenek", onclick: () => { x === c ? (sc++, ses.dogru()) : ses.yanlis(); puan.textContent = sc; nx(); } }, String(x)))); };
    iv = setInterval(() => { if (!document.body.contains(root)) return clearInterval(iv); t--; tm.textContent = t; bar.style.width = (t / 45) * 100 + "%";
      if (t <= 0) { clearInterval(iv); ctx.bitir({ dogru: Math.min(sc, 13), toplam: 13, puan: sc * 5, yanlis: [], ozet: `Süre doldu! ${sc} doğru cevap.` }); } }, 1000);
    nx();
  }
};
Games.angg = {
  ad: "Açıyı Tahmin Et", ikon: "📐", acik: "Gördüğün açının kaç derece olduğunu tahmin et.", uygun: (u) => !!u.aci,
  start(ctx) {
    const { el } = UI, root = ctx.root; let r = 0, sc = 0;
    const tur = () => {
      const d = 5 * (2 + Math.floor(Math.random() * 33)), rad = d * Math.PI / 180, cx = 100, cy = 108, x = cx + 85 * Math.cos(rad), y = cy - 85 * Math.sin(rad), ax = cx + 26 * Math.cos(rad), ay = cy - 26 * Math.sin(rad);
      const gv = el("b", {}, "90"), sl = el("input", { type: "range", min: 0, max: 180, value: 90, step: 5, "aria-label": "Tahmin", style: "width:80%" }), sonuc = el("div", {});
      const ok = el("button", { class: "btn buyuk", onclick: () => { const g = +sl.value, df = Math.abs(g - d), p = df <= 5 ? 3 : df <= 10 ? 2 : df <= 20 ? 1 : 0; sc += p; ok.remove(); sl.disabled = true;
        sonuc.replaceChildren(el("p", {}, `Gerçek ölçü: `, el("b", {}, d + "°"), p ? ` · +${p} puan 🎉` : " · Biraz daha dikkat 💪"), el("button", { class: "btn buyuk", onclick: () => { r++; r < 5 ? tur() : ctx.bitir({ dogru: Math.min(sc, 12), toplam: 12, puan: sc * 4, yanlis: [], ozet: `Toplam ${sc} / 15 puan!` }); } }, r < 4 ? "Sonraki ▶" : "Bitir 🏁")); } }, "Tahminimi Gönder");
      sl.oninput = () => { gv.textContent = sl.value; };
      root.replaceChildren(el("div", { class: "kart", style: "text-align:center" }, el("p", { class: "ders-etiket" }, `📐 Açıyı Tahmin Et · ${r + 1}/5 · Puan ${sc}`),
        el("div", { html: `<svg viewBox="0 0 200 120" width="300" style="max-width:100%;color:var(--yazi)" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><line x1="${cx}" y1="${cy}" x2="185" y2="${cy}"/><line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><path stroke-width="2" d="M${cx + 26},${cy} A26 26 0 0 0 ${ax},${ay}"/></svg>` }),
        el("p", {}, "Sence bu açı kaç derece? ", gv, "°"), sl, el("p", {}, ok), sonuc));
    };
    tur();
  }
};
