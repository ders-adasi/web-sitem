/* Doğru mu Yanlış mı? – veri: unit.dy = [["cümle", doğruMu(true/false), "açıklama"], ...] */
Games.dy = {
  ad: "Doğru mu Yanlış mı?", ikon: "✅", acik: "Cümlenin doğru ya da yanlış olduğuna karar ver.", uygun: (u) => !!(u.dy && u.dy.length),
  start(ctx) {
    const { el, fmt, shuffle, ses } = UI, L = shuffle(ctx.unit.dy).slice(0, 12), root = ctx.root; let i = 0, pt = 0;
    const bit = () => { root._tus = null; ctx.bitir({ dogru: pt, toplam: L.length, puan: pt * 10, yanlis: [], ozet: `${L.length} cümleden ${pt} tanesini doğru bildin.` }); };
    const go = () => {
      const [t, ok, ex] = L[i]; let kilit = false; const fb = el("div", { class: "geri-bildirim" });
      const nx = el("button", { class: "btn buyuk", style: "display:none", onclick: () => { i++; i < L.length ? go() : bit(); } }, i === L.length - 1 ? "Sonucu Gör ▶" : "Sonraki ▶");
      const cevap = (v) => { if (kilit) return; kilit = true; const d = v === ok; d ? (pt++, ses.dogru()) : ses.yanlis(); fb.className = "geri-bildirim " + (d ? "ok" : "no");
        fb.innerHTML = `<b>${d ? "Doğru bildin! 🎉" : "Doğru cevap: " + (ok ? "Doğru" : "Yanlış") + " 💪"}</b> ${fmt(ex || "")}`; nx.style.display = ""; bd.disabled = by.disabled = true; };
      const bd = el("button", { class: "btn buyuk", onclick: () => cevap(true) }, "✅ Doğru (1)"), by = el("button", { class: "btn buyuk ikinci", onclick: () => cevap(false) }, "❌ Yanlış (2)");
      root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `Cümle ${i + 1} / ${L.length}`), el("span", {}, `⭐ ${pt * 10} puan`)), el("div", { class: "ilerleme" }, el("i", { style: `width:${(i / L.length) * 100}%` })),
        el("div", { class: "kart soru-kart" }, el("h2", { class: "soru", html: fmt(t) })), el("div", { class: "alt-cubuk" }, bd, by), fb, el("div", { class: "alt-cubuk" }, nx));
      root._tus = (e) => { if (e.key === "1") cevap(true); else if (e.key === "2") cevap(false); else if (e.key === "Enter" && kilit) nx.click(); };
    };
    go();
  }
};
