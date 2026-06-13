/**
 * ============================================================================
 *  NOIAN BAGS — VERİ MODELİ (DATA MODEL)
 * ============================================================================
 *  Bu dosya, sitenin tüm veri yapısını tanımlar. Gerçek bir veritabanına
 *  (örn. Supabase / PostgreSQL) geçildiğinde bu tipler tablo şemalarınızla
 *  birebir eşleşecek şekilde tasarlanmıştır.
 *
 *  Önerilen tablo isimleri yorum satırlarında belirtilmiştir.
 *  OWNER: Burada yeni alanlar ekleyebilir, mevcut alanları düzenleyebilirsiniz.
 * ============================================================================
 */

/** Tablo: users — Müşteri hesapları */
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string; // ISO tarih
  // NOT: Şifreler gerçek backend'de ASLA düz metin tutulmaz.
  // Supabase Auth / başka bir sağlayıcı şifre yönetimini üstlenir.
}

/** Tablo: categories — Ürün kategorileri */
export interface Category {
  id: string;
  slug: string;
  name: string; // Türkçe görünen ad
  description?: string;
}

/** Tablo: product_images — Ürün fotoğrafları (bir ürünün birden çok görseli olabilir) */
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

/** Tablo: products — Satılan el emeği çantalar */
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number; // TL, KDV dahil
  compareAtPrice?: number; // İndirim öncesi fiyat (opsiyonel)
  categoryId: string;
  images: ProductImage[];
  materials: string[]; // Kumaş / malzeme bilgisi
  dimensions?: string; // Örn. "30 x 22 x 10 cm"
  inStock: boolean;
  stockCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  careInstructions?: string;
  createdAt: string;
}

/** Tablo: cart_items — Sepet kalemleri (oturum/kullanıcı bazlı) */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** Sepette gösterim için ürünle zenginleştirilmiş kalem (türetilmiş, DB'de saklanmaz) */
export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

/** Tablo: addresses — Teslimat / fatura adresleri */
export interface Address {
  id: string;
  userId?: string; // Misafir alışverişte boş olabilir
  fullName: string;
  phone: string;
  city: string; // İl
  district: string; // İlçe
  addressLine: string; // Açık adres
  postalCode?: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "beklemede" // ödeme bekleniyor
  | "hazirlaniyor" // ödeme alındı, hazırlanıyor
  | "kargoda"
  | "teslim_edildi"
  | "iptal";

export type PaymentMethod = "shopier" | "havale" | "kapida"; // OWNER: aktif yöntemleri ayarlayın
export type PaymentStatus = "odendi" | "beklemede" | "basarisiz" | "test";

/** Tablo: order_items — Sipariş içindeki kalemler (fiyat anlık olarak dondurulur) */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string; // Sipariş anındaki ad (snapshot)
  unitPrice: number; // Sipariş anındaki fiyat (snapshot)
  quantity: number;
}

/** Tablo: orders — Siparişler */
export interface Order {
  id: string;
  orderNumber: string; // Müşteriye gösterilen takip no
  userId?: string; // Misafir siparişte boş
  email: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string;
  createdAt: string;
}

/** Tablo: testimonials — Müşteri yorumları (opsiyonel) */
export interface Testimonial {
  id: string;
  authorName: string;
  location?: string;
  rating: number; // 1-5
  text: string;
}
