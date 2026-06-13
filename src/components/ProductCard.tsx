import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/types";
import { getPrimaryImage } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { notify } = useToast();
  const image = getPrimaryImage(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product.id);
    notify(`${product.name} sepete eklendi.`);
  };

  return (
    <Link
      to={`/urun/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 shadow-card transition-shadow hover:shadow-soft"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        <img
          src={image?.url}
          alt={image?.alt ?? product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge bg-sage-300/90 text-cocoa-700">Yeni</span>
          )}
          {product.compareAtPrice && (
            <span className="badge bg-clay-400 text-cream-50">İndirim</span>
          )}
          {!product.inStock && (
            <span className="badge bg-cocoa-500/85 text-cream-50">Tükendi</span>
          )}
        </div>

        {/* Masaüstünde hover ile beliren hızlı sepet butonu */}
        {product.inStock && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 hidden h-11 w-11 place-items-center rounded-full bg-clay-400 text-cream-50 shadow-soft transition-all hover:bg-clay-500 group-hover:grid sm:group-hover:grid"
            aria-label={`${product.name} ürününü sepete ekle`}
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg leading-snug text-cocoa-600">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-cocoa-400">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-cocoa-600">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-cocoa-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
