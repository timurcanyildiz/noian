/**
 * Site ayarları tipi ve varsayılan değerleri.
 * Bu değerler admin panelinden düzenlenebilir ve veritabanında (settings tablosu)
 * saklanır. Veritabanı yokken bu varsayılanlar kullanılır.
 */
export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logoUrl: string; // boşsa "N" harfli varsayılan logo gösterilir
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
  home: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
  };
}

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
  home: {
    heroTitle: "Annemin elinden çıkan el emeği çantalar",
    heroSubtitle:
      "Noian Bags, sevgiyle ve sabırla dikilen, sınırlı sayıda üretilen kumaş çantaların evi. Her parçada bir hikâye, her dikişte bir emek var.",
    aboutText:
      "Noian Bags, annemin yıllardır kumaşlarla kurduğu sevgi bağının bir uzantısı. Her çanta, mutfak masasında başlayan, sabırla biten küçük bir yolculuk.",
  },
};
