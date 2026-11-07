/* Bilgi kartları: önce oku (ve dinle), sonra oyna – veri: unit.bilgi = [["başlık", "metin (HTML olabilir)", "görselAnahtarı?"], ...] */
Games.cards = {
  ad: "Bilgi Kartları", ikon: "📚", acik: "Önce oku, sonra oyna!", uygun: (u) => !!(u.bilgi && u.bilgi.length),
  start(ctx) {
    const { el } = UI, dil = (ctx.ders && ctx.ders.dil) || "tr", foto = (window.GORSEL && window.GORSEL.FOTO) || {};
    const duz = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const kart = ([t, h, img]) => el("div", { class: "kart bilgi-kart" },
      el("h3", {}, t + " ", el("button", { class: "btn kucuk ikinci", title: "Sesli oku", "aria-label": "Sesli oku", onclick: () => UI.say(t + ". " + duz(h), dil) }, "🔊")),
      img && foto[img] ? el("img", { src: foto[img], alt: "", class: "bilgi-gorsel" }) : null, el("div", { class: "bilgi-metin", html: h }));
    ctx.root.replaceChildren(el("div", { class: "kart" }, el("h2", {}, "📚 Bilgi Kartları"), el("p", {}, "Önce oku, sonra oyna!")), ...ctx.unit.bilgi.map(kart),
      el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: () => ctx.bitir({ dogru: 1, toplam: 1, puan: 10, yanlis: [], ozet: `${ctx.unit.bilgi.length} bilgi kartını okudun.` }) }, "✔ Okudum")));
  }
};
