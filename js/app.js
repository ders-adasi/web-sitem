/* Ekranlar: giriş/üyelik → harita → ünite paneli → oyun → sonuç */
(() => {
  const { el, fmt, ses, toast, yildizHtml } = UI;
  const app = document.getElementById("app");
  const AVATARLAR = ["🦊", "🐼", "🦉", "🐯", "🐸", "🦄", "🐧", "🦁"];
  const GELECEK_DERSLER = [["Sosyal Bilgiler", "🗺️"], ["Kur'an-ı Kerim", "📿"], ["Temel Dini Bilgiler", "📗"], ["Seçmeli İngilizce", "🔤"]];
  let SINIF = "5", DERS = "arapca";
  const DV = () => window.DERS_VERILERI;
  const tercih = () => { const u = Store.user() || {}; let s = String(u.sinif || 5); if (!DV()[s]) s = Object.keys(DV())[0]; let d = u.ders; if (!d || !DV()[s][d]) d = Object.keys(DV()[s])[0]; SINIF = s; DERS = d; };
  const veri = () => DV()[SINIF][DERS];
  const dersTema = (k, dk) => (window.DERS_TEMA || {})[k] || (dk && dk.tema) || ["#2f9e6b", "#1f7450"];
  const temaUygula = (k) => { const t = k ? dersTema(k, DV()[SINIF][k]) : ["#2f9e6b", "#1f7450"], r = document.documentElement.style; r.setProperty("--ders", t[0]); r.setProperty("--ders-koyu", t[1]); };
  let oyunKok = null;
  document.addEventListener("keydown", (e) => { if (oyunKok && oyunKok._tus) oyunKok._tus(e); });

  /* ---------- Üst çubuk ---------- */
  const ust = (geriFn, etiket = "◀ Ana sayfa") => {
    const u = Store.user(), xp = u.xp, sv = Store.level(xp);
    return el("header", { class: "ust" },
      geriFn ? el("button", { class: "btn kucuk ikinci", onclick: geriFn }, etiket) : el("div", { class: "logo" }, "🌳 Ders Ormanı"),
      el("div", { class: "profil" },
        el("span", { class: "chip-bilgi", title: "Günlük seri" }, `🔥 ${u.streak.say}`),
        el("span", { class: "chip-bilgi", title: "Seviye" }, `Sv. ${sv}`),
        el("span", { class: "xp" }, el("i", { style: `width:${xp % 100}%` })),
        el("span", { class: "chip-bilgi" }, `${u.avatar} ${Store.name()}`),
        el("button", { class: "btn kucuk ikinci", title: "Görünüm", "aria-label": "Görünüm ayarları", onclick: () => UI.gorunum.panel() }, "🎨"),
        el("button", { class: "btn kucuk ikinci", title: "Ebeveyn paneli", onclick: panel }, "👨‍👩‍👧"),
        el("button", { class: "btn kucuk ikinci", title: "Sesi aç/kapat", onclick: (e) => { const v = !ses.get(); ses.set(v); Store.setSound(v); e.target.textContent = v ? "🔊" : "🔇"; } }, ses.get() ? "🔊" : "🔇"),
        el("button", { class: "btn kucuk ikinci", onclick: () => { Store.logout(); giris(); } }, "Çıkış")));
  };

  /* ---------- Giriş / üyelik ---------- */
  function giris() {
    oyunKok = null; let mod = "giris", avatar = AVATARLAR[0];
    const hata = el("div", { class: "hata" });
    const ad = el("input", { type: "text", placeholder: "Takma adın (gerçek adını yazma)", maxlength: 20, autocomplete: "username" });
    const sif = el("input", { type: "password", placeholder: "Şifre (en az 4 karakter)", autocomplete: "current-password" });
    const avatarSatir = el("div", { class: "avatarlar" });
    const baslik = el("h2", {}), gonder = el("button", { class: "btn buyuk" }), degis = el("button", { class: "link" });
    const sinifSec = el("select", {}, [5, 6, 7, 8].map(s => el("option", { value: s, disabled: s > 6 }, `${s}. sınıf${s > 6 ? " (yakında)" : ""}`)));
    const sinifSatir = el("label", { class: "etiket" }, "Sınıfın", sinifSec);
    const ciz = () => {
      baslik.textContent = mod === "giris" ? "Tekrar hoş geldin! 👋" : "Aramıza katıl! 🎉";
      gonder.textContent = mod === "giris" ? "Giriş Yap" : "Üye Ol";
      degis.textContent = mod === "giris" ? "Hesabın yok mu? Üye ol" : "Zaten üyeyim, giriş yap";
      avatarSatir.style.display = sinifSatir.style.display = mod === "giris" ? "none" : "";
      avatarSatir.replaceChildren(...AVATARLAR.map(a => el("button", { class: "avatar" + (a === avatar ? " sec" : ""), type: "button", onclick: () => { avatar = a; ciz(); } }, a)));
    };
    const git = () => { hata.textContent = ""; const h = mod === "giris" ? Store.login(ad.value, sif.value) : Store.register(ad.value, sif.value, avatar, +sinifSec.value || 5);
      if (h) hata.textContent = h; else { ses.set(Store.user().sound !== false); harita(); } };
    gonder.onclick = git; degis.onclick = () => { mod = mod === "giris" ? "uye" : "giris"; hata.textContent = ""; ciz(); };
    sif.addEventListener("keydown", e => { if (e.key === "Enter") git(); });
    ciz();
    app.replaceChildren(el("main", { class: "giris-sayfa" },
      el("div", { class: "kart giris-kart" },
        el("div", { class: "buyuk-ikon" }, "🌳🦉🌙"), el("h1", {}, "Ders Ormanı"),
        el("p", { class: "alt-baslik" }, "Oyun oyna, öğren, yıldız topla!"),
        baslik, ad, sif, sinifSatir, el("div", { class: "etiket" }, "Avatarını seç"), avatarSatir, hata, gonder, degis,
        el("p", { class: "kucuk-not" }, "Bu deneme sürümünde bilgiler yalnızca bu bilgisayarda saklanır. E-posta, gerçek ad veya başka kişisel bilgi istenmez."))));
  }

  /* ---------- Ana sayfa: dersler ---------- */
  const sinifTur = (un) => un.salon ? "oyun" : (un.okul || /Yazılı/.test(un.bolge)) ? "yazili" : "calisma";
  const yildizToplam = (dk, k) => dk.uniteler.reduce((t, un) => { const og = oyunlar(un, dk); return [t[0] + og.reduce((a, [g]) => a + Store.stars(SINIF, k, un.id, g), 0), t[1] + og.length * 3]; }, [0, 0]);
  function harita() {
    oyunKok = null; tercih(); temaUygula(null); const u = Store.user();
    const dersKart = ([k, dk], i) => {
      const [al, top] = yildizToplam(dk, k), oku = dk.uniteler.filter(x => x.okul), sayi = (t) => dk.uniteler.filter(un => sinifTur(un) === t).length;
      const tm = dersTema(k, dk);
      return el("button", { class: `ada ders-kart ada-${(i % 4) + 1}`, style: `--ders:${tm[0]};--ders-koyu:${tm[1]}`, onclick: () => { Store.setPref(SINIF, k); dersSayfa(); } },
        el("div", { class: "ada-ikon" }, dk.ikon), el("div", { class: "ada-ad" }, dk.ad),
        el("div", { class: "ada-alt" }, [sayi("yazili") ? `📝 ${sayi("yazili")} yazılı senaryosu` : "", sayi("calisma") ? `📚 ${sayi("calisma")} konu çalışması` : "", sayi("oyun") ? "🎮 oyun salonu" : ""].filter(Boolean).join(" · ")),
        el("div", { class: "ders-ilerleme", title: "İlerleme" }, el("i", { style: `width:${top ? Math.round(al / top * 100) : 0}%` })), el("div", { class: "ada-yildiz" }, `★ ${al} / ${top}`),
        oku.length ? el("div", { class: "ada-okul" }, oku.length === 1 ? `📌 Okul yazılısı: ${oku[0].ad}` : "📌 Okul yazılısı senaryosu var") : null);
    };
    const tekrarN = u.wrong.length;
    const rozetler = Object.entries(Store.BADGES).map(([k, b]) => el("span", { class: "rozet" + (u.badges.includes(k) ? " var" : ""), title: `${b.ad}: ${b.acik}` }, b.ikon));
    app.replaceChildren(ust(), el("main", { class: "sayfa" },
      el("section", { class: "hero" }, el("h1", {}, `Merhaba ${u.avatar} ${Store.name()}!`),
        el("p", {}, `${SINIF}. sınıf • Bir ders seç; yazılı senaryoları, konu çalışmaları ve oyunlar dersin içinde.`), secici()),
      el("h2", { class: "bolum-baslik" }, "📚 Derslerim"),
      el("section", { class: "harita" }, Object.entries(DV()[SINIF]).map(dersKart)),
      el("section", { class: "yan-kartlar" },
        el("div", { class: "kart" }, el("h3", {}, "👨‍👩‍👧 Ebeveyn ve geri bildirim"), el("div", { class: "alt-cubuk" }, el("button", { class: "btn", onclick: panel }, "Ebeveyn Paneli"), el("button", { class: "btn ikinci", onclick: geri }, "💬 Geri bildirim"))),
        el("div", { class: "kart" }, el("h3", {}, "🔁 Tekrar Listesi"),
          el("p", {}, tekrarN ? `Yanlış yaptığın ${tekrarN} soru seni bekliyor. Onları düzeltirsen rozet kazanırsın!` : "Şu an tekrar edilecek soru yok. Harika!"),
          el("button", { class: "btn", disabled: !tekrarN, onclick: tekrarOyna }, "Tekrar Et")),
        el("div", { class: "kart" }, el("h3", {}, "🏅 Rozetlerim"), el("div", { class: "rozetler" }, rozetler)),
        el("div", { class: "kart" }, el("h3", {}, "🗺️ Yakında açılacak dersler"),
          el("div", { class: "yakinda" }, GELECEK_DERSLER.map(([a, i]) => el("span", { class: "kilitli" }, `${i} ${a}`)))))));
  }

  /* ---------- Ders sayfası: yazılı senaryoları, konu çalışmaları, oyunlar ---------- */
  function dersSayfa() {
    oyunKok = null; tercih(); temaUygula(DERS); const dk = veri(), uni = dk.uniteler;
    const unitKart = (un, i) => {
      const og = oyunlar(un), top = og.length * 3, al = og.reduce((t, [g]) => t + Store.stars(SINIF, DERS, un.id, g), 0);
      return el("button", { class: `ada ada-${(i % 4) + 1}`, onclick: () => unitePanel(un) },
        el("div", { class: "ada-ders" }, `${dk.ikon} ${dk.ad}`), el("div", { class: "ada-ikon" }, un.ikon), el("div", { class: "ada-ad" }, un.bolge), el("div", { class: "ada-alt" }, un.ad),
        el("div", { class: "ar ada-ar", dir: "rtl" }, un.ar), el("div", { class: "ada-yildiz" }, `★ ${al} / ${top}`), un.okul ? el("div", { class: "ada-okul" }, "📌 Okulumuzun 1. yazılı senaryosu") : null);
    };
    const bolum = (baslik, acik, liste, alt) => liste.length ? el("section", { class: "bolum" }, el("h2", { class: "bolum-baslik" }, baslik), el("p", { class: "bolum-acik" }, acik), ...(alt || [el("div", { class: "harita" }, liste.map(unitKart))])) : null;
    const yaz = uni.filter(un => sinifTur(un) === "yazili").sort((a, b) => !!b.okul - !!a.okul), grup = {};
    yaz.forEach(un => { const m = /(\d)\. Yazılı/.exec(un.bolge), g = m ? `${m[1]}. Ortak Yazılı` : "Okul yazılısı senaryosu"; (grup[g] = grup[g] || []).push(un); });
    const yazAlt = Object.entries(grup).flatMap(([g, l]) => [el("h3", { class: "grup-baslik" }, g), el("div", { class: "harita" }, l.map(unitKart))]);
    const bilgiKosesi = dk.sayfalar && dk.sayfalar.length ? el("section", { class: "bolum" }, el("h2", { class: "bolum-baslik" }, "🧭 Bilgi Köşesi"), el("p", { class: "bolum-acik" }, "Sözlük, zaman şeridi, ağaçlar ve hikâyeler; öğretmen/veli için içerik inceleme."),
      el("div", { class: "sayfa-dugmeleri" }, dk.sayfalar.filter(sy => window.Sayfalar && window.Sayfalar[sy.id]).map(sy => el("button", { class: "btn ikinci", onclick: () => sayfaGoster(sy.id) }, sy.ad)))) : null;
    const salon = uni.find(un => un.salon);
    const hizli = salon ? el("section", { class: "bolum" }, el("div", { class: "kart hizli" }, el("h3", {}, "🧠 Hemen çalışmaya başla"), el("p", {}, `${dk.ad} – tüm konulardan karışık çalışma soruları.`),
      el("div", { class: "alt-cubuk" }, el("button", { class: "btn buyuk", onclick: () => oyna(salon, "quiz") }, "Çalışma Soruları ▶"), el("button", { class: "btn ikinci", onclick: () => unitePanel(salon) }, "🎮 Oyunlar")))) : null;
    app.replaceChildren(ust(harita, "◀ Dersler"), el("main", { class: "sayfa" },
      el("section", { class: "hero" }, el("div", { class: "ada-ikon" }, dk.ikon), el("h1", {}, dk.ad), el("p", {}, `${SINIF}. sınıf • Yazılı senaryolarını çöz, konu çalışması yap, oyunlarla pekiştir.`)),
      hizli, bilgiKosesi,
      bolum("📝 Yazılı Senaryoları", "Ortak yazılı sınavlarının soru dağılımına göre hazırlandı; her senaryoda bilgi yarışı ve sınav modu var.", yaz, yazAlt),
      bolum("📚 Konu Çalışmaları", "Yazılı tablosunun dışındaki ek konular ve metin çalışmaları.", uni.filter(un => sinifTur(un) === "calisma")),
      bolum("🎮 Oyunlar", "Hafıza kartları, boşluk doldurma, sıralama, kelime avı, hikâye ve daha fazlası.", uni.filter(un => sinifTur(un) === "oyun"))));
  }

  function sayfaGoster(id) {
    oyunKok = null; tercih(); temaUygula(DERS); const dk = veri();
    app.replaceChildren(ust(dersSayfa, "◀ " + dk.ad), el("main", { class: "sayfa dar" }, window.Sayfalar[id](dk, { ders: DERS, oyna: (un, g) => oyna(un, g) })));
  }

  /* ---------- Ünite paneli ---------- */
  function unitePanel(un) {
    oyunKok = null;
    app.replaceChildren(ust(dersSayfa, "◀ " + veri().ad), el("main", { class: "sayfa dar" },
      el("section", { class: "hero" }, el("div", { class: "ada-ikon" }, un.ikon), el("p", { class: "ders-etiket" }, `${veri().ikon} ${veri().ad} • ${SINIF}. sınıf • ${un.bolge}`), el("h1", {}, un.ad), el("div", { class: "ar buyuk-ar", dir: "rtl" }, un.ar)),
      el("div", { class: "kart" }, el("h3", {}, "🎯 Bu bölümde neler öğreneceksin?"), el("ul", { class: "kazanim" }, un.kazanimlar.map(k => el("li", {}, k)))),
      el("div", { class: "oyun-liste" }, oyunlar(un).map(([g, G]) => {
        const y = Store.stars(SINIF, DERS, un.id, g);
        return el("button", { class: "oyun-kart", onclick: () => oyna(un, g) },
          el("div", { class: "oyun-ikon" }, G.ikon), el("div", { class: "oyun-ad" }, adi(g, G, veri())), el("div", { class: "oyun-acik" }, G.acik), el("div", { class: "yildiz" }, yildizHtml(y)));
      }))));
  }

  /* ---------- Oyun çalıştırma ---------- */
  function oyna(un, g, ek) {
    const kok = el("div", { class: "oyun-alan" }); oyunKok = kok;
    const geri = () => { oyunKok = null; ek && ek.tekrar ? harita() : unitePanel(un); };
    app.replaceChildren(ust(geri, "◀ Geri"), el("main", { class: "sayfa dar" }, kok));
    Games[g].start({
      unit: un, root: kok, sorular: ek && ek.sorular, kz: veri().kazanimAd, ders: veri(),
      bitir: (r) => {
        oyunKok = null; ses.bitti();
        const k = ek && ek.tekrar ? Store.key(SINIF, DERS, "tekrar", g) : Store.key(SINIF, DERS, un.id, g);
        const s = Store.result(k, r); let yeni = s.yeni.slice();
        if (r.yanlis && r.yanlis.length) Store.addWrong(r.yanlis);
        if (r.dogruIds && r.dogruIds.length) yeni = yeni.concat(Store.fixWrong(r.dogruIds));
        yeni.forEach(b => toast(`${Store.BADGES[b].ikon} Yeni rozet: ${Store.BADGES[b].ad}!`));
        sonuc(un, g, r, s.yildiz, ek);
      }
    });
  }

  function sonuc(un, g, r, y, ek) {
    const mesaj = y === 3 ? "Muhteşemsin! 🌟" : y === 2 ? "Çok iyi gidiyorsun! 👏" : y === 1 ? "İyi başlangıç! Tekrar oynayınca daha da iyi olacak 💪" : "Sorun değil, tekrar deneyelim! 🌱";
    app.replaceChildren(ust(() => { ek && ek.tekrar ? harita() : unitePanel(un); }, "◀ Geri"), el("main", { class: "sayfa dar" },
      el("div", { class: "kart sonuc" }, el("h1", {}, mesaj), el("div", { class: "buyuk-yildiz" }, yildizHtml(y)),
        el("p", {}, r.ozet), el("p", { class: "puan" }, `+${r.puan} puan kazandın`),
        r.yanlis && r.yanlis.length ? el("p", { class: "kucuk-not" }, `${r.yanlis.length} soru "Tekrar Listesi"ne eklendi.`) : null,
        el("div", { class: "alt-cubuk" },
          el("button", { class: "btn buyuk", onclick: () => ek && ek.tekrar ? tekrarOyna() : oyna(un, g) }, "🔄 Tekrar Oyna"),
          el("button", { class: "btn buyuk ikinci", onclick: ek && ek.tekrar ? harita : dersSayfa }, ek && ek.tekrar ? "🏠 Ana Sayfa" : "📚 Derse Dön")))));
  }

  function tekrarOyna() {
    const u = Store.user(), havuz = [];
    veri().uniteler.forEach(un => un.sorular.forEach((q, i) => { const id = un.id + ":" + i; if (u.wrong.includes(id)) havuz.push({ q, id }); }));
    if (!havuz.length) { harita(); return; }
    oyna(veri().uniteler[0], "quiz", { sorular: havuz, tekrar: true });
  }

  /* ---------- Ders / sınıf seçici, ebeveyn paneli, geri bildirim ---------- */
  const oyunlar = (un, dk) => { dk = dk || veri(); const l = Object.entries(Games).filter(([g, G]) => !G.uygun || G.uygun(un, dk)), sr = dk.oyunSira;
    if (sr) l.sort((a, b) => { const x = sr.indexOf(a[0]), y = sr.indexOf(b[0]); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); }); return l; };
  const adi = (g, G, dk) => (dk && dk.oyunAd && dk.oyunAd[g]) || G.ad;
  const secici = () => el("div", { class: "secici" },
    Object.keys(DV()).map(s => el("button", { class: "btn kucuk" + (s === SINIF ? "" : " ikinci"), onclick: () => { Store.setPref(s, DV()[s][DERS] ? DERS : Object.keys(DV()[s])[0]); harita(); } }, `${s}. sınıf`)));

  function panel() {
    oyunKok = null; tercih(); const u = Store.user(), d = veri(), ka = d.kazanimAd || {};
    const kz = Object.entries(u.kz || {}).filter(([k]) => ka[k]).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
    app.replaceChildren(ust(harita), el("main", { class: "sayfa dar" },
      el("section", { class: "hero" }, el("h1", {}, "👨‍👩‍👧 Ebeveyn Paneli"), el("p", {}, `${u.avatar} ${Store.name()} · ${SINIF}. sınıf ${d.ad}`)),
      el("div", { class: "yan-kartlar" }, [["🔥", u.streak.say + " gün", "Günlük seri"], ["⭐", u.xp, "Toplam puan"], ["🏅", u.badges.length + "/" + Object.keys(Store.BADGES).length, "Rozet"], ["🔁", u.wrong.length, "Tekrar bekleyen soru"]]
        .map(([i, v, t]) => el("div", { class: "kart" }, el("h2", {}, `${i} ${v}`), el("p", {}, t)))),
      el("div", { class: "kart" }, el("h3", {}, "Kazanım başarısı (zayıftan güçlüye)"), kz.length ? kz.map(([k, v]) => { const p = Math.round(v[0] / v[1] * 100);
        return el("div", {}, el("p", {}, `${p < 60 ? "🔴" : p < 80 ? "🟡" : "🟢"} ${ka[k]}${(d.kazanimKod || {})[k] ? " (" + d.kazanimKod[k] + ")" : ""} — %${p} (${v[0]}/${v[1]})`), el("div", { class: "ilerleme" }, el("i", { style: `width:${p}%` }))); }) : el("p", {}, "Henüz soru çözülmedi.")),
      el("div", { class: "kart" }, el("h3", {}, "Ada yıldızları"), d.uniteler.map(un => { const og = oyunlar(un); return el("p", {}, `${un.ikon} ${un.bolge} · ${un.ad}: ★ ${og.reduce((t, [g]) => t + Store.stars(SINIF, DERS, un.id, g), 0)} / ${og.length * 3}`); })),
      el("p", { class: "kucuk-not" }, "Veriler yalnızca bu cihazdaki tarayıcıda saklanır.")));
  }

  function geri() {
    oyunKok = null; tercih(); const W = { style: "width:100%" };
    const pt = [1, 2, 3, 4, 5].map(i => el("label", {}, el("input", { type: "radio", name: "pt", value: i }), " " + "⭐".repeat(i) + "  "));
    const a = el("input", { type: "text", ...W }), b = el("textarea", { rows: 4, ...W }), c = el("input", { type: "text", ...W }), out = el("div", {});
    const hazirla = () => { const p = (document.querySelector("input[name=pt]:checked") || {}).value || "-";
      const t = `Ders Ormanı geri bildirim\nDers/Sınıf: ${veri().ad} ${SINIF}. sınıf\nPuan: ${p}/5\nEn çok sevilen: ${a.value}\nZorlanma/hata: ${b.value}\nEklenmesi istenen: ${c.value}\nEkran: ${innerWidth}x${innerHeight}`;
      const ta = el("textarea", { rows: 8, readonly: true, ...W }, t);
      out.replaceChildren(ta, el("p", { class: "kucuk-not" }, "Bu metni kopyalayıp bize gönder."), el("button", { class: "btn kucuk", onclick: (e) => { ta.select(); try { navigator.clipboard.writeText(t); } catch (x) { document.execCommand("copy"); } e.target.textContent = "Kopyalandı ✓"; } }, "Kopyala")); };
    app.replaceChildren(ust(harita), el("main", { class: "sayfa dar" }, el("div", { class: "kart" }, el("h2", {}, "💬 Geri bildirim"), el("p", {}, "Kişisel bilgi (ad, okul, telefon) yazma."),
      el("p", {}, "Genel puan: ", pt), el("p", {}, "En çok hangi oyun/bölüm hoşuna gitti?"), a, el("p", {}, "Nerede zorlandın ya da hata gördün?"), b, el("p", {}, "Neler eklenmeli? (örn. başka bir ders)"), c,
      el("div", { class: "alt-cubuk" }, el("button", { class: "btn", onclick: hazirla }, "📋 Metni hazırla")), out)));
  }

  /* ---------- Başlat ---------- */
  const boot = () => { if (Store.resume()) { ses.set(Store.user().sound !== false); harita(); } else giris(); };
  const go_ = () => Paketler.hazir.then(() => (window.CLOUD_GATE || ((f) => f()))(boot));
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go_) : go_();
})();
