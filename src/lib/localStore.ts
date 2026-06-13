/**
 * ============================================================================
 *  YEREL DEPO (localStorage) — API YOKKEN YEDEK KATMAN
 * ============================================================================
 *  Vercel'de Neon veritabanı bağlı değilken (veya lokal `npm run dev` sırasında)
 *  uygulama bu katmanı kullanır. Böylece site ve admin paneli her durumda
 *  çalışır. Veritabanı bağlanınca otomatik olarak gerçek API'ye geçilir.
 *
 *  İlk açılışta demo verilerle (src/data) doldurulur.
 * ============================================================================
 */
import { products as seedProducts } from "@/data/products";
import { categories as seedCategories } from "@/data/categories";
import { testimonials as seedTestimonials } from "@/data/testimonials";
import { defaultSettings, type SiteSettings } from "@/data/settings";
import type { Category, Order, Product, Testimonial } from "@/data/types";

const K = {
  products: "noian_store_products",
  categories: "noian_store_categories",
  testimonials: "noian_store_testimonials",
  settings: "noian_store_settings",
  orders: "noian_orders",
};

function read<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* yoksay */
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* yoksay */
  }
}

export const localStore = {
  // ---- Ürünler ----
  listProducts: (): Product[] => read(K.products, seedProducts),
  saveProduct: (p: Product): Product => {
    const list = read<Product[]>(K.products, seedProducts);
    const i = list.findIndex((x) => x.id === p.id);
    if (i >= 0) list[i] = p;
    else list.unshift(p);
    write(K.products, list);
    return p;
  },
  deleteProduct: (id: string) => {
    write(
      K.products,
      read<Product[]>(K.products, seedProducts).filter((p) => p.id !== id),
    );
  },

  // ---- Kategoriler ----
  listCategories: (): Category[] => read(K.categories, seedCategories),
  saveCategory: (c: Category): Category => {
    const list = read<Category[]>(K.categories, seedCategories);
    const i = list.findIndex((x) => x.id === c.id);
    if (i >= 0) list[i] = c;
    else list.push(c);
    write(K.categories, list);
    return c;
  },
  deleteCategory: (id: string) => {
    write(
      K.categories,
      read<Category[]>(K.categories, seedCategories).filter((c) => c.id !== id),
    );
  },

  // ---- Yorumlar ----
  listTestimonials: (): Testimonial[] => read(K.testimonials, seedTestimonials),
  saveTestimonial: (t: Testimonial): Testimonial => {
    const list = read<Testimonial[]>(K.testimonials, seedTestimonials);
    const i = list.findIndex((x) => x.id === t.id);
    if (i >= 0) list[i] = t;
    else list.push(t);
    write(K.testimonials, list);
    return t;
  },
  deleteTestimonial: (id: string) => {
    write(
      K.testimonials,
      read<Testimonial[]>(K.testimonials, seedTestimonials).filter(
        (t) => t.id !== id,
      ),
    );
  },

  // ---- Ayarlar ----
  getSettings: (): SiteSettings => read(K.settings, defaultSettings),
  saveSettings: (s: SiteSettings): SiteSettings => {
    write(K.settings, s);
    return s;
  },

  // ---- Siparişler ----
  listOrders: (email?: string): Order[] => {
    const all = read<Order[]>(K.orders, []);
    return email ? all.filter((o) => o.email === email) : all;
  },
  getOrderByNumber: (n: string): Order | undefined =>
    read<Order[]>(K.orders, []).find((o) => o.orderNumber === n),
  saveOrder: (o: Order): Order => {
    const all = read<Order[]>(K.orders, []);
    all.unshift(o);
    write(K.orders, all);
    return o;
  },
  updateOrderStatus: (id: string, status: Order["status"]) => {
    const all = read<Order[]>(K.orders, []);
    const i = all.findIndex((o) => o.id === id);
    if (i >= 0) {
      all[i] = { ...all[i], status };
      write(K.orders, all);
    }
  },
};
