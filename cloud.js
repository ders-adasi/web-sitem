/* Supabase bulut katmanı: ebeveyn girişi → rıza → çocuk seçimi → ilerlemenin bulutta saklanması.
   config.js boşsa hiçbir şey yapmaz (site yerel modda çalışır). */
(function () {
  const C = window.BILGI_CONFIG || {}, $ = (i) => document.getElementById(i), KEY = "dos_v1", SES = "dos_oturum";
  if (!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const IN = 'style="font:inherit;padding:.6em;border-radius:12px;border:2px solid #cbd5da;margin:4px 0;max-width:100%"';
  const box = (h) => { $("app").innerHTML = `<main class="sayfa dar"><div class="kart" style="margin-top:24px"><h2 style="margin-top:0">🌳 Ders Ormanı</h2>${h}</div></main>`; };
  const msg = (t) => { const e = $("ms"); if (e) e.textContent = t; };
  const lib = () => new Promise((res, rej) => { if (window.supabase) return res(); const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"; s.onload = res; s.onerror = () => rej(new Error("Supabase kitaplığı yüklenemedi")); document.head.appendChild(s); });
  let sb, cid = null, nick = null, tm = null;

  const auth = () => new Promise((res) => {
    box(`<p>Ebeveyn hesabınla giriş yap. Çocuğun için ayrı hesap gerekmez.</p><p><input id="em" type="email" placeholder="e-posta" ${IN}><br><input id="pw" type="password" placeholder="parola (en az 8 karakter)" ${IN}></p><button class="btn" id="gi">Giriş yap</button> <button class="btn ikinci" id="ka">Kayıt ol</button><p id="ms" class="kucuk-not"></p>`);
    $("gi").onclick = async () => { const { error } = await sb.auth.signInWithPassword({ email: $("em").value, password: $("pw").value }); error ? msg("Giriş başarısız: " + error.message) : res(); };
    $("ka").onclick = async () => { const { data, error } = await sb.auth.signUp({ email: $("em").value, password: $("pw").value }); if (error) return msg("Kayıt başarısız: " + error.message); data.session ? res() : msg("E-postana gelen doğrulama bağlantısına tıkla, sonra giriş yap."); };
  });
  const consent = async (uid) => {
    await sb.from("parents").upsert({ id: uid });
    const { data } = await sb.from("consents").select("kind").eq("version", C.CONSENT_VERSION).is("withdrawn_at", null), k = (data || []).map((x) => x.kind);
    if (k.includes("aydinlatma_okundu") && k.includes("acik_riza_cocuk_verisi")) return;
    await new Promise((res) => {
      box(`<p>Devam etmeden önce lütfen metinleri okuyup onaylayın.</p><p><a href="${C.AYDINLATMA_URL}" target="_blank">Aydınlatma Metni</a> · <a href="${C.RIZA_URL}" target="_blank">Açık Rıza Metni</a></p><label><input type="checkbox" id="c1"> Aydınlatma metnini okudum ve anladım.</label><br><label><input type="checkbox" id="c2"> Çocuğum adına, takma ad ve oyun ilerleme verilerinin işlenmesine açık rıza veriyorum.</label><p><button class="btn" id="cn">Onayla ve devam et</button></p><p id="ms" class="kucuk-not"></p>`);
      $("cn").onclick = async () => { if (!$("c1").checked || !$("c2").checked) return msg("İki kutuyu da işaretlemelisin.");
        const { error } = await sb.from("consents").insert(["aydinlatma_okundu", "acik_riza_cocuk_verisi"].map((kind) => ({ parent_id: uid, kind, version: C.CONSENT_VERSION }))); error ? msg("Kaydedilemedi: " + error.message) : res(); };
    });
  };
  const pick = async (uid) => { for (;;) {
    const { data } = await sb.from("children").select("*").order("created_at");
    const ch = await new Promise((res) => {
      box(`<p>Kim oynayacak?</p>${(data || []).map((c) => `<button class="btn" data-id="${c.id}">${esc(c.nickname)} (${c.grade}. sınıf)</button> `).join("")}<h3>Yeni çocuk ekle</h3><p class="kucuk-not">Gerçek ad, okul ya da fotoğraf girmeyin.</p><input id="nk" maxlength="20" placeholder="takma ad (en az 2 harf)" ${IN}> <select id="gr" ${IN}><option>5</option><option>6</option></select> <button class="btn ikinci" id="ad">Ekle</button><p id="ms" class="kucuk-not"></p>`);
      document.querySelectorAll("[data-id]").forEach((b) => (b.onclick = () => res(data.find((c) => c.id === b.dataset.id))));
      $("ad").onclick = async () => { const n = $("nk").value.trim(); if (n.length < 2) return msg("Takma ad en az 2 harf olmalı.");
        const { error } = await sb.from("children").insert({ parent_id: uid, nickname: n, grade: +$("gr").value }); error ? msg("Eklenemedi: " + error.message) : res(null); };
    });
    if (ch) return ch; } };
  const bos = (c) => ({ p: "", avatar: "🦊", sinif: c.grade, xp: 0, stars: {}, wrong: [], badges: [], streak: { son: "", say: 0 }, sound: true, olus: new Date().toISOString().slice(0, 10) });
  const pull = async (c) => {
    const { data } = await sb.from("child_state").select("data").eq("child_id", c.id).maybeSingle();
    const st = data && data.data && data.data.stars ? data.data : bos(c); st.p = ""; st.sinif = st.sinif || c.grade;
    localStorage.setItem(KEY, JSON.stringify({ users: { [c.nickname]: st } })); localStorage.setItem(SES, c.nickname); nick = c.nickname;
  };
  const push = async () => { try { const u = (JSON.parse(localStorage.getItem(KEY)) || { users: {} }).users[nick]; if (!u) return; const d = { ...u }; delete d.p;
    await sb.from("child_state").upsert({ child_id: cid, data: d, updated_at: new Date().toISOString() }); } catch (e) {} };
  const hook = () => { const orig = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { orig.call(this, k, v); if (k === KEY && cid) { clearTimeout(tm); tm = setTimeout(push, 2000); } }; };
  const clearLocal = () => { try { localStorage.removeItem(KEY); localStorage.removeItem(SES); } catch (e) {} };
  const leave = async () => { await sb.auth.signOut(); clearLocal(); location.reload(); };
  const menu = () => { let o = $("mn"); if (o) return o.remove(); o = document.createElement("div"); o.id = "mn"; o.className = "kart"; o.style.cssText = "position:fixed;right:10px;bottom:70px;z-index:99;max-width:300px";
    o.innerHTML = `<p class="kucuk-not">Ebeveyn hesabı</p><button class="btn kucuk ikinci" data-a="out">Çocuk değiştir</button> <button class="btn kucuk ikinci" data-a="so">Oturumu kapat</button> <button class="btn kucuk ikinci" data-a="exp">Verilerimi indir</button> <button class="btn kucuk ikinci" data-a="rz">Rızamı geri çek</button> <button class="btn kucuk ikinci" data-a="dc">Çocuğu sil</button> <button class="btn kucuk ikinci" data-a="da">Hesabımı sil</button><p id="mm" class="kucuk-not"></p>`; document.body.appendChild(o);
    let ar = null; o.querySelectorAll("[data-a]").forEach((b) => (b.onclick = async () => { const a = b.dataset.a;
      if (["rz", "dc", "da"].includes(a) && ar !== a) { ar = a; return ($("mm").textContent = "Emin misin? Aynı düğmeye tekrar dokun."); } ar = null;
      if (a === "out") { await push(); clearLocal(); location.reload(); }
      if (a === "so") { await push(); return leave(); }
      if (a === "exp") { const { data } = await sb.rpc("export_child_data", { cid }), l = document.createElement("a"); l.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); l.download = "cocuk-verileri.json"; l.click(); }
      if (a === "rz") { await sb.from("consents").update({ withdrawn_at: new Date().toISOString() }).is("withdrawn_at", null); const { data: cs } = await sb.from("children").select("id"); for (const c of cs || []) await sb.rpc("delete_child", { cid: c.id }); return leave(); }
      if (a === "dc") { await sb.rpc("delete_child", { cid }); clearLocal(); location.reload(); }
      if (a === "da") { const { error } = await sb.functions.invoke("delete-account"); if (error) return ($("mm").textContent = "Otomatik silinemedi; " + (C.CONTACT_EMAIL || "yöneticiye") + " adresine yaz."); leave(); } })); };

  window.CLOUD_GATE = async (boot) => {
    try {
      await lib(); sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
      let { data: { session } } = await sb.auth.getSession(); if (!session) { await auth(); ({ data: { session } } = await sb.auth.getSession()); }
      const uid = session.user.id; await consent(uid); const c = await pick(uid); await pull(c); cid = c.id; hook();
      Store.logout = () => { push().finally(() => { clearLocal(); location.reload(); }); };   // sitedeki "Çıkış" = çocuk değiştir
      boot();
      const b = document.createElement("div"); b.style.cssText = "position:fixed;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:98"; b.innerHTML = `<button class="btn kucuk ikinci" id="bx">⚙️ Hesap</button>`; document.body.appendChild(b); $("bx").onclick = menu;
    } catch (e) { box(`<p>Bir sorun oluştu: ${esc(e.message || e)}</p>`); }
  };
})();
