/**
 * ============================================================================
 *  API İSTEMCİSİ — SUNUCU + YEREL YEDEK
 * ============================================================================
 *  Tüm veri işlemleri buradan geçer.
 *  - Vercel'de Neon bağlıysa: gerçek /api uçlarını kullanır.
 *  - API'ye ulaşılamazsa (lokal geliştirme veya DB bağlı değilse): localStore
 *    yedeğine düşer; böylece site ve admin paneli her zaman çalışır.
 *
 *  "Sunucuya ulaşılamadı" durumu yalnızca ağ hatası (fetch fırlatması) ile
 *  belirlenir. Sunucu bir hata mesajı döndürürse (örn. 401, 400) bu hata
 *  kullanıcıya gösterilir; sessizce yedeğe düşülmez.
 * ============================================================================
 */
import { localStore } from "@/lib/localStore";
import type { Category, Order, Product, Testimonial } from "@/data/types";
import { mergeSiteSettings, type SiteSettings } from "@/data/settings";

const TOKEN_KEY = "noian_admin_token";

export const adminToken = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

class NetworkUnavailable extends Error {}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const t = adminToken.get();
    if (t) finalHeaders.Authorization = `Bearer ${t}`;
  }

  let res: Response;
  try {
    res = await fetch(path, { ...rest, headers: finalHeaders });
  } catch {
    // Ağ hatası → sunucu yok kabul edilir
    throw new NetworkUnavailable();
  }

  // /api dağıtılmamışsa Vercel HTML 404 döndürür (JSON değil) → yedeğe düş
  const contentType = res.headers.get("content-type") ?? "";
  if (res.status === 404 && !contentType.includes("application/json")) {
    throw new NetworkUnavailable();
  }

  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    const msg = (data && data.error) || `İstek başarısız (${res.status}).`;
    throw new Error(msg);
  }
  return data as T;
}

/** Sunucu denemesi başarısızsa (yalnızca ağ hatasında) yedek fonksiyonu çağırır. */
async function withFallback<T>(
  server: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  try {
    return await server();
  } catch (e) {
    if (e instanceof NetworkUnavailable) return await fallback();
    throw e;
  }
}

/* ============================ HERKESE AÇIK OKUMA ========================== */

export const api = {
  listProducts: (): Promise<Product[]> =>
    withFallback(
      () => request<Product[]>("/api/products"),
      () => localStore.listProducts(),
    ),

  getProductBySlug: (slug: string): Promise<Product | undefined> =>
    withFallback(
      () => request<Product>(`/api/products?slug=${encodeURIComponent(slug)}`),
      () => localStore.listProducts().find((p) => p.slug === slug),
    ),

  listCategories: (): Promise<Category[]> =>
    withFallback(
      () => request<Category[]>("/api/categories"),
      () => localStore.listCategories(),
    ),

  listTestimonials: (): Promise<Testimonial[]> =>
    withFallback(
      () => request<Testimonial[]>("/api/testimonials"),
      () => localStore.listTestimonials(),
    ),

  getSettings: (): Promise<SiteSettings> =>
    withFallback(
      async () => {
        const s = await request<Partial<SiteSettings>>("/api/settings");
        return mergeSiteSettings(s);
      },
      () => localStore.getSettings(),
    ),

  /* ============================ SİPARİŞ ============================ */

  createOrder: (order: Order): Promise<void> =>
    withFallback(
      async () => {
        await request("/api/orders", {
          method: "POST",
          body: JSON.stringify(order),
        });
        // Müşterinin kendi cihazında da görebilmesi için yerelde de tut
        localStore.saveOrder(order);
      },
      () => {
        localStore.saveOrder(order);
      },
    ),

  getOrderByNumber: (n: string): Promise<Order | undefined> =>
    withFallback(
      () => request<Order>(`/api/orders?number=${encodeURIComponent(n)}`),
      () => localStore.getOrderByNumber(n),
    ),

  listOrdersByEmail: (email: string): Promise<Order[]> =>
    withFallback(
      () => request<Order[]>(`/api/orders?email=${encodeURIComponent(email)}`),
      () => localStore.listOrders(email),
    ),

  /* ============================ ADMIN ============================ */

  adminLogin: async (
    password: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const { token } = await request<{ token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      adminToken.set(token);
      return { ok: true };
    } catch (e) {
      if (e instanceof NetworkUnavailable) {
        // Lokal yedek: varsayılan şifre "noian-admin"
        if (password === "noian-admin") {
          adminToken.set("local-admin");
          return { ok: true };
        }
        return { ok: false, error: "Şifre hatalı. (Lokal mod: noian-admin)" };
      }
      return { ok: false, error: (e as Error).message };
    }
  },

  adminLogout: () => adminToken.clear(),

  seedDatabase: (): Promise<{ ok: boolean; message: string }> =>
    request("/api/seed", { method: "POST", auth: true }),

  adminListOrders: (): Promise<Order[]> =>
    withFallback(
      () => request<Order[]>("/api/orders", { auth: true }),
      () => localStore.listOrders(),
    ),

  updateOrderStatus: (id: string, status: Order["status"]): Promise<void> =>
    withFallback(
      async () => {
        await request("/api/orders", {
          method: "PUT",
          auth: true,
          body: JSON.stringify({ id, status }),
        });
      },
      () => localStore.updateOrderStatus(id, status),
    ),

  saveProduct: (p: Product): Promise<Product> =>
    withFallback(
      () =>
        request<Product>("/api/products", {
          method: "PUT",
          auth: true,
          body: JSON.stringify(p),
        }),
      () => localStore.saveProduct(p),
    ),

  deleteProduct: (id: string): Promise<void> =>
    withFallback(
      async () => {
        await request(`/api/products?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          auth: true,
        });
      },
      () => localStore.deleteProduct(id),
    ),

  saveCategory: (c: Category): Promise<Category> =>
    withFallback(
      () =>
        request<Category>("/api/categories", {
          method: "PUT",
          auth: true,
          body: JSON.stringify(c),
        }),
      () => localStore.saveCategory(c),
    ),

  deleteCategory: (id: string): Promise<void> =>
    withFallback(
      async () => {
        await request(`/api/categories?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          auth: true,
        });
      },
      () => localStore.deleteCategory(id),
    ),

  saveTestimonial: (t: Testimonial): Promise<Testimonial> =>
    withFallback(
      () =>
        request<Testimonial>("/api/testimonials", {
          method: "PUT",
          auth: true,
          body: JSON.stringify(t),
        }),
      () => localStore.saveTestimonial(t),
    ),

  deleteTestimonial: (id: string): Promise<void> =>
    withFallback(
      async () => {
        await request(`/api/testimonials?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          auth: true,
        });
      },
      () => localStore.deleteTestimonial(id),
    ),

  saveSettings: (s: SiteSettings): Promise<SiteSettings> =>
    withFallback(
      () =>
        request<SiteSettings>("/api/settings", {
          method: "PUT",
          auth: true,
          body: JSON.stringify(s),
        }),
      () => localStore.saveSettings(s),
    ),

  /**
   * Görsel yükleme. Sunucu varsa Vercel Blob'a yükler ve kalıcı URL döner.
   * Sunucu yoksa görseli doğrudan data URL olarak döndürür (yerel mod).
   */
  uploadImage: (filename: string, dataUrl: string): Promise<string> =>
    withFallback(
      async () => {
        const { url } = await request<{ url: string }>("/api/upload", {
          method: "POST",
          auth: true,
          body: JSON.stringify({ filename, dataUrl }),
        });
        return url;
      },
      () => dataUrl,
    ),
};
