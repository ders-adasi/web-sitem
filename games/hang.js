/* Adam asmaca – veri: unit.kelimeler = [["KELİME","ipucu"], ...]; dil: ders.dil ("tr" | "en") */
Games.hang = {
  ad: "Adam Asmaca", ikon: "🔤", acik: "Harfleri seçerek gizli kelimeyi bul.", uygun: (u) => !!(u.kelimeler && u.kelimeler.length > 2),
  start(ctx) {
    const { el, shuffle, ses } = UI, root = ctx.root, WS = shuffle(ctx.unit.kelimeler).slice(0, 5), AL = [...((ctx.ders && ctx.ders.dil === "en") ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ")]; let w = 0, sc = 0;
    const tur = () => { const [wd, ip] = WS[w], u = new Set(); let can = 8;
      const draw = () => { const bitti = ![...wd].some((c) => !u.has(c) && AL.includes(c)), son = bitti || can === 0;
        root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `Kelime ${w + 1} / ${WS.length}`), el("span", {}, "❤️".repeat(can))),
          el("div", { class: "kart soru-kart" }, el("p", {}, "💡 " + ip), el("h1", { class: "harfler" }, [...wd].map((c) => (u.has(c) || can === 0 || !AL.includes(c)) ? c : "_").join(" ")),
            son ? el("p", {}, bitti ? "🎉 Buldun!" : "Doğrusu yukarıda yazıyor, bir dahaki sefere!") : null),
          son ? el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: () => { sc += bitti ? 1 : 0; w++; w < WS.length ? tur() : ctx.bitir({ dogru: sc, toplam: WS.length, puan: sc * 12, yanlis: [], ozet: `${WS.length} kelimeden ${sc} tanesini buldun.` }); } }, w === WS.length - 1 ? "Sonucu Gör ▶" : "Sonraki ▶"))
              : el("div", { class: "harf-izgara" }, AL.map((c) => el("button", { class: "harf", disabled: u.has(c), onclick: () => { u.add(c); if (![...wd].includes(c)) { can--; ses.yanlis(); } else ses.dogru(); draw(); } }, c)))); };
      draw(); };
    tur();
  }
};
