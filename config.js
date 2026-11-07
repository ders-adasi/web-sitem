// Supabase proje bilgilerini yazınca bulut modu açılır (giriş + rıza + bulutta kayıt). Boş bırakılırsa site yerel (tarayıcı) modda çalışır.
// ANON anahtarı herkese açıktır (RLS kuralları korur). service_role anahtarını ASLA buraya koyma.
window.BILGI_CONFIG = {
  SUPABASE_URL: "",             // örn. https://xxxx.supabase.co
  SUPABASE_ANON_KEY: "",        // Project Settings > API > anon public
  CONSENT_VERSION: "2026-11-v1",// aydınlatma/rıza metni sürümü; metin değişince artır
  AYDINLATMA_URL: "aydinlatma.html",
  RIZA_URL: "riza.html",
  CONTACT_EMAIL: ""             // hesap silme için yedek iletişim
};
