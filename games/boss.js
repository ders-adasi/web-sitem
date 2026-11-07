/* Boss Savaşı ve İki Kişilik Düello – soru havuzu: sorular + doğru/yanlış + boşluk doldurma */
const havuzUret = (u) => { const P = [...(u.sorular || [])];
  (u.dy || []).forEach(([t, ok, ex]) => P.push({ s: t + "\n{i}Bu cümle doğru mu?{/i}", o: ["Doğru", "Yanlış"], d: ok ? 0 : 1, a: ex || "" }));
  (u.bosluk || []).forEach(([t, o]) => P.push({ s: t, o: o.split("|"), d: 0, a: "" })); return P; };
Games.boss = {
  ad: "Boss Savaşı", ikon: "👹", acik: "Canavarı yenmek için doğru cevapla; yanlışlar canını azaltır!", uygun: (u) => !!(u.sinav && (u.sorular || []).length > 3),
  start(ctx) {
    const { el, fmt, shuffle, ses } = UI, L = shuffle(havuzUret(ctx.unit)).slice(0, 12), root = ctx.root; let i = 0, hp = Math.ceil(L.length * 0.75), can = 3, vur = 0;
    const bit = () => { root._tus = null; const ok = hp <= 0; ctx.bitir({ dogru: ok ? L.length : vur, toplam: L.length, puan: vur * 10 + (ok ? 30 : 0), yanlis: [], ozet: ok ? `Canavarı yendin! 🏆 (${vur} vuruş)` : `Canavar kazandı; ${vur} vuruş yaptın. Tekrar dene!` }); };
    const go = () => {
      if (hp <= 0 || can <= 0 || i >= L.length) return bit();
      const q = L[i], sec = shuffle(q.o.map((t, j) => ({ t, ok: j === q.d }))); let kilit = false; const fb = el("div", { class: "geri-bildirim" });
      const nx = el("button", { class: "btn buyuk", style: "display:none", onclick: () => { i++; go(); } }, "Devam ▶");
      const btns = sec.map((s, j) => el("button", { class: "secenek", html: `<span class="no">${j + 1}</span><span class="metin">${fmt(s.t)}</span>`, onclick: () => cvp(j) }));
      const cvp = (j) => { if (kilit) return; kilit = true; btns.forEach((b, k) => { b.disabled = true; if (sec[k].ok) b.classList.add("dogru"); });
        if (sec[j].ok) { hp--; vur++; ses.dogru(); } else { can--; btns[j].classList.add("yanlis"); ses.yanlis(); }
        fb.className = "geri-bildirim " + (sec[j].ok ? "ok" : "no"); fb.innerHTML = (sec[j].ok ? "💥 Vurdun! " : "💔 Canavar vurdu! ") + fmt(q.a || ""); nx.style.display = ""; };
      root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, "❤️".repeat(can) + "🖤".repeat(3 - can)), el("span", {}, "👹 " + "🟥".repeat(Math.max(hp, 0)))),
        el("div", { class: "kart soru-kart" }, UI.gorsel(q.k), el("h2", { class: "soru", html: fmt(q.s) })), el("div", { class: "secenekler" }, btns), fb, el("div", { class: "alt-cubuk" }, nx));
      root._tus = (e) => { const k = parseInt(e.key); if (k >= 1 && k <= btns.length) cvp(k - 1); else if (e.key === "Enter" && kilit) nx.click(); };
    };
    go();
  }
};
Games.duel = {
  ad: "İki Kişilik Düello", ikon: "🤼", acik: "Aynı cihazda sırayla cevaplayın.", uygun: (u) => !!(u.sinav && (u.sorular || []).length > 3),
  start(ctx) {
    const { el, fmt, shuffle, ses } = UI, root = ctx.root, p1 = el("input", { placeholder: "1. oyuncu", maxlength: 14 }), p2 = el("input", { placeholder: "2. oyuncu", maxlength: 14 });
    root.replaceChildren(el("div", { class: "kart" }, el("h2", {}, "🤼 İki Kişilik Düello"), el("p", {}, "Aynı cihazda sırayla cevaplayın. Takma ad yazın (gerçek ad şart değil):"), p1, el("br"), p2,
      el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: () => basla([p1.value || "Oyuncu 1", p2.value || "Oyuncu 2"]) }, "Başla"))));
    const basla = (n) => { const L = shuffle(havuzUret(ctx.unit)).slice(0, 10), s = [0, 0]; let x = 0;
      const go = () => {
        if (x >= L.length) { const w = s[0] === s[1] ? "Berabere! 🤝" : (s[0] > s[1] ? n[0] : n[1]) + " kazandı! 🏆"; root._tus = null;
          return ctx.bitir({ dogru: 1, toplam: 1, puan: 10, yanlis: [], ozet: `${w} ${n[0]}: ${s[0]} · ${n[1]}: ${s[1]}` }); }
        const q = L[x], p = x % 2, sec = shuffle(q.o.map((t, j) => ({ t, ok: j === q.d }))); let kilit = false;
        const btns = sec.map((o, j) => el("button", { class: "secenek", html: `<span class="no">${j + 1}</span><span class="metin">${fmt(o.t)}</span>`, onclick: () => cvp(j) }));
        const cvp = (j) => { if (kilit) return; kilit = true; btns.forEach((b, k) => { b.disabled = true; if (sec[k].ok) b.classList.add("dogru"); }); if (sec[j].ok) { s[p]++; ses.dogru(); } else { btns[j].classList.add("yanlis"); ses.yanlis(); } x++; setTimeout(go, 1100); };
        root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, `${n[0]} ${s[0]} – ${s[1]} ${n[1]}`), el("span", {}, `Soru ${x + 1}/${L.length}`)), el("div", { class: "kart soru-kart" }, el("p", { class: "ders-etiket" }, "Sıra: " + n[p]), el("h2", { class: "soru", html: fmt(q.s) })), el("div", { class: "secenekler" }, btns));
      }; go(); };
  }
};
