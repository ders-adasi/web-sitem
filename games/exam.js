/* Sınav modu: süreli, ipucusuz mini yazılı; sonunda kazanım karnesi */
Games.exam = {
  ad: "Sınav Modu", ikon: "📝", acik: "Süreli mini yazılı; sonunda kazanım karnesi.", uygun: (u) => !!u.sinav,
  start(ctx) {
    const { el, shuffle, fmt } = UI, root = ctx.root, u = ctx.unit;
    const L = shuffle(u.sorular.map((q, i) => ({ q, id: u.id + ":" + i }))).map(x => ({ ...x, o: shuffle(x.q.o.map((t, j) => [t, j === x.q.d])) }));
    let t = L.length * 60, iv; const tm = el("b", {});
    const bit = () => { clearInterval(iv); root._tus = null; let ok = 0; const kr = {}, yan = [], dgr = [];
      L.forEach((x, i) => { const c = root.querySelector(`input[name=q${i}]:checked`), g = !!(c && x.o[+c.value][1]), k = x.q.k || "genel";
        kr[k] = kr[k] || [0, 0]; kr[k][1]++; if (x.q.k) Store.rec(x.q.k, g); if (g) { ok++; kr[k][0]++; dgr.push(x.id); } else yan.push(x.id); });
      const ad = ctx.kz || {};
      ctx.bitir({ dogru: ok, toplam: L.length, puan: ok * 10, yanlis: yan, dogruIds: dgr, ozet: "Karne: " + Object.entries(kr).map(([k, v]) => `${v[0] === v[1] ? "🟢" : v[0] ? "🟡" : "🔴"} ${ad[k] || k} ${v[0]}/${v[1]}`).join(" · ") }); };
    root.replaceChildren(el("div", { class: "oyun-ust" }, el("span", {}, "⏱ Kalan süre: ", tm), el("span", {}, `${L.length} soru`)),
      ...L.map((x, i) => el("div", { class: "kart soru-kart" }, el("h3", { class: "soru", html: `${i + 1}. ` + fmt(x.q.s) }),
        ...x.o.map((o, j) => el("label", { class: "secenek sinav-sec" }, el("input", { type: "radio", name: "q" + i, value: j }), " ", o[0])))),
      el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: bit }, "✔ Sınavı bitir")));
    const tk = () => { if (!document.body.contains(root)) return clearInterval(iv); tm.textContent = Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); if (t-- <= 0) bit(); };
    iv = setInterval(tk, 1000); tk();
  }
};
