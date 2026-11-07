/* 5. Sınıf Arapça – Senaryo 6 (1. Ünite: Merhaba, 2. Ünite: Sınıfım)
   Soru ekleme: ilgili ünitenin "sorular" listesine {s, o, d, i, a} ekleyin.
   s: soru, o: seçenekler, d: doğru seçeneğin sırası (0'dan başlar), i: ipucu, a: kısa açıklama.
   Tüm sorular özgün yazılmıştır. Arapça metinleri öğretmen/ders kitabıyla doğrulatın. */
window.DERS_VERILERI = window.DERS_VERILERI || {};
window.DERS_VERILERI["5"] = window.DERS_VERILERI["5"] || {};
window.DERS_VERILERI["5"].arapca = {
  ad: "Arapça", ikon: "🌙",
  uniteler: [
    {
      id: "merhaba", okul: true, ad: "1. Ünite: Merhaba", ar: "مَرْحَبًا", bolge: "Merhaba Ormanı", ikon: "🌳",
      kazanimlar: [
        "5.1.1.3 Selamlaşma, tanışma ve vedalaşma konuşmalarını anlamlandırır.",
        "5.1.5.3 – 5.1.5.4 Aynı ifadelerle kendi konuşmasını kurar ve söyler.",
        "5.1.4.1 – 5.1.6.2 Harfleri harekeleriyle okur ve yazılışlarını kopyalar."
      ],
      sorular: [
        { s: "Biri sana «اَلسَّلامُ عَلَيْكُمْ» dedi. Ona ne cevap vermelisin?", o: ["وَعَلَيْكُمُ السَّلامُ", "فِي أَمَانِ اللَّهِ", "صَبَاحُ الْخَيْرِ", "شُكْرًا"], d: 0, i: "Cevap, selamın başına «ve» ekleyip kelimeleri ters çevirir.", a: "Selama «ve aleyküm es-selâm» diye karşılık verilir." },
        { s: "«صَبَاحُ الْخَيْرِ» ifadesi günün hangi vaktinde söylenir?", o: ["Sabah", "Akşam", "Ayrılırken", "Yemekten sonra"], d: 0, i: "«Sabah» kelimesinin Arapçası صَبَاح'tır.", a: "صَبَاحُ الْخَيْرِ «Günaydın» demektir." },
        { s: "«صَبَاحُ الْخَيْرِ» diyen birine hangisiyle cevap verilir?", o: ["صَبَاحُ النُّورِ", "مَسَاءُ النُّورِ", "مَعَ السَّلامَةِ", "تَشَرَّفْتُ"], d: 0, i: "Cevapta «hayır» yerine «nur» gelir.", a: "Günaydın cevabı صَبَاحُ النُّورِ'dur." },
        { s: "«مَسَاءُ الْخَيْرِ» ne demektir?", o: ["İyi akşamlar", "Günaydın", "Hoş geldin", "Görüşürüz"], d: 0, i: "مَسَاء kelimesi akşam demektir.", a: "مَسَاءُ الْخَيْرِ akşam selamıdır." },
        { s: "Hangisi bir vedalaşma ifadesidir?", o: ["مَعَ السَّلامَةِ", "مَرْحَبًا", "أَهْلًا وَسَهْلًا", "تَشَرَّفْتُ"], d: 0, i: "«Güle güle» ayrılırken söylenir.", a: "مَعَ السَّلامَةِ «Güle güle» demektir." },
        { s: "«فِي أَمَانِ اللَّهِ» ifadesinin Türkçesi hangisidir?", o: ["Allah'a emanet ol", "Hoş geldin", "Memnun oldum", "İyiyim"], d: 0, i: "Ayrılırken söylenir.", a: "فِي أَمَانِ اللَّهِ vedalaşma ifadesidir." },
        { s: "Bir kız arkadaşına «Adın ne?» demek istiyorsun. Hangisini söylersin?", o: ["مَا اسْمُكِ؟", "مَا اسْمُكَ؟", "كَيْفَ حَالُكَ؟", "هَلْ أَنْتَ أَحْمَدُ؟"], d: 0, i: "Kıza söylerken kelimenin sonu esre ile biter.", a: "Kıza esre (ـكِ), erkeğe üstün (ـكَ) gelir." },
        { s: "«كَيْفَ حَالُكَ؟» sorusuna hangisiyle cevap verilir?", o: ["بِخَيْرٍ، الْحَمْدُ لِلَّهِ", "مَرْحَبًا", "إِلَى اللِّقَاءِ", "عَفْوًا"], d: 0, i: "Soru «Nasılsın?» anlamında.", a: "Cevap: «İyiyim, Allah'a şükür»." },
        { s: "«تَشَرَّفْتُ» ne zaman söylenir?", o: ["Yeni tanışınca", "Ayrılırken", "Sabah uyanınca", "Teşekkür ederken"], d: 0, i: "«Memnun oldum» demektir.", a: "تَشَرَّفْتُ tanışma ifadesidir; cevabı فُرْصَةٌ سَعِيدَةٌ." },
        { s: "«اِسْمِي لَيْلَى» cümlesi ne anlama gelir?", o: ["Benim adım Leyla.", "Senin adın Leyla mı?", "Leyla hoş geldi.", "Leyla gitti."], d: 0, i: "اِسْمِي = «benim adım».", a: "اِسْمِي ... ile kendimizi tanıtırız." },
        { s: "«شُكْرًا» diyen birine ne dersin?", o: ["عَفْوًا", "مَرْحَبًا", "صَبَاحُ النُّورِ", "تَشَرَّفْتُ"], d: 0, i: "«Rica ederim» demek istiyoruz.", a: "شُكْرًا = Teşekkürler, عَفْوًا = Rica ederim." },
        { s: "Arapça hangi yönde yazılır ve okunur?", o: ["Sağdan sola", "Soldan sağa", "Yukarıdan aşağı", "Aşağıdan yukarı"], d: 0, i: "Defterine yazarken önce sağ tarafa bak.", a: "Arapça sağdan sola yazılır." },
        { s: "Arap alfabesinde kaç harf vardır?", o: ["28", "24", "29", "32"], d: 0, i: "Bu sayı çift ve 30'dan küçük.", a: "Arap alfabesi 28 harftir." },
        { s: "Hangi hareke harfin ALTINA yazılır?", o: ["Kesra (esre)", "Fetha (üstün)", "Damme (ötre)", "Hiçbiri"], d: 0, i: "Adı «esre»; aşağı doğru düşün.", a: "Üstün ve ötre harfin üstüne, esre altına yazılır." },
        { s: "«بُ» harfini nasıl okuruz?", o: ["bu", "ba", "bi", "be"], d: 0, i: "Hareke damme.", a: "Damme (ötre) kısa «u/ü» sesi verir." },
        { s: "«ثَ» harfinin sesi nasıl çıkar?", o: ["Dil ucu dişlerin arasında, peltek bir «s»", "Kalın bir «s»", "Gırtlaktan hırıltılı «h»", "Kalın «d»"], d: 0, i: "İngilizce think kelimesindeki th gibi.", a: "ث peltek «s» sesidir." },
        { s: "Hangi harf kalın «s» sesi verir?", o: ["ص", "س", "ش", "ث"], d: 0, i: "Hangisinin sesi kalın?", a: "ص kalın «s», س ince «s»'dir." },
        { s: "Üstünde iki nokta olan harf hangisidir?", o: ["ق", "ف", "غ", "ع"], d: 0, i: "ف bir noktalıdır.", a: "ق üstünde iki, ف üstünde bir nokta vardır." },
        { s: "Altında tek nokta olan harf hangisidir?", o: ["ب", "ت", "ث", "ن"], d: 0, i: "Diğerlerinin noktaları üstte.", a: "ب altında bir nokta taşır." },
        { s: "«هَلْ أَنْتَ أَحْمَدُ؟» sorusuna «Evet, benim.» demek için hangisi söylenir?", o: ["نَعَمْ، أَنَا أَحْمَدُ", "لا، أَنَا أَحْمَدُ", "مَعَ السَّلامَةِ", "أَهْلًا بِكَ"], d: 0, i: "نَعَمْ evet demektir.", a: "نَعَمْ = evet, لا = hayır." },
        { s: "«أَهْلًا وَسَهْلًا» hangi durumda söylenir?", o: ["Birini karşılarken", "Birinden ayrılırken", "Teşekkür ederken", "Özür dilerken"], d: 0, i: "«Hoş geldin» demektir.", a: "أَهْلًا وَسَهْلًا karşılama ifadesidir." },
        { s: "«السَّلامُ قَبْلَ الْكَلامِ» sözü ne demektir?", o: ["Selam, sözden önce gelir.", "Söz, selamdan önce gelir.", "Selam vermek yasaktır.", "Sessiz kalmak güzeldir."], d: 0, i: "قَبْلَ = önce.", a: "Önce selam verilir, sonra konuşulur." }
      ],
      eslestirme: [
        { ar: "اَلسَّلامُ عَلَيْكُمْ", tr: "Selamün aleyküm" }, { ar: "مَرْحَبًا", tr: "Merhaba" },
        { ar: "أَهْلًا وَسَهْلًا", tr: "Hoş geldin" }, { ar: "صَبَاحُ الْخَيْرِ", tr: "Günaydın" },
        { ar: "مَسَاءُ الْخَيْرِ", tr: "İyi akşamlar" }, { ar: "كَيْفَ حَالُكَ؟", tr: "Nasılsın?" },
        { ar: "مَا اسْمُكَ؟", tr: "Adın ne?" }, { ar: "تَشَرَّفْتُ", tr: "Memnun oldum" },
        { ar: "فِي أَمَانِ اللَّهِ", tr: "Allah'a emanet ol" }, { ar: "مَعَ السَّلامَةِ", tr: "Güle güle" },
        { ar: "إِلَى اللِّقَاءِ", tr: "Görüşmek üzere" }, { ar: "شُكْرًا", tr: "Teşekkürler" }
      ],
      kur: {
        mod: "kelime",
        ogeler: [
          { tr: "Selamün aleyküm", p: ["اَلسَّلامُ", "عَلَيْكُمْ"] },
          { tr: "Hoş geldin", p: ["أَهْلًا", "وَسَهْلًا"] },
          { tr: "Günaydın", p: ["صَبَاحُ", "الْخَيْرِ"] },
          { tr: "Günaydın'ın cevabı", p: ["صَبَاحُ", "النُّورِ"] },
          { tr: "İyi akşamlar", p: ["مَسَاءُ", "الْخَيْرِ"] },
          { tr: "Nasılsın? (erkeğe)", p: ["كَيْفَ", "حَالُكَ؟"] },
          { tr: "Adın ne? (kıza)", p: ["مَا", "اسْمُكِ؟"] },
          { tr: "Allah'a emanet ol", p: ["فِي", "أَمَانِ", "اللَّهِ"] },
          { tr: "Güle güle", p: ["مَعَ", "السَّلامَةِ"] },
          { tr: "Görüşmek üzere", p: ["إِلَى", "اللِّقَاءِ"] },
          { tr: "İyiyim, Allah'a şükür", p: ["بِخَيْرٍ،", "الْحَمْدُ", "لِلَّهِ"] }
        ]
      }
    },
    {
      id: "sinifim", okul: true, ad: "2. Ünite: Sınıfım", ar: "صَفِّي", bolge: "Sınıfım Adası", ikon: "🏝️",
      kazanimlar: [
        "5.2.1.3 Sınıf eşyaları ve yönergelerle ilgili konuşmaları anlamlandırır.",
        "5.2.1.4 Öğrendiklerini, yaşadıklarını ve duygularını yansıtır.",
        "5.2.4.1 – 5.2.6.2 Harflerin kelime içindeki hâllerini okur ve yazar."
      ],
      sorular: [
        { s: "«مَا هَذَا؟» sorusuna doğru cevap hangisidir?", o: ["هَذَا قَلَمٌ", "نَعَمْ", "مَعَ السَّلامَةِ", "اِسْمِي قَلَمٌ"], d: 0, i: "Soru «Bu ne?» anlamında.", a: "«Bu ne?» sorusuna «Bu bir kalem.» diye cevap verilir." },
        { s: "Hangi kelimeyle «هَذِهِ» kullanılır?", o: ["حَقِيبَة", "قَلَم", "كِتَاب", "دَفْتَر"], d: 0, i: "ة ile biten kelimeye bak.", a: "ة ile biten kelimeler genellikle dişildir; هَذِهِ ile kullanılır." },
        { s: "Hangi kelimeyle «هَذَا» kullanılır?", o: ["كِتَاب", "طَاوِلَة", "مَدْرَسَة", "سَبُّورَة"], d: 0, i: "ة ile bitmeyen kelimeyi seç.", a: "كِتَاب ة ile bitmez; هَذَا كِتَابٌ denir." },
        { s: "«سَبُّورَة» ne demektir?", o: ["Tahta", "Sıra", "Silgi", "Çanta"], d: 0, i: "Öğretmen üzerine yazar.", a: "سَبُّورَة sınıftaki tahtadır." },
        { s: "«كُرْسِيّ» ne demektir?", o: ["Sandalye", "Masa", "Defter", "Okul"], d: 0, i: "Üzerine oturulur.", a: "كُرْسِيّ = sandalye." },
        { s: "«مِمْحَاة» ne demektir?", o: ["Silgi", "Kalem", "Kitap", "Tahta"], d: 0, i: "Yanlışı silmek için kullanılır.", a: "مِمْحَاة = silgi (هَذِهِ مِمْحَاةٌ)." },
        { s: "«مَدْرَسَة» ne demektir?", o: ["Okul", "Sınıf", "Masa", "Öğrenci"], d: 0, i: "Her sabah gittiğin yer.", a: "مَدْرَسَة = okul; صَفّ = sınıf." },
        { s: "Evet-hayır sorusu açan Arapça kelime hangisidir?", o: ["هَلْ", "مَا", "فِي", "مَعَ"], d: 0, i: "«...mi/mı?» anlamı katar.", a: "هَلْ evet-hayır sorusu açar; مَا «ne» demektir." },
        { s: "«هَلْ هَذَا كِتَابٌ؟» sorusuna «Hayır, bu defter.» demek için hangisi söylenir?", o: ["لا، هَذَا دَفْتَرٌ", "نَعَمْ، هَذَا دَفْتَرٌ", "لا، هَذِهِ دَفْتَرٌ", "نَعَمْ، هَذَا كِتَابٌ"], d: 0, i: "لا hayır demektir; defter için هَذَا.", a: "لا = hayır; دَفْتَر için هَذَا kullanılır." },
        { s: "Bir erkek öğrenciye «Kapat» demek için hangisi söylenir?", o: ["أَغْلِقْ", "اِفْتَحْ", "خُذْ", "أَعْطِ"], d: 0, i: "اِفْتَحْ «aç» demektir.", a: "أَغْلِقْ = Kapat." },
        { s: "Bir kız öğrenciye «Aç» demek için hangisi söylenir?", o: ["اِفْتَحِي", "اِفْتَحْ", "أَغْلِقِي", "خُذِي"], d: 0, i: "Kıza söylerken sonda «ي» olur.", a: "Kıza: اِفْتَحِي, erkeğe: اِفْتَحْ." },
        { s: "«خُذْ» yönergesi ne demektir?", o: ["Al", "Ver", "Aç", "Otur"], d: 0, i: "أَعْطِ ver demektir.", a: "خُذْ = Al." },
        { s: "«أَعْطِنِي» ne demektir?", o: ["Bana ver", "Bana bak", "Beni dinle", "Beni bırak"], d: 0, i: "Bir şey isterken kullanılır.", a: "أَعْطِنِي = Bana ver." },
        { s: "«صَفّ» kelimesindeki şedde ne işe yarar?", o: ["Harfin iki kez okunmasını sağlar", "Harfi uzatır", "Harfi okutmaz", "Sona «n» sesi ekler"], d: 0, i: "Okunuşu «saf» değil «saff».", a: "Şedde (ّ) harfi çift okutur." },
        { s: "Hangi harf kendinden sonraki harfe BAĞLANMAZ?", o: ["ر", "ب", "ت", "س"], d: 0, i: "Bağlanmayan harfler: ا د ذ ر ز و", a: "ا د ذ ر ز و harfleri sonrakine bağlanmaz." },
        { s: "Kelimenin sonunda gelen «ة» harfine ne ad verilir?", o: ["Ta marbuta", "Şedde", "Cezm", "Tenvin"], d: 0, i: "Çoğunlukla dişil kelimelerin sonundadır.", a: "ة, kelime sonunda gelen «ta marbuta»'dır." },
        { s: "Tenvin ne yapar?", o: ["Kelime sonunda «-un/-en/-in» sesi verir", "Harfi çift okutur", "Harfi ünlüsüz okutur", "Harfi uzatır"], d: 0, i: "Sonda ek bir n sesi duyulur.", a: "Tenvinde ayrıca «n» harfi yazılmaz." },
        { s: "Cezm (ـْ) ne yapar?", o: ["Harfi ünlüsüz okutur", "Harfi iki kez okutur", "Sesi uzatır", "Kelimeyi bitirir"], d: 0, i: "دَفْتَر → def-ter.", a: "Cezm (sükun) harfin ünlü almadan okunmasını sağlar." },
        { s: "Hangileri med (uzatma) harfleridir?", o: ["ا و ي", "ب ت ث", "ق ف ك", "د ذ ر"], d: 0, i: "Üç harf; hareke ile uyumlu olunca uzatır.", a: "ا، و، ي uygun hareke ile uzun okunur." },
        { s: "Erkek öğrenciye ne denir?", o: ["طَالِب", "طَالِبَة", "صَدِيقَتِي", "مَدْرَسَة"], d: 0, i: "ة ile bitmeyen erkektir.", a: "طَالِب erkek, طَالِبَة kız öğrencidir." },
        { s: "«صَدِيقَتِي» ne demektir?", o: ["Kız arkadaşım", "Erkek arkadaşım", "Öğretmenim", "Sınıfım"], d: 0, i: "ة ile bitiyor.", a: "صَدِيقِي erkek, صَدِيقَتِي kız arkadaşım." },
        { s: "«دَفْتَر» kelimesi nasıl okunur?", o: ["def-ter", "de-fe-ter", "dif-tar", "daf-tur"], d: 0, i: "ف üzerindeki cezme dikkat.", a: "ف'nin cezmi nedeniyle «def-ter» okunur." },
        { s: "«سَبُّورَة» kelimesi nasıl okunur?", o: ["seb-bû-ra", "se-bu-ra", "sa-bor-a", "seb-ra"], d: 0, i: "Şedde ve med harfi var.", a: "Şedde ب'yi iki kez, و uzun «û» okutur." },
        { s: "«الْعِلْمُ نَافِعٌ» sözü ne demektir?", o: ["İlim faydalıdır.", "İlim zordur.", "İlim sessizdir.", "İlim uzaktır."], d: 0, i: "نَافِع = faydalı.", a: "Ünitenin sözü: «İlim faydalıdır.»" }
      ],
      eslestirme: [
        { ar: "سَبُّورَة", tr: "tahta" }, { ar: "كِتَاب", tr: "kitap" }, { ar: "قَلَم", tr: "kalem" },
        { ar: "دَفْتَر", tr: "defter" }, { ar: "طَاوِلَة", tr: "masa" }, { ar: "كُرْسِيّ", tr: "sandalye" },
        { ar: "حَقِيبَة", tr: "çanta" }, { ar: "مِمْحَاة", tr: "silgi" }, { ar: "مَدْرَسَة", tr: "okul" },
        { ar: "صَفّ", tr: "sınıf" }, { ar: "اِفْتَحْ", tr: "Aç" }, { ar: "أَغْلِقْ", tr: "Kapat" }, { ar: "خُذْ", tr: "Al" }
      ],
      kur: {
        mod: "harf",
        ogeler: [
          { tr: "kalem", ar: "قَلَم", h: ["ق", "ل", "م"], x: ["ف"] },
          { tr: "kitap", ar: "كِتَاب", h: ["ك", "ت", "ا", "ب"], x: ["ث"] },
          { tr: "defter", ar: "دَفْتَر", h: ["د", "ف", "ت", "ر"], x: ["ذ"] },
          { tr: "masa", ar: "طَاوِلَة", h: ["ط", "ا", "و", "ل", "ة"], x: ["ظ"] },
          { tr: "sandalye", ar: "كُرْسِيّ", h: ["ك", "ر", "س", "ي"], x: ["ز"] },
          { tr: "okul", ar: "مَدْرَسَة", h: ["م", "د", "ر", "س", "ة"], x: ["ص"] },
          { tr: "çanta", ar: "حَقِيبَة", h: ["ح", "ق", "ي", "ب", "ة"], x: ["خ"] },
          { tr: "tahta", ar: "سَبُّورَة", h: ["س", "ب", "و", "ر", "ة"], x: ["ش"] },
          { tr: "silgi", ar: "مِمْحَاة", h: ["م", "م", "ح", "ا", "ة"], x: ["ه"] },
          { tr: "sıra / yazı masası", ar: "مَكْتَب", h: ["م", "ك", "ت", "ب"], x: ["ث"] },
          { tr: "koltuk / oturak", ar: "مَقْعَد", h: ["م", "ق", "ع", "د"], x: ["غ"] }
        ]
      }
    }
  ]
};
