# Noian Bags 🧵

Annemin elinden çıkan, el emeği kumaş çantalar için sıcak, sade ve butik bir
e-ticaret sitesi. **Vercel** üzerinde yayınlanır, **Neon Postgres** veritabanı
kullanır ve dahili bir **yönetim paneli** (admin) ile ürün/sayfa/logo
düzenlenebilir.

> Site, veritabanı **bağlı olmasa bile** demo verilerle (tarayıcıda) çalışır.
> Neon bağlanıp "Veritabanını Kur" çalıştırıldığında otomatik olarak gerçek
> veritabanına geçer.

## Teknoloji
- **Önyüz:** React + Vite + TypeScript + Tailwind CSS
- **Sunucu:** Vercel Serverless Functions (`/api`)
- **Veritabanı:** Neon Postgres (`@neondatabase/serverless`)
- **Görsel depolama:** Vercel Blob (`@vercel/blob`)
- **Admin girişi:** tek şifre (JWT oturum)

## Hızlı Başlangıç (Lokal)

```bash
npm install
npm run dev        # http://localhost:8080 (yalnızca arayüz; /api çalışmaz)
```

Lokalde `/api` uçları çalışmaz; uygulama otomatik olarak tarayıcı
depolamasına (localStorage) düşer. Admin paneline lokal geçici şifreyle
girebilirsiniz: **`noian-admin`**.

Sunucu uçlarını lokalde de denemek için Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Vercel'e Yayınlama (Adım Adım)

1. **Projeyi Vercel'e bağlayın** (GitHub'a push edip "Import Project" veya
   `vercel` komutu). Framework otomatik "Vite" algılanır.
2. **Neon veritabanı oluşturun:** Vercel → Storage → "Create Database" → Neon
   (veya neon.tech). Bağlantı dizesini `DATABASE_URL` olarak ekleyin.
3. **Vercel Blob deposu bağlayın:** Vercel → Storage → "Create" → Blob.
   `BLOB_READ_WRITE_TOKEN` otomatik eklenir (logo/ürün fotoğrafı yükleme için).
4. **Ortam değişkenlerini girin** (`.env.example` dosyasına bakın):
   `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
   (Blob bağlıysa token otomatik), `VITE_SHOPIER_MODE=test`.
5. **Deploy edin.** Site açıldıktan sonra `/admin` adresine gidin, şifrenizle
   girin ve panelde **"Veritabanını Kur / Demo Verileri Yükle"** düğmesine
   basın. Tablolar oluşturulur ve demo ürünler yüklenir.
6. **Alan adını bağlayın:** Vercel → Settings → Domains → kendi alan adınız.

## Yönetim Paneli (`/admin`)

| Bölüm | Ne yapar |
|------|----------|
| **Panel** | Özet istatistikler + "Veritabanını Kur" |
| **Ürünler** | Ürün ekle/düzenle/sil, fotoğraf yükle, fiyat/stok/kategori |
| **Kategoriler** | Kategori ekle/düzenle/sil |
| **Siparişler** | Siparişleri görüntüle, durum güncelle |
| **Yorumlar** | Müşteri yorumları ekle/düzenle/sil |
| **Ayarlar** | Logo, marka adı, iletişim, kargo, yasal/şirket bilgileri, ana sayfa metinleri |

## Proje Yapısı

```
api/                     # Vercel Serverless Functions
├── _lib/                # db (Neon), auth (JWT), şema, http yardımcıları
├── products.ts          # ürün CRUD
├── categories.ts        # kategori CRUD
├── orders.ts            # sipariş oluştur/listele/güncelle
├── testimonials.ts      # yorum CRUD
├── settings.ts          # site ayarları (logo/iletişim/kargo/yasal)
├── upload.ts            # Vercel Blob görsel yükleme
├── login.ts             # admin girişi
└── seed.ts              # şema kurulumu + demo veri

src/
├── admin/               # Yönetim paneli (giriş, panel, CRUD sayfaları)
├── config/site.ts       # ödeme modu ayarı
├── context/             # Catalog, Settings, Cart, Auth, Toast, Admin
├── data/                # tipler + demo tohum veriler + ayar varsayılanları
├── lib/
│   ├── api.ts           # API istemcisi (sunucu + localStorage yedeği)
│   ├── localStore.ts    # veritabanı yokken yedek katman
│   └── payment.ts       # Shopier ödeme entegrasyon noktası
├── components/          # Header, Footer, ürün kartı, formlar...
└── pages/               # mağaza sayfaları (Türkçe rotalar)
```

## Veri Modeli
`src/data/types.ts` tüm varlıkları tanımlar ve Neon tablolarıyla eşleşir:
`categories`, `products`, `orders`, `testimonials`, `settings`
(+ misafir/üyelik adres ve kalem yapıları).

## Yayına Geçmeden Önce
| Konu | Durum | Nasıl |
|------|-------|-------|
| Tasarım, mağaza akışı, admin paneli | ✅ Hazır | — |
| Neon veritabanı | ⚙️ Bağla | `DATABASE_URL` + "Veritabanını Kur" |
| Görsel yükleme (logo/ürün) | ⚙️ Bağla | Vercel Blob deposu |
| Admin şifresi | ⚙️ Ayarla | `ADMIN_PASSWORD` |
| Ödeme (Shopier) | ⚠️ Bağlanmalı | `src/lib/payment.ts` (sunucu fonksiyonu) |
| Gerçek fotoğraf/metin/iletişim | ✏️ Değiştir | Yönetim Paneli → Ayarlar & Ürünler |
| Alan adı | ⚙️ Bağla | Vercel → Domains |

Detaylar için site içindeki **Site Sahibi Rehberi** (`/sahip-rehberi`) sayfasına
bakın.

## Ödeme (Shopier)
Güvenlik nedeniyle Shopier ödeme imzası tarayıcıda üretilemez; küçük bir sunucu
fonksiyonu gerekir. Adımlar `src/lib/payment.ts` içinde açıklanmıştır. Demo
modundan canlıya geçmek için `VITE_SHOPIER_MODE=live` yapın ve sunucu
entegrasyonunu tamamlayın.
