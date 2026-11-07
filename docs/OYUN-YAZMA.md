# Yeni oyun ekleme

1. `games/<oyun>.js` dosyası oluşturun ve `Games` kayıt nesnesine ekleyin:
```js
Games.benimOyunum = {
  ad: "Oyun Adı", ikon: "🎯", acik: "Kısa açıklama.",
  uygun: (unit, ders) => !!unit.benimVerim,        // ünitede/derste veri varsa oyun görünür
  start(ctx) {
    // ctx.unit  : ünite verisi      ctx.ders : ders verisi (dil, setler, …)     ctx.root : çizim alanı
    // ctx.kz    : kazanım adları    ctx.bitir(sonuc) : oyunu bitirir
    const { el, fmt, shuffle, ses } = UI;
    ctx.root.replaceChildren(el("div", { class: "kart" }, "Merhaba!"));
    // ... oyun bitince:
    ctx.bitir({ dogru: 3, toplam: 5, puan: 30, yanlis: [], ozet: "3/5 doğru!" });
  }
};
```
2. Dosyayı `data/kayit.js` → `oyunlar` listesine ekleyin (sıra, varsayılan görünüm sırasıdır; derse özel sıra için `oyunSira`).
3. Oyun için gereken veriyi ünitelere (`benimVerim`) ekleyin ve `docs/PAKET-SEMASI.md` tablosuna not düşün.
4. `npm test` – duman testi her oyunu her adada açıp hata arar.

**Yıldız hesabı:** `dogru / toplam` oranı ≥ %90 → 3, ≥ %60 → 2, daha azı → 1 yıldız.
**Klavye:** `root._tus = (e) => {…}` atarsanız tuş olayları size gelir; bitirirken `root._tus = null` yapın.
**Yardımcılar:** `UI.el` (DOM kur), `UI.fmt` (güvenli metin + Arapça + mini işaretleme), `UI.shuffle`, `UI.ses.dogru()/yanlis()`, `UI.say(metin, "tr"|"en")`, `UI.gorsel(kazanımAnahtarı)`, `UI.toast`.
**Yanlış listesi:** `yanlis: ["ünite:sıra", …]` verirseniz sorular Tekrar Listesi'ne eklenir (kimliği `ünite.id:soruSırası` olmalı).
