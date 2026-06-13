/**
 * Neon Postgres bağlantısı (serverless HTTP sürücüsü).
 * DATABASE_URL ortam değişkeni Vercel panelinden / Neon'dan alınır.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getSql(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL tanımlı değil. Vercel ortam değişkenlerine Neon bağlantı dizesini ekleyin.",
    );
  }
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}
