/* Hikâyeli macera: sahneler arasında ilerlemek için soruları çöz (veri: unit.hikaye = [[sahne, soru, "doğru|yanlış|...", açıklama], ...]) */
Games.story = {
  ad: "Hikâyeli Macera", ikon: "🚀", acik: "Hikâyede ilerlemek için soruları çöz.", uygun: (u) => !!u.hikaye,
  start(ctx) {
    const { el, shuffle, ses } = UI, A = ctx.unit.hikaye, root = ctx.root; let i = 0, pt = 0;
    const go = () => {
      const [s, q, o, e] = A[i], op = shuffle(o.split("|").map((t, j) => [t, j === 0])); let tr = 0;
      const fb = el("div", { class: "geri-bildirim" }), nx = el("button", { class: "btn buyuk", style: "display:none", onclick: () => { i++; i < A.length ? go() : ctx.bitir({ dogru: pt, toplam: A.length, puan: pt * 15, yanlis: [], ozet: `Görev tamam! İlk denemede ${pt}/${A.length} doğru.` }); } }, i === A.length - 1 ? "Görevi Bitir ▶" : "Devam →");
      const bs = op.map(([t, ok]) => el("button", { class: "secenek", onclick: (ev) => {
        const b = ev.currentTarget; if (ok) { if (!tr) pt++; ses.dogru(); bs.forEach(x => x.disabled = true); b.classList.add("dogru"); fb.className = "geri-bildirim ok"; fb.textContent = "🎉 Doğru! " + e; nx.style.display = ""; }
        else { tr = 1; ses.yanlis(); b.disabled = true; b.classList.add("yanlis"); fb.className = "geri-bildirim no"; fb.textContent = "🔧 Başka bir seçenek dene!"; } } }, el("span", { class: "metin" }, t)));
      root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `Sahne ${i + 1} / ${A.length}`), el("span", {}, `⭐ ${pt * 15} puan`)), el("div", { class: "ilerleme" }, el("i", { style: `width:${(i / A.length) * 100}%` })),
        el("div", { class: "kart soru-kart" }, el("p", {}, s), el("h2", { class: "soru" }, q)), el("div", { class: "secenekler" }, bs), fb, el("div", { class: "alt-cubuk" }, nx));
    };
    go();
  }
};
