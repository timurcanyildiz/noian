/**
 * ============================================================================
 *  ÖDEME ENTEGRASYON KATMANI — SHOPIER (HAZIR ANCAK BAĞLANMASI GEREKEN)
 * ============================================================================
 *  ⚠️ ÖNEMLİ — SAHİBİNİN YAPMASI GEREKENLER:
 *
 *  Bu site şu anda DEMO/TEST modunda çalışır. Gerçek para tahsilatı YAPILMAZ.
 *  Müşteri "Ödemeye Geç" dediğinde sipariş oluşturulur ama kart çekilmez.
 *
 *  GERÇEK SHOPIER BAĞLANTISI İÇİN:
 *  1) Shopier panelinden bir mağaza/ürün oluşturun ve API anahtarlarınızı alın.
 *     (Shopier > Ayarlar > API)
 *  2) Güvenlik nedeniyle ödeme imzası TARAYICIDA üretilemez. Küçük bir sunucu
 *     fonksiyonu gerekir (Supabase Edge Function veya benzeri):
 *        - İstemci sipariş bilgisini sunucuya gönderir
 *        - Sunucu, Shopier API anahtarı + gizli anahtarla imzalı ödeme formu üretir
 *        - Müşteri Shopier ödeme sayfasına yönlendirilir
 *        - Shopier, ödeme sonucunu "callback" adresinize bildirir
 *  3) .env dosyasına ekleyin:  VITE_SHOPIER_MODE=live
 *     ve sunucu tarafına: SHOPIER_API_KEY, SHOPIER_API_SECRET
 *
 *  Aşağıdaki fonksiyon, bağlantı yapıldığında doldurulacak yer tutucudur.
 * ============================================================================
 */
import { siteConfig } from "@/config/site";
import type { Order } from "@/data/types";

export type PaymentResult =
  | { status: "test_ok"; message: string }
  | { status: "redirect"; url: string }
  | { status: "error"; message: string };

export function isLivePayment(): boolean {
  return siteConfig.payment.mode === "live";
}

/**
 * Ödeme başlatma. DEMO modunda gerçek tahsilat yapılmaz.
 */
export async function startPayment(order: Order): Promise<PaymentResult> {
  if (!isLivePayment()) {
    // DEMO MODU: Gerçek ödeme alınmaz, sipariş "test" olarak işaretlenir.
    return {
      status: "test_ok",
      message:
        "Demo modu: Bu bir test siparişidir, gerçek ödeme alınmamıştır. " +
        "Gerçek Shopier bağlantısı için src/lib/payment.ts dosyasındaki notlara bakın.",
    };
  }

  // ⚠️ GERÇEK ENTEGRASYON BURAYA — sunucu fonksiyonunuzu çağırın.
  // `order` nesnesini sunucuya göndererek imzalı ödeme formu oluşturun:
  void order;
  //
  // const res = await fetch("/api/shopier/create-payment", {
  //   method: "POST",
  //   body: JSON.stringify(order),
  // });
  // const { paymentUrl } = await res.json();
  // return { status: "redirect", url: paymentUrl };

  return {
    status: "error",
    message:
      "Canlı ödeme henüz bağlanmadı. Lütfen src/lib/payment.ts içindeki sunucu " +
      "entegrasyonunu tamamlayın.",
  };
}
