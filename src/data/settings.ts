/**
 * Site ayarları tipi ve varsayılan değerleri.
 */
export interface InstagramPost {
  imageUrl: string;
  link?: string;
}

export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    addressShort: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardCost: number;
    estimatedDays: string;
    carrierNote: string;
  };
  legal: {
    companyTitle: string;
    taxOffice: string;
    taxNumber: string;
    address: string;
    mersisNo: string;
  };
  /** Üst duyuru şeridi (mevsimsel kampanya vb.) */
  banner: {
    enabled: boolean;
    message: string;
    link: string;
  };
  /** Google Analytics & Meta Pixel */
  marketing: {
    googleAnalyticsId: string;
    metaPixelId: string;
  };
  seo: {
    defaultDescription: string;
    ogImageUrl: string;
  };
  home: {
    heroTitle: string;
    /** İtalik vurgulu kısım (hero başlığının alt satırı) */
    heroTitleEmphasis: string;
    heroSubtitle: string;
    aboutText: string;
    heroImageUrl: string;
    instagramTitle: string;
    instagramSubtitle: string;
    instagramPosts: InstagramPost[];
  };
}

export const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1100&q=80";

export const defaultSettings: SiteSettings = {
  brand: {
    name: "Noian Bags",
    tagline: "El emeğiyle, sevgiyle dikildi",
    description:
      "Annemin ellerinden çıkan, özenle dikilmiş el emeği kumaş çantalar. Sınırlı sayıda üretilen, küçük atölye ruhuyla hazırlanan parçalar.",
    logoUrl: "",
  },
  contact: {
    email: "merhaba@noianbags.com",
    phone: "+90 5XX XXX XX XX",
    whatsapp: "+90 5XX XXX XX XX",
    instagram: "https://instagram.com/noianbags",
    addressShort: "İstanbul, Türkiye",
  },
  shipping: {
    freeShippingThreshold: 1000,
    standardCost: 79,
    estimatedDays: "2–4 iş günü",
    carrierNote: "Siparişler [KARGO FİRMASI] ile gönderilir.",
  },
  legal: {
    companyTitle: "[ŞİRKET / SATICI UNVANI]",
    taxOffice: "[VERGİ DAİRESİ]",
    taxNumber: "[VERGİ / TC KİMLİK NO]",
    address: "[AÇIK ADRES]",
    mersisNo: "[MERSİS NO — varsa]",
  },
  banner: {
    enabled: false,
    message: "Yeni koleksiyonumuz yayında — sınırlı sayıda üretildi.",
    link: "/magaza",
  },
  marketing: {
    googleAnalyticsId: "",
    metaPixelId: "",
  },
  seo: {
    defaultDescription:
      "Noian Bags — annemin ellerinden çıkan, özenle dikilmiş el emeği kumaş çantalar. Sınırlı sayıda, sevgiyle üretildi.",
    ogImageUrl: "",
  },
  home: {
    heroTitle: "Annemin elinden çıkan",
    heroTitleEmphasis: "el emeği çantalar",
    heroSubtitle:
      "Noian Bags, sevgiyle ve sabırla dikilen, sınırlı sayıda üretilen kumaş çantaların evi. Her parçada bir hikâye, her dikişte bir emek var.",
    aboutText:
      "Noian Bags, annemin yıllardır kumaşlarla kurduğu sevgi bağının bir uzantısı. Her çanta, mutfak masasında başlayan, sabırla biten küçük bir yolculuk.",
    heroImageUrl: "",
    instagramTitle: "Atölyeden kareler",
    instagramSubtitle: "Dikiş masamızdan, günlük ilhamlarımızdan.",
    instagramPosts: [],
  },
};

/** Ayarları varsayılanlarla birleştirir. */
export function mergeSiteSettings(
  stored: Partial<SiteSettings> | null | undefined,
): SiteSettings {
  const s = stored ?? {};
  return {
    brand: { ...defaultSettings.brand, ...s.brand },
    contact: { ...defaultSettings.contact, ...s.contact },
    shipping: { ...defaultSettings.shipping, ...s.shipping },
    legal: { ...defaultSettings.legal, ...s.legal },
    banner: { ...defaultSettings.banner, ...s.banner },
    marketing: { ...defaultSettings.marketing, ...s.marketing },
    seo: { ...defaultSettings.seo, ...s.seo },
    home: {
      ...defaultSettings.home,
      ...s.home,
      instagramPosts: s.home?.instagramPosts ?? defaultSettings.home.instagramPosts,
    },
  };
}
