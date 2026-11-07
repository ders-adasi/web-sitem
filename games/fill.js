/* Boşluk doldurma: cümledeki boşluğa doğru kelimeyi yerleştir (veri: unit.bosluk = [["cümle ___ .", "doğru|yanlış1|yanlış2"], ...]) */
Games.fill = {
  ad: "Boşluk Doldurma", ikon: "✏️", acik: "Cümledeki boşluğa doğru kelimeyi yerleştir.", uygun: (u) => !!u.bosluk,
  start(ctx) {
    const { el, shuffle, ses } = UI, Q = shuffle(ctx.unit.bosluk).slice(0, 8), root = ctx.root; let i = 0, pt = 0;
    const go = () => {
      const [q, o] = Q[i], op = shuffle(o.split("|").map((t, j) => [t, j === 0])), [a, b] = q.split("___");
      const bl = el("u", { class: "bosluk" }, "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"), fb = el("div", { class: "geri-bildirim" }); let kilit = false;
      const nx = el("button", { class: "btn buyuk", style: "display:none", onclick: () => { i++; i < Q.length ? go() : ctx.bitir({ dogru: pt, toplam: Q.length, puan: pt * 10, yanlis: [], ozet: `${Q.length} cümleden ${pt} tanesini doğru doldurdun.` }); } }, i === Q.length - 1 ? "Sonucu Gör ▶" : "Sonraki ▶");
      const bs = op.map(([t, ok]) => el("button", { class: "btn ikinci", onclick: (e) => {
        if (kilit) return; kilit = true; bl.textContent = t; ok ? (pt++, ses.dogru()) : ses.yanlis();
        bs.forEach((x, j) => { x.disabled = true; if (op[j][1]) x.classList.add("dogru"); }); if (!ok) e.currentTarget.classList.add("yanlis");
        fb.textContent = ok ? "Harika! 🎉" : "Doğrusu yeşil olan 💪"; fb.className = "geri-bildirim " + (ok ? "ok" : "no"); nx.style.display = ""; } }, t));
      root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `Soru ${i + 1} / ${Q.length}`), el("span", {}, `⭐ ${pt * 10} puan`)),
        el("div", { class: "ilerleme" }, el("i", { style: `width:${(i / Q.length) * 100}%` })),
        el("div", { class: "kart soru-kart" }, el("h2", { class: "soru" }, a, bl, b)), el("div", { class: "secenekler" }, bs), fb, el("div", { class: "alt-cubuk" }, nx));
    };
    go();
  }
};
