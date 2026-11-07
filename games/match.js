/* Eşleştirme / hafıza kartı: Arapça kartı ile Türkçe kartı eşleştir */
Games.match = {
  ad: "Hafıza Kartları", ikon: "🃏", acik: "Kartları eşleştir: her kartın eşini bul.", uygun: (u) => !!u.eslestirme,
  start(ctx) {
    const { el, fmt, shuffle, ses } = UI;
    const ciftler = shuffle(ctx.unit.eslestirme).slice(0, 6);
    const kartlar = shuffle(ciftler.flatMap((c, i) => [{ id: i, t: c.ar, ar: true }, { id: i, t: c.tr, ar: false }]));
    let acik = [], bulunan = 0, hamle = 0, kilit = false;
    const root = ctx.root;
    const sayac = el("span", {}, "Hamle: 0"), esl = el("span", {}, `Eşleşen: 0/${ciftler.length}`), bilgi = el("div", { class: "geri-bildirim" }, "İki kart seç ve eşini bul.");
    const dugmeler = kartlar.map((k, i) => {
      const b = el("button", { class: "hafiza" + (UI.isAr(k.t) ? " ar-kart" : ""), onclick: () => cevir(i) },
        el("span", { class: "on" }, "?"), el("span", { class: "arka", html: fmt(k.t) }));
      return b;
    });
    const cevir = (i) => {
      const b = dugmeler[i];
      if (kilit || b.classList.contains("acik") || b.classList.contains("bulundu")) return;
      b.classList.add("acik"); acik.push(i);
      if (acik.length === 2) {
        hamle++; sayac.textContent = "Hamle: " + hamle; kilit = true;
        const [a, c] = acik.map(x => kartlar[x]);
        if (a.id === c.id && a.ar !== c.ar) {
          setTimeout(() => { acik.forEach(x => { dugmeler[x].classList.remove("acik"); dugmeler[x].classList.add("bulundu"); });
            acik = []; kilit = false; bulunan++; esl.textContent = `Eşleşen: ${bulunan}/${ciftler.length}`; ses.dogru(); bilgi.textContent = "Eşleşti! 🎉"; bilgi.className = "geri-bildirim ok";
            if (bulunan === ciftler.length) setTimeout(bitir, 700); }, 450);
        } else {
          setTimeout(() => { acik.forEach(x => dugmeler[x].classList.remove("acik")); acik = []; kilit = false;
            ses.yanlis(); bilgi.textContent = "Olmadı, tekrar dene. Kartların yerini aklında tut! 🧠"; bilgi.className = "geri-bildirim no"; }, 1000);
        }
      }
    };
    const bitir = () => {
      const puan = Math.max(30, 100 - (hamle - ciftler.length) * 6);
      ctx.bitir({ dogru: Math.max(0, Math.min(ciftler.length, Math.round((puan / 100) * ciftler.length))), toplam: ciftler.length, puan, yanlis: [], ozet: `${hamle} hamlede ${ciftler.length} eşleşmeyi buldun. En az hamle: ${ciftler.length}.` });
    };
    root.replaceChildren(
      el("div", { class: "oyun-ust" }, sayac, esl),
      el("div", { class: "hafiza-izgara" }, dugmeler), bilgi);
  }
};
