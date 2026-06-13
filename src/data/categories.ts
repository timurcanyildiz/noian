import type { Category } from "./types";

/**
 * DEMO KATEGORİLER
 * OWNER: Kategori adlarını ve açıklamalarını dilediğiniz gibi düzenleyebilirsiniz.
 * Yeni kategori eklemek için bu listeye yeni bir nesne ekleyin.
 */
export const categories: Category[] = [
  {
    id: "cat-omuz",
    slug: "omuz-cantalari",
    name: "Omuz Çantaları",
    description: "Günlük kullanım için hafif ve şık omuz çantaları.",
  },
  {
    id: "cat-el",
    slug: "el-cantalari",
    name: "El Çantaları",
    description: "Özel günler ve davetler için zarif el çantaları.",
  },
  {
    id: "cat-bez",
    slug: "bez-cantalar",
    name: "Bez & Tote Çantalar",
    description: "Doğa dostu, geniş ve dayanıklı günlük bez çantalar.",
  },
  {
    id: "cat-makyaj",
    slug: "makyaj-cuzdan",
    name: "Makyaj & Cüzdan",
    description: "Küçük ama özenli detaylar: makyaj çantaları ve cüzdanlar.",
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id);
