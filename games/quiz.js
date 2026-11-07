/* Quiz oyunu: çoktan seçmeli, ipucu, anında geri bildirim, yanlışlar tekrar listesine düşer */
Games.quiz = {
  ad: "Bilgi Yarışı", ikon: "❓", acik: "Soruları doğru cevapla, yıldızları topla!", uygun: (u) => !!(u.sorular && u.sorular.length),
  start(ctx) {
    const { el, fmt, shuffle, ses } = UI;
    const havuz = ctx.sorular || ctx.unit.sorular.map((q, i) => ({ q, id: ctx.unit.id + ":" + i }));
    const liste = shuffle(havuz).slice(0, 10);
    let n = 0, dogru = 0, puan = 0; const yanlis = [], dogruIds = [];
    const root = ctx.root;

    const goster = () => {
      const { q, id } = liste[n];
      const sec = shuffle(q.o.map((t, i) => ({ t, ok: i === q.d })));
      let kilit = false, ipucuKullanildi = false;
      const ipucuKutu = el("div", { class: "ipucu" });
      const geri = el("div", { class: "geri-bildirim" });
      const sonraki = el("button", { class: "btn buyuk", style: "display:none", onclick: () => { n++; n < liste.length ? goster() : bitir(); } }, n === liste.length - 1 ? "Sonucu Gör ▶" : "Sonraki ▶");
      const btns = sec.map((s, i) => {
        const b = el("button", { class: "secenek" + (UI.isAr(s.t) ? " ar-sec" : ""), html: `<span class="no">${i + 1}</span><span class="metin">${fmt(s.t)}</span>`, onclick: () => sec_(i) });
        return b;
      });
      const sec_ = (i) => {
        if (kilit) return; kilit = true;
        const ok = sec[i].ok; if (q.k) Store.rec(q.k, ok);
        btns.forEach((b, j) => { b.disabled = true; if (sec[j].ok) b.classList.add("dogru"); });
        if (ok) { dogru++; puan += ipucuKullanildi ? 5 : 10; if (id) dogruIds.push(id); ses.dogru(); btns[i].classList.add("dogru"); }
        else { btns[i].classList.add("yanlis"); if (id) yanlis.push(id); ses.yanlis(); }
        geri.innerHTML = `<b>${ok ? "Harika! 🎉" : "Sorun değil, birlikte bakalım 💪"}</b> ${fmt(q.a)}`;
        geri.className = "geri-bildirim " + (ok ? "ok" : "no");
        sonraki.style.display = ""; sonraki.focus();
      };
      root.replaceChildren(
        el("div", { class: "oyun-ust" }, el("span", {}, `Soru ${n + 1} / ${liste.length}`), el("span", {}, `⭐ ${puan} puan`)),
        el("div", { class: "ilerleme" }, el("i", { style: `width:${(n / liste.length) * 100}%` })),
        el("div", { class: "kart soru-kart" }, UI.gorsel(q.k), el("h2", { class: "soru", html: fmt(q.s) }), el("button", { class: "btn kucuk ikinci okuma", title: "Sesli oku", "aria-label": "Sesli oku", onclick: () => UI.say(q.s.replace(/\{\/?[ib]\}/g, " ") + ". " + q.o.join(", "), (ctx.ders && ctx.ders.dil) || "tr") }, "🔊"),
          el("button", { class: "btn kucuk ikinci", onclick: () => { if (kilit) return; ipucuKullanildi = true; ipucuKutu.textContent = "💡 " + q.i; } }, "💡 İpucu (−5 puan)"),
          ipucuKutu),
        el("div", { class: "secenekler" }, btns), geri, el("div", { class: "alt-cubuk" }, sonraki)
      );
      root._tus = (e) => { const k = parseInt(e.key); if (k >= 1 && k <= btns.length) sec_(k - 1); else if (e.key === "Enter" && kilit) sonraki.click(); };
    };
    const bitir = () => { root._tus = null; ctx.bitir({ dogru, toplam: liste.length, puan, yanlis, dogruIds, ozet: `${liste.length} sorudan ${dogru} tanesini doğru yaptın.` }); };
    goster();
  }
};
