/**
 * ============================================================================
 *  SEPET (CART) — KALICI (localStorage)
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
import {
  cartItemKey,
  getSizeLabel,
  getUnitPrice,
  matchCartItem,
} from "@/lib/productHelpers";

const STORAGE_CART = "noian_cart";

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  isFreeShipping: boolean;
  addItem: (productId: string, quantity?: number, sizeId?: string) => void;
  removeItem: (productId: string, sizeId?: string) => void;
  setQuantity: (productId: string, quantity: number, sizeId?: string) => void;
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

  const addItem = useCallback(
    (productId: string, quantity = 1, sizeId?: string) => {
      setItems((prev) => {
        const existing = prev.find((i) => matchCartItem(i, productId, sizeId));
        if (existing) {
          return prev.map((i) =>
            matchCartItem(i, productId, sizeId)
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { productId, sizeId, quantity }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string, sizeId?: string) => {
    setItems((prev) =>
      prev.filter((i) => !matchCartItem(i, productId, sizeId)),
    );
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number, sizeId?: string) => {
      if (quantity <= 0) {
        removeItem(productId, sizeId);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          matchCartItem(i, productId, sizeId) ? { ...i, quantity } : i,
        ),
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
        const unitPrice = getUnitPrice(product, item.sizeId);
        return {
          ...item,
          product,
          sizeLabel: getSizeLabel(product, item.sizeId),
          unitPrice,
          lineTotal: unitPrice * item.quantity,
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

// eslint-disable-next-line react-refresh/only-export-components
export { cartItemKey };
