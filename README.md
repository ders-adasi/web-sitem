# Ders Ormanı

5. ve 6. sınıf için oyunla öğrenme sitesi. Derlemesiz, statik dosyalardan oluşur: `index.html`'i bir statik sunucuda (ya da doğrudan tarayıcıda) açın.
Dersler: Arapça, Türkçe, Din Kültürü ve Ahlak Bilgisi, Peygamberimizin Hayatı, Matematik, İngilizce (5. sınıf) ve Fen Bilimleri (5. ve 6. sınıf).

## Özellikler
- Ana sayfa → ders → **📝 Yazılı Senaryoları · 📚 Konu Çalışmaları · 🎮 Oyunlar · 🧭 Bilgi Köşesi**; okul yazılısı senaryosu işaretli
- 25 oyun türü (bilgi yarışı, sınav modu, boss savaşı, düello, hafıza kartları, sıralama, boşluk doldurma, kelime avı, adam asmaca, hikâye, sanal deneyler, hesap yarışı, Listen & Choose …)
- Bilgi sayfaları: sözlük, zaman şeridi, ağaçlar, hikâye modu, içerik inceleme (CSV)
- Puan, seviye, günlük seri, rozet, tekrar listesi, ebeveyn paneli (kazanım başarısı), geri bildirim formu
- Her ders kendi renginde; açık/koyu tema, büyük yazı, okunaklı yazı tipi, sesli okuma; çevrimdışı çalışır (PWA)
- İsteğe bağlı Supabase modu: ebeveyn girişi, rıza, bulutta kayıt (aşağıda)

## Geliştirme
```
npm i          # yalnızca testler için (jsdom)
npm run kontrol   # tüm ders paketlerini doğrular
npm test          # doğrulama + her dersin her oyununu açan duman testi
```
- **Yeni ders:** `docs/PAKET-SEMASI.md` → `data/<sınıf>/<ders>.js` yazın, `data/kayit.js` → `paketler`e ekleyin, rengi `data/temalar.js`'e yazın.
- **Yeni oyun:** `docs/OYUN-YAZMA.md`
- **Yeni bilgi sayfası türü:** `js/sayfalar.js` içine `Sayfalar.<id>` ekleyin, dersin `sayfalar` listesine `{id, ad}` yazın.
- **Başka siteden içerik taşıma:** `tools/oyunla-ogren-donustur.js` örnek bir dönüştürücüdür.

