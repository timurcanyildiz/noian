/**
 * Veritabanı şeması ve satır <-> nesne dönüşümleri.
 * Şema, src/data/types.ts içindeki veri modeliyle eşleşir.
 * Görseller pratiklik için ürün satırında JSONB olarak tutulur.
 */
import { getSql } from "./db.js";

export async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id text PRIMARY KEY,
      slug text UNIQUE NOT NULL,
      name text NOT NULL,
      description text
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id text PRIMARY KEY,
      slug text UNIQUE NOT NULL,
      name text NOT NULL,
      short_description text DEFAULT '',
      description text DEFAULT '',
      price numeric NOT NULL DEFAULT 0,
      compare_at_price numeric,
      category_id text,
      images jsonb NOT NULL DEFAULT '[]'::jsonb,
      materials jsonb NOT NULL DEFAULT '[]'::jsonb,
      dimensions text,
      in_stock boolean NOT NULL DEFAULT true,
      stock_count integer,
      is_featured boolean DEFAULT false,
      is_new boolean DEFAULT false,
      care_instructions text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY,
      order_number text UNIQUE NOT NULL,
      user_id text,
      email text NOT NULL,
      items jsonb NOT NULL DEFAULT '[]'::jsonb,
      shipping_address jsonb NOT NULL,
      subtotal numeric NOT NULL DEFAULT 0,
      shipping_cost numeric NOT NULL DEFAULT 0,
      total numeric NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'beklemede',
      payment_method text NOT NULL DEFAULT 'shopier',
      payment_status text NOT NULL DEFAULT 'beklemede',
      note text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id text PRIMARY KEY,
      author_name text NOT NULL,
      location text,
      rating integer NOT NULL DEFAULT 5,
      text text NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id integer PRIMARY KEY DEFAULT 1,
      data jsonb NOT NULL DEFAULT '{}'::jsonb
    );
  `;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function rowToProduct(r: any) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortDescription: r.short_description ?? "",
    description: r.description ?? "",
    price: Number(r.price),
    compareAtPrice: r.compare_at_price != null ? Number(r.compare_at_price) : undefined,
    categoryId: r.category_id,
    images: r.images ?? [],
    materials: r.materials ?? [],
    dimensions: r.dimensions ?? undefined,
    inStock: r.in_stock,
    stockCount: r.stock_count ?? undefined,
    isFeatured: r.is_featured ?? false,
    isNew: r.is_new ?? false,
    careInstructions: r.care_instructions ?? undefined,
    createdAt:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : String(r.created_at),
  };
}

export function rowToCategory(r: any) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? undefined,
  };
}

export function rowToOrder(r: any) {
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id ?? undefined,
    email: r.email,
    items: r.items ?? [],
    shippingAddress: r.shipping_address,
    subtotal: Number(r.subtotal),
    shippingCost: Number(r.shipping_cost),
    total: Number(r.total),
    status: r.status,
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    note: r.note ?? undefined,
    createdAt:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : String(r.created_at),
  };
}

export function rowToTestimonial(r: any) {
  return {
    id: r.id,
    authorName: r.author_name,
    location: r.location ?? undefined,
    rating: r.rating,
    text: r.text,
  };
}

/** Varsayılan site ayarları (logo, marka, iletişim, kargo). */
export const defaultSettings = {
  brand: {
    name: "Noian Bags",
    tagline: "El emeğiyle, sevgiyle dikildi",
    description:
      "Annemin ellerinden çıkan, özenle dikilmiş el emeği kumaş çantalar. Sınırlı sayıda üretilen, küçük atölye ruhuyla hazırlanan parçalar.",
    logoUrl: "", // boşsa "N" harfli varsayılan logo gösterilir
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
      "Noian Bags, sevgiyle ve sabırla dikilen, sınırlı sayıda üretilen kumaş çantaların evi.",
    aboutText:
      "Noian Bags, annemin yıllardır kumaşlarla kurduğu sevgi bağının bir uzantısı. Her çanta, mutfak masasında başlayan, sabırla biten küçük bir yolculuk.",
    heroImageUrl: "",
  },
};
