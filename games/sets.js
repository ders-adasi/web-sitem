/* Ders düzeyindeki soru kümeleri (dk.setler): Kim Bu?, Ne Yapardın?, Tamamla */
Games.who = {
  ad: "Kim Bu?", ikon: "🕵️", acik: "İpuçlarından kim (ya da ne) olduğunu bul.", uygun: (u, d) => !!(u.sinav && d && d.setler && d.setler.who && d.setler.who.length > 3),
  start(ctx) {
    const { el, shuffle, ses } = UI, W = ctx.ders.setler.who, R = shuffle(W).slice(0, 3), root = ctx.root; let r = 0, sc = 0;
    const tur = () => {
      const w = R[r], op = shuffle([w[0], ...shuffle(W.filter((x) => x !== w)).slice(0, 3).map((x) => x[0])]); let c = 1;
      const ipucu = el("div", {}), alan = el("div", { class: "secenekler" }), mr = el("button", { class: "btn kucuk ikinci", onclick: () => { c++; ciz(); } }, "💡 Yeni ipucu");
      const ciz = () => { ipucu.replaceChildren(...w[1].slice(0, c).map((t) => el("p", { class: "ipucu-satir" }, "🔎 " + t))); mr.style.display = c < Math.min(4, w[1].length) ? "" : "none";
        el0.textContent = `Tur ${r + 1} / ${R.length} · Doğru bilirsen ${Math.max(5 - c, 1)} puan`; };
      const el0 = el("span", {});
      alan.replaceChildren(...op.map((x, j) => { const b = el("button", { class: "secenek", html: `<span class="no">${j + 1}</span><span class="metin"></span>`, onclick: () => {
        if (x === w[0]) { sc += Math.max(5 - c, 1); ses.dogru(); r++; r < R.length ? tur() : (root._tus = null, ctx.bitir({ dogru: Math.min(sc, 10), toplam: 10, puan: sc * 2, yanlis: [], ozet: `${sc} puan topladın!` })); }
        else { ses.yanlis(); b.classList.add("yanlis"); b.disabled = true; } } }); b.querySelector(".metin").textContent = x; return b; }));
      root.replaceChildren(el("div", { class: "oyun-ust" }, el0, el("span", {}, `⭐ ${sc} puan`)), el("div", { class: "kart soru-kart" }, ipucu, mr), alan); ciz();
    };
    tur();
  }
};
const soruKumesi = (id, ad, ikon, acik, anahtar, n) => { Games[id] = { ad, ikon, acik, uygun: (u, d) => !!(u.sinav && d && d.setler && d.setler[anahtar] && d.setler[anahtar].length),
  start(ctx) { const items = UI.shuffle(ctx.ders.setler[anahtar]).slice(0, n).map((q) => ({ q: { ...q, i: q.i || "Cümleyi dikkatle oku, en uygun seçeneği düşün." }, id: null })); Games.quiz.start({ ...ctx, sorular: items }); } }; };
soruKumesi("sit", "Ne Yapardın?", "🤔", "Verilen durumda en uygun davranışı seç.", "sit", 4);
soruKumesi("hdt", "Tamamla", "🧩", "Eksik kısmı doğru tamamla.", "hdt", 5);
