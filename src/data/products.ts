import type { Product } from "./types";

/**
 * ============================================================================
 *  DEMO ÜRÜN VERİSİ (Türkçe)
 * ============================================================================
 *  OWNER NOTU: Bunlar tanıtım amaçlı örnek ürünlerdir.
 *
 *  ⚠️ GERÇEK ÜRÜN FOTOĞRAFLARI: Aşağıdaki görsel adresleri (url) geçici
 *     stok fotoğraflarıdır. Yayına geçmeden önce annenizin gerçek çanta
 *     fotoğraflarıyla değiştirin. (Lovable'da görseli tıklayıp yükleyebilir
 *     veya bu dosyadaki url alanını güncelleyebilirsiniz.)
 *
 *  Fiyatlar TL ve KDV dahildir. Yeni ürün eklemek için listeye yeni bir
 *  nesne kopyalayıp düzenlemeniz yeterlidir.
 * ============================================================================
 */

// Geçici görseller (Unsplash) — OWNER: gerçek fotoğraflarla değiştirin.
const PH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

export const products: Product[] = [
  {
    id: "p-anatolia",
    slug: "anatolia-omuz-cantasi",
    name: "Anatolia Omuz Çantası",
    shortDescription: "El dokuma kumaştan, sıcak topraktan ilham alan omuz çantası.",
    description:
      "Anadolu motiflerinden ilham alınarak tasarlanan Anatolia, annemin tezgâhında tek tek dikilen, sınırlı sayıda üretilen bir parçadır. Yumuşak iç astarı ve ayarlanabilir askısıyla günlük kullanım için idealdir. Her dikiş, sabırla ve sevgiyle atılmıştır.",
    price: 1290,
    compareAtPrice: 1490,
    categoryId: "cat-omuz",
    materials: ["El dokuma pamuklu kumaş", "Pamuk astar", "Pirinç toka"],
    dimensions: "30 x 24 x 9 cm",
    inStock: true,
    stockCount: 6,
    isFeatured: true,
    isNew: true,
    careInstructions: "30°C'de elde yıkayınız. Ütülemeyiniz.",
    createdAt: "2026-05-01T10:00:00.000Z",
    images: [
      { id: "img-anatolia-1", productId: "p-anatolia", url: PH("photo-1591561954557-26941169b49e"), alt: "Anatolia omuz çantası önden görünüm", isPrimary: true, sortOrder: 1 },
      { id: "img-anatolia-2", productId: "p-anatolia", url: PH("photo-1584917865442-de89df76afd3"), alt: "Anatolia omuz çantası detay", sortOrder: 2 },
    ],
  },
  {
    id: "p-zeytin",
    slug: "zeytin-el-cantasi",
    name: "Zeytin El Çantası",
    shortDescription: "Adaçayı yeşili, davetler için zarif küçük el çantası.",
    description:
      "Zeytin, sakin yeşil tonuyla özel günleriniz için tasarlandı. Kadife dokulu kumaşı ve ince işçiliğiyle hem zarif hem dayanıklıdır. İçinde telefon ve temel eşyalarınız için bölmeler bulunur.",
    price: 940,
    categoryId: "cat-el",
    materials: ["Kadife kumaş", "Saten astar"],
    dimensions: "22 x 14 x 6 cm",
    inStock: true,
    stockCount: 4,
    isFeatured: true,
    careInstructions: "Yalnızca kuru temizleme önerilir.",
    createdAt: "2026-04-18T10:00:00.000Z",
    images: [
      { id: "img-zeytin-1", productId: "p-zeytin", url: PH("photo-1566150905458-1bf1fc113f0d"), alt: "Zeytin el çantası", isPrimary: true, sortOrder: 1 },
    ],
  },
  {
    id: "p-deniz",
    slug: "deniz-tote-canta",
    name: "Deniz Tote Çanta",
    shortDescription: "Geniş, dayanıklı ve doğa dostu günlük bez çanta.",
    description:
      "Pazardan plaja, her güne eşlik eden Deniz; kalın pamuklu kumaştan üretilmiştir. Geniş iç hacmi ve sağlam kulplarıyla günlük taşımalarınız için güvenilir bir yoldaştır.",
    price: 540,
    categoryId: "cat-bez",
    materials: ["Kalın pamuklu kanvas", "Pamuk ip kulp"],
    dimensions: "40 x 38 x 12 cm",
    inStock: true,
    stockCount: 12,
    isNew: true,
    careInstructions: "30°C'de makinede yıkanabilir.",
    createdAt: "2026-05-10T10:00:00.000Z",
    images: [
      { id: "img-deniz-1", productId: "p-deniz", url: PH("photo-1597484661643-2f5fef640dd1"), alt: "Deniz tote bez çanta", isPrimary: true, sortOrder: 1 },
    ],
  },
  {
    id: "p-lale",
    slug: "lale-makyaj-cantasi",
    name: "Lale Makyaj Çantası",
    shortDescription: "İşlemeli, su itici astarlı küçük makyaj çantası.",
    description:
      "Lale, çiçek işlemeleriyle bezenmiş, su itici iç astara sahip küçük bir makyaj çantasıdır. Çantanızın içinde dağınıklığı önler, hediye olarak da çok sevilir.",
    price: 320,
    categoryId: "cat-makyaj",
    materials: ["İşlemeli keten", "Su itici astar", "Metal fermuar"],
    dimensions: "20 x 12 x 6 cm",
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    careInstructions: "Nemli bezle siliniz.",
    createdAt: "2026-03-22T10:00:00.000Z",
    images: [
      { id: "img-lale-1", productId: "p-lale", url: PH("photo-1605733513597-a8f8341084e6"), alt: "Lale makyaj çantası", isPrimary: true, sortOrder: 1 },
    ],
  },
  {
    id: "p-toprak",
    slug: "toprak-sirt-cantasi",
    name: "Toprak Sırt Çantası",
    shortDescription: "Kahverengi tonlarda, günlük şehir kullanımına uygun sırt çantası.",
    description:
      "Toprak, sıcak kahve tonlarıyla şehir hayatına uyum sağlar. Yumuşak askıları ve dizüstü bilgisayar bölmesiyle hem işlevsel hem zariftir. Her parça siparişe özel hazırlanır.",
    price: 1650,
    categoryId: "cat-omuz",
    materials: ["Yıkanmış pamuklu kanvas", "Deri görünümlü detaylar"],
    dimensions: "32 x 40 x 14 cm",
    inStock: false,
    stockCount: 0,
    careInstructions: "Nemli bezle siliniz, makinede yıkamayınız.",
    createdAt: "2026-02-14T10:00:00.000Z",
    images: [
      { id: "img-toprak-1", productId: "p-toprak", url: PH("photo-1553062407-98eeb64c6a62"), alt: "Toprak sırt çantası", isPrimary: true, sortOrder: 1 },
    ],
  },
  {
    id: "p-gece",
    slug: "gece-cuzdani",
    name: "Gece Cüzdanı",
    shortDescription: "İnce, çok bölmeli el yapımı cüzdan.",
    description:
      "Gece, ince yapısıyla cebinizde ya da çantanızda az yer kaplar; kart bölmeleri ve bozuk para gözüyle günlük ihtiyaçlarınızı karşılar. Sade ve şık bir hediye seçeneğidir.",
    price: 280,
    categoryId: "cat-makyaj",
    materials: ["Dokuma kumaş", "Çıtçıt kapama"],
    dimensions: "19 x 10 cm",
    inStock: true,
    stockCount: 9,
    careInstructions: "Nemli bezle siliniz.",
    createdAt: "2026-04-02T10:00:00.000Z",
    images: [
      { id: "img-gece-1", productId: "p-gece", url: PH("photo-1627123424574-724758594e93"), alt: "Gece cüzdanı", isPrimary: true, sortOrder: 1 },
    ],
  },
  {
    id: "p-bahar",
    slug: "bahar-omuz-cantasi",
    name: "Bahar Omuz Çantası",
    shortDescription: "Çiçek desenli, ferah ve neşeli orta boy omuz çantası.",
    description:
      "Bahar, neşeli çiçek desenleriyle günlük kombinlerinize canlılık katar. Orta boyu ve hafif yapısıyla gün boyu rahatça taşınır.",
    price: 1090,
    categoryId: "cat-omuz",
    materials: ["Baskılı pamuklu kumaş", "Pamuk astar"],
    dimensions: "28 x 22 x 8 cm",
    inStock: true,
    stockCount: 7,
    isNew: true,
    careInstructions: "30°C'de elde yıkayınız.",
    createdAt: "2026-05-20T10:00:00.000Z",
    images: [
      { id: "img-bahar-1", productId: "p-bahar", url: PH("photo-1614179689702-355944cd0918"), alt: "Bahar omuz çantası", isPrimary: true, sortOrder: 1 },
    ],
  },
  {
    id: "p-inci",
    slug: "inci-el-cantasi",
    name: "İnci El Çantası",
    shortDescription: "Boncuk işlemeli, zarif gece çantası.",
    description:
      "İnci, el işi boncuk detaylarıyla özel davetlerin yıldızı olmaya aday. Küçük ama gösterişli bu parça, sade kıyafetleri bile özel gösterir.",
    price: 1180,
    categoryId: "cat-el",
    materials: ["Saten kumaş", "El işi boncuk", "Metal zincir askı"],
    dimensions: "20 x 12 x 5 cm",
    inStock: true,
    stockCount: 3,
    careInstructions: "Kuru temizleme önerilir.",
    createdAt: "2026-03-05T10:00:00.000Z",
    images: [
      { id: "img-inci-1", productId: "p-inci", url: PH("photo-1564422170194-896b89110ef8"), alt: "İnci el çantası", isPrimary: true, sortOrder: 1 },
    ],
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId);

export const getFeaturedProducts = () => products.filter((p) => p.isFeatured);

export const getPrimaryImage = (product: Product) =>
  product.images.find((i) => i.isPrimary) ?? product.images[0];
