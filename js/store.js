/* Profil + ilerleme kaydı (test aşaması: localStorage).
   UYARI: Bu GERÇEK güvenlik değildir. Yayında arka uç (ör. Supabase/Firebase) gerekir. */
const Store = (() => {
  const KEY = "dos_v1", SES = "dos_oturum";
  let mem = null;
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { users: {} }; } catch (e) { return mem || { users: {} }; } };
  const write = (d) => { mem = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const hash = (s) => { let h1 = 5381, h2 = 52711; for (const c of s) { h1 = (h1 * 33) ^ c.charCodeAt(0); h2 = (h2 * 31 + c.charCodeAt(0)) | 0; } return (h1 >>> 0).toString(36) + (h2 >>> 0).toString(36); };
  const today = () => new Date().toISOString().slice(0, 10);
  const BADGES = {
    ilk: { ad: "İlk Adım", ikon: "👣", acik: "İlk oyununu tamamladın." },
    uc: { ad: "Üç Yıldız", ikon: "🌟", acik: "Bir oyundan 3 yıldız aldın." },
    seri3: { ad: "3 Gün Seri", ikon: "🔥", acik: "Üst üste 3 gün çalıştın." },
    xp200: { ad: "Seviye 3", ikon: "🏅", acik: "200 puana ulaştın." },
    tekrar: { ad: "Tekrar Ustası", ikon: "🔁", acik: "Tekrar listesinden bir soruyu düzelttin." }
  };
  let cur = null;
  const api = {
    BADGES,
    session() { const n = localStorage.getItem(SES); return n && api.users()[n] ? n : null; },
    users() { return read().users; },
    user() { return cur ? read().users[cur] : null; },
    name() { return cur; },
    resume() { cur = api.session(); if (cur) api.touchStreak(); return cur; },
    register(name, pass, avatar, sinif) {
      name = (name || "").trim();
      if (name.length < 2) return "Takma ad en az 2 harf olmalı.";
      if ((pass || "").length < 4) return "Şifre en az 4 karakter olmalı.";
      const d = read(); if (d.users[name]) return "Bu takma ad kullanılıyor.";
      d.users[name] = { p: hash(pass), avatar, sinif, xp: 0, stars: {}, wrong: [], badges: [], streak: { son: "", say: 0 }, sound: true, olus: today() };
      write(d); cur = name; localStorage.setItem(SES, name); api.touchStreak(); return null;
    },
    login(name, pass) {
      const u = read().users[(name || "").trim()];
      if (!u || u.p !== hash(pass || "")) return "Takma ad veya şifre yanlış.";
      cur = name.trim(); localStorage.setItem(SES, cur); api.touchStreak(); return null;
    },
    logout() { cur = null; try { localStorage.removeItem(SES); } catch (e) {} },
    mutate(fn) { const d = read(); if (!cur) return; fn(d.users[cur]); write(d); },
    touchStreak() {
      api.mutate(u => {
        const t = today(), y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        if (u.streak.son === t) return;
        u.streak.say = u.streak.son === y ? u.streak.say + 1 : 1; u.streak.son = t;
        if (u.streak.say >= 3 && !u.badges.includes("seri3")) u.badges.push("seri3");
      });
    },
    level(xp) { return Math.floor(xp / 100) + 1; },
    key(sinif, ders, unite, oyun) { return [sinif, ders, unite, oyun].join("/"); },
    stars(sinif, ders, unite, oyun) { const u = api.user(); return (u && u.stars[api.key(sinif, ders, unite, oyun)]) || 0; },
    /* Oyun sonucu: {dogru, toplam, puan} → yıldız, xp, rozet; yeni rozetleri döndürür */
    result(k, r) {
      const yeni = []; const oran = r.toplam ? r.dogru / r.toplam : 0;
      const y = oran >= 0.9 ? 3 : oran >= 0.6 ? 2 : oran > 0 ? 1 : 0;
      api.mutate(u => {
        u.xp += r.puan; if (y > (u.stars[k] || 0)) u.stars[k] = y;
        const ver = (b) => { if (!u.badges.includes(b)) { u.badges.push(b); yeni.push(b); } };
        ver("ilk"); if (y === 3) ver("uc"); if (u.xp >= 200) ver("xp200");
      });
      return { yildiz: y, yeni };
    },
    addWrong(ids) { api.mutate(u => { ids.forEach(i => { if (!u.wrong.includes(i)) u.wrong.push(i); }); }); },
    fixWrong(ids) {
      const yeni = [];
      api.mutate(u => { const once = u.wrong.length; u.wrong = u.wrong.filter(i => !ids.includes(i));
        if (u.wrong.length < once && !u.badges.includes("tekrar")) { u.badges.push("tekrar"); yeni.push("tekrar"); } });
      return yeni;
    },
    rec(k, ok) { api.mutate(u => { u.kz = u.kz || {}; const v = u.kz[k] || [0, 0]; v[1]++; if (ok) v[0]++; u.kz[k] = v; }); },
    setPref(sinif, ders) { api.mutate(u => { u.sinif = sinif; u.ders = ders; }); },
    setSound(v) { api.mutate(u => { u.sound = v; }); }
  };
  return api;
})();
