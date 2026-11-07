/* Kelime Kur: parçaları (harf veya kelime) doğru sırayla dizerek Arapça yazıyı oluştur.
   Harf modunda harfler birleştirilince tarayıcı bağlı yazıyı kendisi gösterir. */
Games.build = {
  ad: "Kelime Atölyesi", ikon: "🧩", acik: "Harf ve kelime parçalarını sırayla dizerek yaz.", uygun: (u) => !!u.kur,
  start(ctx) {
    const { el, fmt, shuffle, ses } = UI;
    const kur = ctx.unit.kur, harfMod = kur.mod === "harf";
    const liste = shuffle(kur.ogeler).slice(0, 8);
    let n = 0, dogru = 0, puan = 0;
    const root = ctx.root;

    const goster = () => {
      const o = liste[n];
      const hedef = harfMod ? o.h : o.p;
      const parcalar = shuffle(hedef.concat(harfMod ? (o.x || []) : []).map((t, i) => ({ t, id: i })));
      let secili = [], deneme = 0, kilit = false, goster_cevap = "";
      const yazi = el("div", { class: "kur-yazi ar", dir: "rtl" });
      const geri = el("div", { class: "geri-bildirim" });
      const ipucuKutu = el("div", { class: "ipucu" });
      const birlestir = () => secili.map(s => s.t).join(harfMod ? "" : " ");
      const guncelle = () => { yazi.textContent = goster_cevap || birlestir() || "…"; chips.forEach(c => c.b.disabled = kilit || secili.includes(c.p)); };
      const chips = parcalar.map(p => ({ p, b: el("button", { class: "chip ar", dir: "rtl", onclick: () => { if (kilit) return; secili.push(p); guncelle(); } }, p.t) }));
      const kontrol = () => {
        if (kilit || !secili.length) return; deneme++;
        const ok = secili.length === hedef.length && secili.every((s, i) => s.t === hedef[i]);
        if (ok) { kilit = true; dogru++; puan += deneme === 1 ? 12 : 6; ses.dogru(); yazi.classList.add("dogru");
          geri.innerHTML = `<b>Süper! 🎉</b> ${fmt(harfMod ? o.ar : o.p.join(" "))}`; geri.className = "geri-bildirim ok"; sonraki.style.display = ""; sonraki.focus(); }
        else if (deneme >= 2) { kilit = true; ses.yanlis(); secili = []; yazi.classList.add("yanlis");
          goster_cevap = harfMod ? o.h.join("") : o.p.join(" ");
          geri.innerHTML = `<b>Doğru yazılışı bu 💪</b> Bir dahaki sefere yapacaksın.`; geri.className = "geri-bildirim no"; sonraki.style.display = ""; sonraki.focus(); }
        else { ses.yanlis(); geri.innerHTML = "<b>Neredeyse!</b> Arapça sağdan sola yazılır; ilk parça en sağda durur. Bir kez daha dene."; geri.className = "geri-bildirim no"; secili = []; }
        guncelle();
      };
      const sonraki = el("button", { class: "btn buyuk", style: "display:none", onclick: () => { n++; n < liste.length ? goster() : bitir(); } }, n === liste.length - 1 ? "Sonucu Gör ▶" : "Sonraki ▶");
      root.replaceChildren(
        el("div", { class: "oyun-ust" }, el("span", {}, `Görev ${n + 1} / ${liste.length}`), el("span", {}, `⭐ ${puan} puan`)),
        el("div", { class: "ilerleme" }, el("i", { style: `width:${(n / liste.length) * 100}%` })),
        el("div", { class: "kart soru-kart" },
          el("h2", { class: "soru" }, harfMod ? `«${o.tr}» kelimesini Arapça yaz` : `«${o.tr}» ifadesini Arapça kur`),
          el("button", { class: "btn kucuk ikinci", onclick: () => { if (kilit) return; ipucuKutu.innerHTML = "💡 İlk parça: <span class='ar'>" + UI.esc(hedef[0]) + "</span>"; } }, "💡 İpucu"),
          ipucuKutu),
        yazi, el("div", { class: "chipler", dir: "rtl" }, chips.map(c => c.b)),
        el("div", { class: "alt-cubuk" },
          el("button", { class: "btn ikinci", onclick: () => { if (!kilit) { secili.pop(); guncelle(); } } }, "↩ Geri al"),
          el("button", { class: "btn", onclick: kontrol }, "✔ Kontrol et"), sonraki),
        geri);
      root._tus = (e) => { if (e.key === "Enter") (sonraki.style.display === "" ? sonraki : { click: kontrol }).click(); if (e.key === "Backspace" && !kilit) { secili.pop(); guncelle(); } };
      guncelle();
    };
    const bitir = () => { root._tus = null; ctx.bitir({ dogru, toplam: liste.length, puan, yanlis: [], ozet: `${liste.length} görevden ${dogru} tanesini yazdın.` }); };
    goster();
  }
};
