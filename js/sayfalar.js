/* Ders bilgi sayfaları: her biri (dk = ders verisi, H = {oyna, ders}) alır, bir DOM düğümü döndürür.
   Yeni sayfa türü: Sayfalar.<id> = (dk, H) => düğüm; sonra dersin "sayfalar" listesine {id, ad} ekleyin. */
window.Sayfalar = {
  sozluk(dk) {
    const { el } = UI, q = el("input", { type: "search", placeholder: "Ara…", "aria-label": "Sözlükte ara" }), liste = el("div", { class: "sozluk-liste" });
    const ciz = () => { const f = q.value.trim().toLocaleLowerCase(dk.dil === "en" ? "en" : "tr");
      liste.replaceChildren(...dk.sozluk.filter(([t, d]) => !f || (t + " " + d).toLocaleLowerCase(dk.dil === "en" ? "en" : "tr").includes(f)).map(([t, d]) =>
        el("div", { class: "sozluk-satir" }, el("b", {}, t), " – ", el("span", { html: UI.fmt(d) }), " ", el("button", { class: "btn kucuk ikinci", "aria-label": "Sesli oku", onclick: () => UI.say(t, dk.dil) }, "🔊")))); };
    q.oninput = ciz; ciz(); return el("div", { class: "kart" }, el("h2", {}, "📖 Sözlük / Dictionary"), q, liste);
  },
  zaman(dk) {
    const { el } = UI;
    return el("div", { class: "kart" }, el("h2", {}, "⏳ Zaman Şeridi"), ...dk.zaman.map(([e, t, d]) => el("div", { class: "zaman-oge" }, el("span", { class: "zaman-ikon" }, e),
      el("div", {}, el("b", {}, t), el("p", {}, d), el("button", { class: "btn kucuk ikinci", "aria-label": "Sesli oku", onclick: () => UI.say(t + ". " + d, dk.dil) }, "🔊")))));
  },
  agac(dk) {
    const { el } = UI, dugum = (n) => { const [ad, bilgi, cocuk] = Array.isArray(n) ? n : [String(n)]; return el("details", { class: "agac-dugum" }, el("summary", {}, ad), el("div", {}, bilgi ? el("p", { html: UI.fmt(String(bilgi)) }) : null, ...((Array.isArray(cocuk) ? cocuk : []).map(dugum)))); };
    return el("div", { class: "kart" }, el("h2", {}, dk.agacAd || "Ağaç"), el("p", { class: "kucuk-not" }, "Bir düğüme dokunarak aç/kapat."), dugum(dk.agac));
  },
  hikaye(dk, H) {
    const { el } = UI, alan = el("div", {});
    const menu = () => alan.replaceChildren(el("div", { class: "kart" }, el("h2", {}, "📖 Hikâye Modu"), el("p", {}, "Hikâyeyi oku ya da dinle, sonunda mini oyunu çöz."),
      ...dk.hikayeler.map((h, n) => el("button", { class: "btn buyuk ikinci", onclick: () => ac(n) }, `${h[1]} ${h[0]}`))));
    const ac = (n) => { const [t, e, P, mini] = dk.hikayeler[n]; let i = 0;
      const ciz = () => { const s = P[i]; alan.replaceChildren(el("div", { class: "kart hikaye-kart" }, el("p", { class: "ders-etiket" }, `${e} ${t} · ${i + 1}/${P.length}`), el("div", { class: "hikaye-emoji" }, s[0]), el("p", { class: "hikaye-metin" }, s[1]),
        el("div", { class: "alt-cubuk" }, el("button", { class: "btn ikinci", onclick: () => UI.say(s[1], dk.dil) }, "🔊 Dinle"), i > 0 ? el("button", { class: "btn ikinci", onclick: () => { i--; ciz(); } }, "◀ Geri") : null,
          el("button", { class: "btn buyuk", onclick: () => { if (i < P.length - 1) { i++; ciz(); } else if (mini && mini.length) H.oyna({ id: `${H.ders}-hikaye-${n}`, ad: t, bolge: "Hikâye Modu", ikon: e, ar: "", kazanimlar: ["Hikâyeyi oku, mini oyunu çöz!"], sorular: mini, sinav: false }, "quiz"); else menu(); } }, i < P.length - 1 ? "Sonraki ▶" : "Bitir ✔")))); };
      ciz(); };
    menu(); return alan;
  },
  inceleme(dk, H) {
    const { el, fmt } = UI, K = "dos_inceleme_" + H.ders; let on = {}; try { on = JSON.parse(localStorage.getItem(K) || "{}"); } catch (e) {}
    const kaydet = () => { try { localStorage.setItem(K, JSON.stringify(on)); } catch (e) {} };
    const birimler = dk.uniteler.filter((u) => u.sinav && u.sorular.length);
    const csv = () => { const r = [["Ünite", "Soru", "Doğru cevap", "Açıklama", "Kitapla doğrulandı"]]; birimler.forEach((u) => u.sorular.forEach((q, i) => r.push([`${u.bolge} ${u.ad}`, q.s, q.o[q.d], q.a, on[`${u.id}:${i}`] ? "evet" : ""])));
      const t = "\ufeff" + r.map((x) => x.map((c) => '"' + String(c || "").replace(/\{\/?[ib]\}/g, "").replace(/\n/g, " ").replace(/"/g, '""') + '"').join(";")).join("\n"), a = el("a", { href: URL.createObjectURL(new Blob([t], { type: "text/csv" })), download: "icerik-inceleme.csv" }); a.click(); };
    return el("div", { class: "kart" }, el("h2", {}, "🧑‍🏫 İçerik İnceleme"), el("p", {}, "Soruları ders kitabıyla karşılaştırıp “doğrulandı” kutusunu işaretleyin. İşaretler yalnızca bu cihazda saklanır; CSV olarak indirebilirsiniz."),
      el("button", { class: "btn kucuk", onclick: csv }, "⬇️ CSV indir"),
      ...birimler.map((u) => el("details", { class: "agac-dugum" }, el("summary", {}, `${u.bolge} · ${u.ad} (${u.sorular.length} soru)`),
        ...u.sorular.map((q, i) => el("div", { class: "inceleme-soru" }, el("p", { html: `<b>${i + 1}.</b> ${fmt(q.s)}` }), el("ul", {}, q.o.map((o, j) => el("li", { class: j === q.d ? "dogru-secenek" : "", html: fmt(o) + (j === q.d ? " ✓" : "") }))),
          q.a ? el("p", { class: "kucuk-not", html: fmt(q.a) }) : null,
          el("label", {}, el("input", Object.assign({ type: "checkbox", onchange: (e) => { on[`${u.id}:${i}`] = e.target.checked; kaydet(); } }, on[`${u.id}:${i}`] ? { checked: true } : {})), " Kitapla doğruladım"))))));
  }
};
