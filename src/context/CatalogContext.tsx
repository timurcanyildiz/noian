import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/data/types";

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(
  undefined,
);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        api.listProducts(),
        api.listCategories(),
      ]);
      setProducts(p);
      setCategories(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      categories,
      loading,
      refresh,
      getProductBySlug: (slug) => products.find((p) => p.slug === slug),
      getProductById: (id) => products.find((p) => p.id === id),
      getFeaturedProducts: () => products.filter((p) => p.isFeatured),
      getCategoryBySlug: (slug) => categories.find((c) => c.slug === slug),
      getCategoryById: (id) => categories.find((c) => c.id === id),
    }),
    [products, categories, loading, refresh],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx)
    throw new Error("useCatalog, CatalogProvider içinde kullanılmalıdır.");
  return ctx;
}
