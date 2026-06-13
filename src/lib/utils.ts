import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Türk Lirası biçimlendirme: 1290 -> "1.290,00 ₺" */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value);
}

/** Tarih biçimlendirme: ISO -> "13 Haziran 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Türkçe karakterleri URL-dostu sluga çevirir: "El Çantası" -> "el-cantasi" */
export function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .trim()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Benzersiz kısa kimlik üretir (demo/yeni kayıtlar için). */
export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** Basit sipariş numarası üretici (demo). */
export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NB${y}-${rand}`;
}
