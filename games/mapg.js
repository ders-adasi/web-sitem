/* Harita yolculuğu (Siyer): şehirleri şematik haritada yerine yerleştir – ders düzeyinde dk.harita = true */
Games.mapg = {
  ad: "Harita Yolculuğu", ikon: "🗺️", acik: "Şehirleri haritada yerine yerleştir.", uygun: (u, d) => !!(u.sinav && d && d.harita),
  start(ctx) {
    const { el } = UI, root = ctx.root, C = [["Şam", 165, 45], ["Medine", 105, 140], ["Mekke", 120, 235], ["Taif", 200, 265]]; let sel = -1, tr = 0; const pl = [];
    const draw = () => {
      const dugmeler = C.map((c, j) => pl[j] ? null : el("button", { class: "btn kucuk" + (sel === j ? "" : " ikinci"), onclick: () => { sel = j; draw(); } }, c[0]));
      const g = C.map((c, j) => `<g data-s="${j}" style="cursor:pointer"><circle cx="${c[1]}" cy="${c[2]}" r="17" fill="${pl[j] ? "#2f9e58" : "#fff"}" stroke="#2f7d4f" stroke-width="3"/><text x="${c[1]}" y="${c[2] + 4}" font-size="10" text-anchor="middle" fill="${pl[j] ? "#fff" : "#999"}">${pl[j] ? c[0] : "?"}</text></g>`).join("");
      const svg = el("div", { html: `<svg viewBox="0 0 300 300" style="width:100%;max-width:380px;background:#cfe9f7;border-radius:16px"><path d="M0 0H70L90 120L100 300H0Z" fill="#8cc4e8"/><text x="8" y="150" font-size="12" fill="#3b7fa6">Kızıldeniz</text>${g}</svg>` });
      svg.querySelectorAll("[data-s]").forEach((gg) => gg.onclick = () => { const j = +gg.dataset.s; if (sel < 0 || pl[j]) return; tr++;
        if (sel === j) { pl[j] = 1; sel = -1; if (pl.filter(Boolean).length === 4) return ctx.bitir({ dogru: tr <= 5 ? 4 : tr <= 8 ? 3 : 2, toplam: 4, puan: 30, yanlis: [], ozet: `Dört şehri ${tr} denemede yerleştirdin!` }); } else UI.toast("Tekrar dene 🧭"); draw(); });
      root.replaceChildren(el("div", { class: "kart" }, el("h3", {}, "🗺️ Harita Yolculuğu"), el("p", {}, "Bir şehir seç, sonra haritada yerine dokun. (Şematik harita, yukarısı kuzey)"), el("div", {}, dugmeler), svg));
    };
    draw();
  }
};
