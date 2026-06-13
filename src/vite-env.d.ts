/// <reference types="vite/client" />

interface ImportMetaEnv {
  // OWNER: Gerçek backend bağlantısı için .env dosyasına ekleyeceğiniz değişkenler.
  // Bkz. .env.example
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SHOPIER_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