## Klasör yapısı
- `data/kayit.js` – yüklenecek oyun/sayfa/ders dosyalarının listesi · `data/temalar.js` – ders renkleri
- `data/<sınıf>/<ders>.js` – ders içeriği (`window.DERS_VERILERI[sınıf][ders]`)
- `css/style.css` (temel) + `css/tasarim.css` (ders renkleri, koyu tema, yeni bileşenler)
- `js/yukle.js` (yükleyici), `js/sayfalar.js` (bilgi sayfaları), `sw.js` + `manifest.webmanifest` (PWA)
- `data/gorseller.js` – konulara göre özgün SVG çizimler (`window.GORSEL`)
- `games/*.js` – oyunlar; bir ünitede yalnızca verisi olan oyunlar görünür (`uygun` fonksiyonu)
- `js/store.js` – profil, puan, rozet, seri, kazanım istatistikleri (yerel modda tarayıcıda; bulut modunda `cloud.js` ile Supabase'e eşitlenir)
- `js/app.js` – ekranlar: giriş, ana sayfa (sınıfa göre dersler), ders sayfası (📝 yazılı senaryoları · 📚 konu çalışmaları · 🎮 oyunlar), ünite paneli, oyun, sonuç, ebeveyn paneli, geri bildirim

## Yeni ders / sınıf ekleme
`data/7/matematik.js` gibi bir dosya oluşturup `index.html`'e script satırı ekleyin:
```js
window.DERS_VERILERI = window.DERS_VERILERI || {}; window.DERS_VERILERI["7"] = window.DERS_VERILERI["7"] || {};
window.DERS_VERILERI["7"].matematik = {
  ad: "Matematik", ikon: "➗",
  kazanimAd: { oran: "Oran-orantı" }, kazanimKod: { oran: "M.7.1.1" },   // ebeveyn paneli için (anahtarlar benzersiz olsun)
  uniteler: [{
    id: "mat7-u1", ad: "1. Ünite", bolge: "Oran Ormanı", ikon: "🌳", ar: "", kazanimlar: ["M.7.1.1 ..."],
    sorular: [{ s: "Soru?", o: ["Doğru", "Yanlış 1", "Yanlış 2", "Yanlış 3"], d: 0, i: "ipucu", a: "açıklama", k: "oran" }],
    sinav: true                 // → Sınav Modu açılır
    // isteğe bağlı oyun verileri: eslestirme [{ar,tr}], bosluk [["cümle ___","doğru|yanlış|yanlış"]], siralama [["başlık",[doğru sıra]]],
    // hikaye [[sahne,soru,"doğru|yanlış","açıklama"]], kelimeler [["KELİME","ipucu"]], kur (Arapça), deneyler [id'ler]
  }]
};
```
`salon: true` olan bir ünite eklerseniz Hız Yarışı ve Bilgi Labirenti o ünitenin `sorular` havuzuyla açılır.
Üniteler ve kazanım anahtarları tüm derslerde benzersiz olmalıdır.

## Okul yazılısı işareti
Ünitede `okul: true` varsa haritada en başta "📌 Okulumuzun 1. yazılı senaryosu" etiketiyle görünür (şu an: Arapça S6, Fen 5 S2, Fen 6 S6, Türkçe 5 S1, Din Kültürü 5 Y1-S4).

## Supabase (bulut) modu – giriş, rıza ve bulutta kayıt
Varsayılan olarak site yerel modda çalışır (veriler tarayıcıda). Bulut modunu açmak için:
1. supabase.com'da proje aç; sunucu bölgesini seç ve not et (aydınlatma metnine yazılacak).
2. SQL Editor'de `supabase/sema.sql` dosyasını çalıştır.
3. Authentication > Providers: e-posta açık, e-posta doğrulaması açık. URL Configuration'a sitenin adresini ekle.
4. `config.js` içine Project URL ve **anon public** anahtarı yaz. `service_role` anahtarını hiçbir yere koyma.
5. `aydinlatma.html` ve `riza.html` içine hukukçunun onayladığı metinleri yapıştır; metin değişince `CONSENT_VERSION`'ı artır.
6. Klasörü Netlify / Vercel / Cloudflare Pages gibi bir statik barındırmaya yükle.
7. İki ayrı ebeveyn hesabıyla dene: biri diğerinin çocuğunu görememeli.

Akış: ebeveyn e-posta ile girer → aydınlatma ve açık rıza kutularını işaretler → çocuğu takma ad + sınıfla ekler/seçer → site açılır. İlerleme (puan, yıldızlar, rozetler, seri, kazanım istatistikleri, tekrar listesi) çocuğun kaydında bulutta saklanır. Siteli "Çıkış" düğmesi çocuk değiştirir; "⚙️ Hesap" menüsünde oturumu kapatma, verileri indirme, rızayı geri çekme, çocuğu silme ve hesabı silme vardır.

Hesabı silme için (isteğe bağlı) bir Edge Function gerekir: `supabase functions new delete-account`:
```ts
import { createClient } from "npm:@supabase/supabase-js@2";
Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const user = await createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization")! } } }).auth.getUser();
  if (!user.data.user) return new Response("yetkisiz", { status: 401 });
  await createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!).auth.admin.deleteUser(user.data.user.id); // zincirleme silinir
  return new Response("ok");
});
```
(CORS başlıklarını Supabase belgesine göre ekleyin.) Bilinen sınırlar: bulut tarafında seçili ders/sınıf çocuğun kaydıyla birlikte saklanır; aynı anda iki cihazda oynanırsa son yazan kazanır. Bu bir hukuki görüş değildir; yayından önce KVKK kontrol listesini bir hukukçuyla gözden geçirin.

## Gezinme
Ana sayfa → ders kartı → ders sayfası → senaryo/ünite → oyun. Ders sayfasındaki bölümler ünite verisinden otomatik oluşur: bölgesi "N. Yazılı" olan ya da `okul: true` üniteler *Yazılı Senaryoları*na, `salon: true` olanlar *Oyunlar*a, diğerleri *Konu Çalışmaları*na girer.

## İçerik notları
- `data/gorseller-kitap.js` içindeki dört görsel "Oyunla Öğren" sitesinden gelen, ders kitabına ait görsellerdir; **herkese açık yayından önce kullanım izni kontrol edilmelidir.**
- Sorular kitap kazanımlarına göre hazırlanmıştır; yayından önce öğretmen onayından geçirin (Bilgi Köşesi → İçerik İnceleme sayfası bunun için vardır).
