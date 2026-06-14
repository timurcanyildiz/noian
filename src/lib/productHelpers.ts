import type { CartItem, Product, ProductSize } from "@/data/types";

export function hasSizes(product: Product): boolean {
  return (product.sizes?.length ?? 0) > 0;
}

export function getSize(
  product: Product,
  sizeId?: string,
): ProductSize | undefined {
  if (!sizeId || !product.sizes?.length) return undefined;
  return product.sizes.find((s) => s.id === sizeId);
}

export function getUnitPrice(product: Product, sizeId?: string): number {
  const size = getSize(product, sizeId);
  return size?.price ?? product.price;
}

export function getSizeLabel(product: Product, sizeId?: string): string | undefined {
  return getSize(product, sizeId)?.label;
}

export function isSizeInStock(product: Product, sizeId?: string): boolean {
  if (hasSizes(product)) {
    if (!sizeId) return false;
    const size = getSize(product, sizeId);
    return size ? size.inStock : false;
  }
  return product.inStock;
}

export function isProductAvailable(product: Product): boolean {
  if (hasSizes(product)) {
    return product.sizes!.some((s) => s.inStock);
  }
  return product.inStock;
}

export function getPriceLabel(product: Product): string {
  if (!hasSizes(product)) return "";
  const prices = product.sizes!.map((s) => s.price ?? product.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return "";
  return "den başlayan";
}

export function cartItemKey(item: Pick<CartItem, "productId" | "sizeId">): string {
  return `${item.productId}::${item.sizeId ?? ""}`;
}

export function matchCartItem(
  item: CartItem,
  productId: string,
  sizeId?: string,
): boolean {
  return item.productId === productId && (item.sizeId ?? "") === (sizeId ?? "");
}

const LOW_STOCK_THRESHOLD = 3;

/** Ürün veya seçili ölçüde son parça uyarısı gösterilsin mi? */
export function isLowStock(product: Product, sizeId?: string): boolean {
  if (hasSizes(product)) {
    if (sizeId) {
      const size = getSize(product, sizeId);
      if (!size?.inStock) return false;
      const count = size.stockCount ?? 0;
      return count > 0 && count <= LOW_STOCK_THRESHOLD;
    }
    return product.sizes!.some(
      (s) => s.inStock && (s.stockCount ?? 0) > 0 && (s.stockCount ?? 0) <= LOW_STOCK_THRESHOLD,
    );
  }
  const count = product.stockCount ?? 0;
  return product.inStock && count > 0 && count <= LOW_STOCK_THRESHOLD;
}

export function getLowStockLabel(product: Product, sizeId?: string): string | null {
  if (!isLowStock(product, sizeId)) return null;
  if (hasSizes(product) && sizeId) {
    const count = getSize(product, sizeId)?.stockCount;
    return count ? `Son ${count} adet` : "Son parçalar";
  }
  if (product.stockCount) return `Son ${product.stockCount} adet`;
  return "Son parçalar";
}
