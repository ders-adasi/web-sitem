/* Ortak yardımcılar */
const UI = (() => {
  const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
  const el = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    for (const k in (attrs || {})) {
      const v = attrs[k];
      if (k === "class") e.className = v; else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    kids.flat().forEach(c => { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c)); });
    return e;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* Metin içindeki Arapça kısımları .ar span'ına sarar */
  const fmt = (t) => {
    const A = "\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF";
    const re = new RegExp("(«?[" + A + "][" + A + "\\s،؟«»]*[" + A + "؟]»?|«?[" + A + "]»?)", "g");
    return esc(t).replace(re, '<span class="ar" dir="rtl">$1</span>')
      .replace(/\n/g, "<br>").replace(/\{(\/?)([ib])\}/g, "<$1$2>");   /* mini işaretleme: \n satır sonu, {i}…{/i} eğik, {b}…{/b} kalın */
  };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const isAr = (t) => AR.test(t);
  let ctx = null, sesAcik = true;
  const ton = (f, s, tip) => { if (!sesAcik) return; try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = tip || "sine"; o.frequency.value = f; g.gain.value = 0.08;
    o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + s); o.stop(ctx.currentTime + s); } catch (e) {} };
  const ses = {
    set(v) { sesAcik = v; }, get() { return sesAcik; },
    dogru() { ton(660, .12); setTimeout(() => ton(880, .18), 110); },
    yanlis() { ton(300, .22, "triangle"); },
    bitti() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => ton(f, .2), i * 130)); }
  };
  const toast = (m) => { const t = el("div", { class: "toast" }, m); document.body.append(t); setTimeout(() => t.classList.add("goster"), 10); setTimeout(() => { t.classList.remove("goster"); setTimeout(() => t.remove(), 400); }, 3200); };
  const yildizHtml = (n, max = 3) => "★".repeat(n) + "☆".repeat(max - n);
  const gorsel = (k) => { const G = window.GORSEL; if (!k || !G) return null; return el("div", { class: "gorsel", html: G.IMG[k] || `<div class="gorsel-ikon">${G.ICON[k] || "🔭"}</div>` }); };
  /* Sesli okuma (tarayıcının konuşma sentezi; yoksa sessizce atlanır) */
  const say = (t, dil) => { try { if (!window.speechSynthesis) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(t)); u.lang = dil === "en" ? "en-US" : "tr-TR"; u.rate = .9; speechSynthesis.speak(u); } catch (e) {} };
  /* Görünüm ayarları (cihaza özgü): tema, büyük yazı, okunaklı yazı */
  const gorunum = (() => {
    const K = "dos_gorunum"; let s = { tema: "auto", buyuk: 0, okunakli: 0 };
    try { Object.assign(s, JSON.parse(localStorage.getItem(K) || "{}")); } catch (e) {}
    const uygula = () => { const r = document.documentElement, koyu = s.tema === "koyu" || (s.tema === "auto" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
      r.classList.toggle("koyu", !!koyu); r.classList.toggle("buyuk", !!s.buyuk); r.classList.toggle("okunakli", !!s.okunakli); };
    const set = (k, v) => { s[k] = v; try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} uygula(); };
    const panel = () => { const var_ = document.getElementById("gorunum-panel"); if (var_) return var_.remove();
      const o = el("div", { id: "gorunum-panel", class: "kart gorunum-panel", role: "dialog", "aria-label": "Görünüm ayarları" }, el("h3", {}, "🎨 Görünüm"),
        el("label", {}, "Tema: ", el("select", { onchange: (e) => set("tema", e.target.value) }, [["auto", "Otomatik"], ["acik", "Açık"], ["koyu", "Koyu"]].map(([v, t]) => el("option", Object.assign({ value: v }, s.tema === v ? { selected: true } : {}), t)))),
        el("label", {}, el("input", Object.assign({ type: "checkbox", onchange: (e) => set("buyuk", e.target.checked ? 1 : 0) }, s.buyuk ? { checked: true } : {})), " Büyük yazı"),
        el("label", {}, el("input", Object.assign({ type: "checkbox", onchange: (e) => set("okunakli", e.target.checked ? 1 : 0) }, s.okunakli ? { checked: true } : {})), " Okunaklı yazı tipi"),
        el("button", { class: "btn kucuk ikinci", onclick: () => o.remove() }, "Kapat")); document.body.append(o); };
    uygula(); return { uygula, panel, get: () => s };
  })();
  return { el, esc, fmt, shuffle, isAr, ses, toast, yildizHtml, gorsel, say, gorunum };
})();
const Games = {};
