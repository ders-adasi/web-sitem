# Ders paketi şeması

Bir ders paketi, `window.DERS_VERILERI[sınıf][dersKimliği] = { … }` atayan tek bir `.js` dosyasıdır (`data/<sınıf>/<ders>.js`).
Dosyayı `data/kayit.js` içindeki `paketler` listesine eklemek yeterlidir; ana sayfada ders kartı otomatik oluşur. Doğrulama: `npm run kontrol`.

## Ders (dk)
| Alan | Zorunlu | Açıklama |
|---|---|---|
| `ad`, `ikon` | ✔ | Ders adı ve emoji |
| `uniteler` | ✔ | Ünite/senaryo listesi (aşağıda) |
| `kazanimAd` | önerilir | `{ anahtar: "Kazanım adı" }` – ebeveyn panelinde kazanım başarısı için |
| `kazanimKod` | – | `{ anahtar: "FB.5.1.1" }` |
| `tema` | – | `["#ana","#koyu"]` (ya da `data/temalar.js`'ye ders kimliğiyle satır) |
| `dil` | – | `"tr"` (varsayılan) ya da `"en"` – sesli okuma ve adam asmaca alfabesi |
| `oyunSira` | – | Oyunların gösterim sırası (oyun kimlikleri) |
| `oyunAd` | – | `{ sort: "Reorder the Words" }` – oyun adlarını derse göre değiştirir |
| `setler` | – | `{ who: [[ad,[ipuçları]]], sit: [{s,o,d,a}], hdt: [{s,o,d,a}] }` – Kim Bu? / Ne Yapardın? / Tamamla |
| `sozluk`, `zaman`, `agac`, `agacAd`, `hikayeler` | – | Bilgi sayfalarının verisi |
| `sayfalar` | – | `[{id:"sozluk", ad:"📖 Sözlük"}, …]` (kimlikler `js/sayfalar.js`'deki `Sayfalar` anahtarlarıdır) |
| `harita` | – | `true` ise Harita Yolculuğu oyunu açılır |

## Ünite / senaryo (un)
`id` (benzersiz!), `ad`, `bolge`, `ikon`, `ar` (ada üstünde görünen kısa metin/emoji), `kazanimlar: ["…"]`, `sorular: [Soru]`.
- **Bölümlere yerleşim:** `bolge` içinde "N. Yazılı" geçerse ya da `okul: true` ise *Yazılı Senaryoları*; `salon: true` ise *Oyunlar*; diğerleri *Konu Çalışmaları*.
- `sinav: true` → Sınav Modu, Boss Savaşı, Düello vb. açılır. `okul: true` → "📌 Okulumuzun 1. yazılı senaryosu".

**Soru:** `{ s: "soru", o: ["şık1","şık2",…], d: doğruİndeks, i: "ipucu", a: "açıklama", k: "kazanımAnahtarı" }`
Metinde `\n` satır sonu, `{i}…{/i}` eğik, `{b}…{/b}` kalın yazar. Arapça metinler otomatik sağdan sola gösterilir.

## İsteğe bağlı oyun verileri (ünitede varsa ilgili oyun otomatik görünür)
| Alan | Oyun | Biçim |
|---|---|---|
| `eslestirme` | Hafıza Kartları | `[{ar:"kart A", tr:"eşi"}]` |
| `bosluk` | Boşluk Doldurma, Etkinlik Kâğıdı, Boss | `[["cümle ___ .","doğru|yanlış1|yanlış2"]]` |
| `siralama` | Sıralama Bulmacası | `[["başlık",["1.","2.","3."]]]` |
| `kelimeler` | Kelime Avı, Adam Asmaca | `[["KELİME","ipucu"]]` (en çok 10 harf) |
| `dy` | Doğru mu Yanlış mı? | `[["cümle", true, "açıklama"]]` |
| `bilgi` | Bilgi Kartları | `[["başlık","HTML metin","görselAnahtarı?"]]` |
| `hikaye` | Hikâyeli Macera | `[["sahne","soru","doğru|yanlış|…","açıklama"]]` |
| `deneyler` | Sanal Deneyler | `["dinamo","ay",…]` (`games/lab.js`) |
| `hesap`, `aci` | Hesap Yarışı, Açıyı Tahmin Et | `true` |
| `ses` | Listen & Choose, Spelling Bee | `[["word","Türkçesi"]]` |
