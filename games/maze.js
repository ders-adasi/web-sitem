/* Bilgi labirenti: kilitli kapılar soruyla açılır; bayrağa ulaş */
Games.maze = {
  ad: "Bilgi Labirenti", ikon: "🧭", acik: "Kapıları doğru cevapla aç, bayrağa ulaş!", uygun: (u) => !!u.salon,
  start(ctx) {
    const { el, shuffle, ses } = UI, root = ctx.root, n = 7, P = ctx.unit.sorular;
    const W = [...Array(n * n)].map(() => [1, 1, 1, 1]), D = [[0, -1], [1, 0], [0, 1], [-1, 0]], vs = new Set([0]), st = [0];
    while (st.length) { const c = st[st.length - 1], x = c % n, y = (c / n) | 0, nb = shuffle([0, 1, 2, 3]).filter(k => { const X = x + D[k][0], Y = y + D[k][1]; return X >= 0 && X < n && Y >= 0 && Y < n && !vs.has(Y * n + X); });
      if (!nb.length) { st.pop(); continue; } const k = nb[0], m = (y + D[k][1]) * n + x + D[k][0]; W[c][k] = 0; W[m][(k + 2) % 4] = 0; vs.add(m); st.push(m); }
    const gt = new Set(shuffle([...Array(n * n - 2).keys()].map(i => i + 1)).slice(0, 3)); let pos = 0, dg = 0, dn = 0, kilit = false;
    const grid = el("div", { class: "lab-izgara", style: `grid-template-columns:repeat(${n},1fr)` }), qa = el("div", {});
    const draw = () => grid.replaceChildren(...W.map((w, i) => el("div", { class: "lab-hucre", style: `border-width:${w.map(v => v ? 3 : 0).join("px ")}px` }, pos === i ? "🧑‍🚀" : i === n * n - 1 ? "🏁" : gt.has(i) ? "🔒" : "")));
    const ask = (c) => {
      kilit = true; const q = shuffle(P)[0], op = shuffle(q.o.map((t, j) => [t, j === q.d]));
      const bs = op.map(([t, ok]) => el("button", { class: "secenek", onclick: () => {
        dn++;
        if (ok) { dg++; ses.dogru(); gt.delete(c); pos = c; qa.replaceChildren(el("div", { class: "geri-bildirim ok" }, "🎉 Kapı açıldı! " + q.a)); kilit = false; draw(); }
        else { ses.yanlis(); qa.replaceChildren(el("div", { class: "geri-bildirim no" }, "🌱 Olmadı, başka bir yoldan dene!")); kilit = false; }
      } }, el("span", { class: "metin" }, t)));
      qa.replaceChildren(el("div", { class: "kart" }, UI.gorsel(q.k), el("h3", { class: "soru" }, "🔒 " + q.s), el("div", { class: "secenekler" }, bs)));
    };
    const move = (k) => { if (kilit || W[pos][k]) return; const c = pos + D[k][1] * n + D[k][0]; qa.replaceChildren(); if (gt.has(c)) return ask(c); pos = c; draw();
      if (pos === n * n - 1) { root._tus = null; ctx.bitir({ dogru: dn ? dg : 1, toplam: dn || 1, puan: 40 + dg * 10, yanlis: [], ozet: `Labirentten çıktın! ${dg} kapıyı açtın.` }); } };
    const ok = (s, k) => el("button", { class: "btn ikinci", onclick: () => move(k) }, s);
    root.replaceChildren(el("div", { class: "kart" }, el("h2", {}, "🧭 Bilgi Labirenti"), el("p", {}, "🧑‍🚀 ile 🏁’e ulaş. Ok tuşları, WASD ya da düğmeler. 🔒 kapılar doğru cevapla açılır."), grid,
      el("div", { class: "alt-cubuk" }, ok("⬆️", 0), ok("⬅️", 3), ok("⬇️", 2), ok("➡️", 1))), qa);
    root._tus = (e) => { const k = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, w: 0, d: 1, s: 2, a: 3 }[e.key]; if (k != null) { e.preventDefault(); move(k); } };
    draw();
  }
};
