/* Etkinlik kâğıdı: yazdırılabilir çalışma yaprağı (boşluk doldurma + doğru/yanlış + sıralama) */
Games.sheet = {
  ad: "Etkinlik Kâğıdı", ikon: "📝", acik: "Yazdırılabilir çalışma kâğıdı (cevap anahtarıyla).", uygun: (u) => !!(u.sinav && u.bosluk && u.bosluk.length),
  start(ctx) {
    const { el, shuffle } = UI, u = ctx.unit, bs = u.bosluk.slice(0, 8), ds = (u.dy || []).slice(0, 6), sr = (u.siralama || [])[0], root = ctx.root;
    const secs = [el("h3", {}, "A) Boşlukları doldur"), ...bs.map((b, n) => el("p", {}, `${n + 1}. `, ...b[0].split("___").flatMap((p, k, a) => k < a.length - 1 ? [p, el("u", {}, "\u00a0".repeat(12))] : [p]), el("br"), el("small", {}, "(" + shuffle(b[1].split("|")).join(" / ") + ")")))];
    if (ds.length) secs.push(el("h3", {}, "B) Doğru (D) / Yanlış (Y)"), ...ds.map((d, n) => el("p", {}, `${n + 1}. ( ) ${d[0]}`)));
    if (sr) secs.push(el("h3", {}, `C) “${sr[0]}” – 1, 2, 3… diye numaralandır`), ...shuffle(sr[1]).map((x) => el("p", {}, `( ) ${x}`)));
    const anahtar = `A: ${bs.map((b) => b[1].split("|")[0]).join(", ")}` + (ds.length ? ` · B: ${ds.map((d) => d[1] ? "D" : "Y").join(", ")}` : "") + (sr ? ` · C: ${sr[1].join(" → ")}` : "");
    root.replaceChildren(el("div", { class: "kart yazdirma" }, el("h2", {}, `📝 Etkinlik Kâğıdı · ${u.ad}`), el("p", {}, "Ad Soyad: ____________________ Sınıf: ______"), ...secs, el("hr"), el("small", {}, el("b", {}, "Cevap anahtarı (öğretmen/veli): "), anahtar)),
      el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: () => window.print() }, "🖨️ Yazdır / PDF olarak kaydet"),
        el("button", { class: "btn buyuk ikinci", onclick: () => ctx.bitir({ dogru: 1, toplam: 1, puan: 5, yanlis: [], ozet: "Etkinlik kâğıdını hazırladın." }) }, "✔ Tamamladım")));
  }
};
