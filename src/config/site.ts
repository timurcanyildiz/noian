/**
 * ============================================================================
 *  ÖDEME AYARLARI
 * ============================================================================
 *  Marka, iletişim, kargo ve yasal bilgiler artık Yönetim Paneli → Ayarlar
 *  bölümünden düzenlenir (veritabanında saklanır). Bu dosya yalnızca ödeme
 *  sağlayıcısı yapılandırmasını tutar.
 * ============================================================================
 */
export const siteConfig = {
  payment: {
    provider: "shopier" as const,
    // "test" = demo modu (gerçek tahsilat yok). "live" = gerçek ödeme.
    // Vercel'de VITE_SHOPIER_MODE ortam değişkeniyle ayarlayın.
    mode: (import.meta.env.VITE_SHOPIER_MODE ?? "test") as "test" | "live",
  },
} as const;

export type SiteConfig = typeof siteConfig;
