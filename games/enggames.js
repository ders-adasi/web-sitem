/* İngilizce oyunları: Listen & Choose ve Spelling Bee (sesli okuma tarayıcının konuşma sentezini kullanır) – veri: unit.ses = [["word","Türkçesi"], ...] */
const sesHavuz = (u) => UI.shuffle(u.ses || []);
const sesTur = (id, ad, ikon, acik, baslik, kur) => { Games[id] = { ad, ikon, acik, uygun: (u) => !!(u.ses && u.ses.length >= 4),
  start(ctx) { const { el, ses } = UI, root = ctx.root; let r = 0, sc = 0;
    const tur = () => { const pool = sesHavuz(ctx.unit), w = pool[0], oynat = () => UI.say(w[0], "en");
      const fb = el("div", {}), ilerle = (ok) => { sc += ok ? 1 : 0; ok ? ses.dogru() : ses.yanlis(); fb.replaceChildren(el("p", {}, ok ? "🎉 Correct!" : `It was “${w[0]}”`, ` = ${w[1]}`),
        el("button", { class: "btn buyuk", onclick: () => { r++; r < 6 ? tur() : ctx.bitir({ dogru: Math.min(sc, 5), toplam: 5, puan: sc * 10, yanlis: [], ozet: `${sc} / 6 correct!` }); } }, r < 5 ? "Next ▶" : "Finish 🏁")); };
      const govde = kur(el, w, pool, ilerle, oynat);
      root.replaceChildren(el("div", { class: "kart", style: "text-align:center" }, el("p", { class: "ders-etiket" }, `${ikon} ${baslik} · ${r + 1}/6 · Score ${sc}`), el("button", { class: "btn buyuk ikinci", onclick: oynat }, "🔊 Play"), ...govde, fb));
      setTimeout(oynat, 250); };
    tur(); } }; };
sesTur("lis", "Listen & Choose", "🎧", "Sesi dinle ve duyduğun kelimeyi seç.", "Listen & Choose", (el, w, pool, ilerle) => {
  const op = UI.shuffle([w[0], ...pool.slice(1, 4).map((x) => x[0])]); let kilit = false;
  const btns = op.map((x) => el("button", { class: "secenek", onclick: () => { if (kilit) return; kilit = true; const ok = x === w[0]; btns.forEach((b) => { b.disabled = true; if (b.textContent === w[0]) b.classList.add("dogru"); }); if (!ok) btns.find((b) => b.textContent === x).classList.add("yanlis"); ilerle(ok); } }, x));
  return [el("p", {}, "Listen and choose the word you hear."), el("div", { class: "secenekler" }, btns)];
});
sesTur("bee", "Spelling Bee", "✍️", "Duyduğun kelimeyi doğru yaz.", "Spelling Bee", (el, w, pool, ilerle) => {
  const inp = el("input", { "aria-label": "Type the word", autocomplete: "off", autocapitalize: "off", spellcheck: "false", style: "text-align:center;font-size:1.3em;max-width:320px" });
  const ck = el("button", { class: "btn buyuk", onclick: () => { ck.remove(); inp.disabled = true; ilerle(inp.value.trim().toLowerCase() === w[0].toLowerCase()); } }, "Check ✔");
  inp.onkeydown = (e) => { if (e.key === "Enter" && ck.isConnected) ck.click(); };
  return [el("p", {}, "💡 " + w[1]), inp, el("p", {}, ck)];
});
