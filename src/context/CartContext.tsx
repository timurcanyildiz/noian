/**
 * ============================================================================
 *  SEPET (CART) — KALICI (localStorage) DEMO SEPET
 * ============================================================================
 *  Sepet, tarayıcı kapansa bile korunur (localStorage). Misafir kullanıcılar
 *  da sepet kullanabilir (guest checkout dostu).
 *
 *  Gerçek backend'de: Girişli kullanıcılar için sepet `cart_items` tablosunda
 *  da saklanabilir. Bu mantık yine yalnızca bu dosyada değişir.
 * ============================================================================
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartLine, Product } from "@/data/types";
import { useCatalog } from "@/context/CatalogContext";
import { useSettings } from "@/context/SettingsContext";

const STORAGE_CART = "noian_cart";

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  isFreeShipping: boolean;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog();
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CART);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* yoksay */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART, JSON.stringify(items));
    } catch {
      /* yoksay */
    }
  }, [items]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    },
    [removeItem],
  );

  const clear = useCallback(() => setItems([]), []);

  const lines = useMemo<CartLine[]>(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId) as Product;
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean) as CartLine[];
  }, [items, products]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines],
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const threshold = settings.shipping.freeShippingThreshold;
  const isFreeShipping = subtotal >= threshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : settings.shipping.standardCost;
  const total = subtotal + shippingCost;

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      count,
      subtotal,
      shippingCost,
      total,
      isFreeShipping: subtotal >= threshold,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [
      items,
      lines,
      count,
      subtotal,
      shippingCost,
      total,
      threshold,
      addItem,
      removeItem,
      setQuantity,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  return ctx;
}
