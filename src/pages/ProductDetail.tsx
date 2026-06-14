import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ShoppingBag,
  Truck,
  RefreshCw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { QuantityStepper, Spinner } from "@/components/common";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useCatalog } from "@/context/CatalogContext";
import { useSettings } from "@/context/SettingsContext";
import {
  getLowStockLabel,
  getSize,
  getUnitPrice,
  hasSizes,
  isLowStock,
  isProductAvailable,
  isSizeInStock,
} from "@/lib/productHelpers";
import { SeoHead } from "@/components/SeoHead";
import { whatsappLink, whatsappProductMessage } from "@/lib/whatsapp";
import { getPrimaryImage } from "@/data/products";
import { MessageCircle } from "lucide-react";

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, getProductBySlug, getCategoryById, loading } = useCatalog();
  const { settings } = useSettings();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { addItem } = useCart();
  const { notify } = useToast();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState<string>("");

  useEffect(() => {
    if (!product) return;
    if (hasSizes(product)) {
      const firstAvailable =
        product.sizes!.find((s) => s.inStock)?.id ?? product.sizes![0]?.id ?? "";
      setSelectedSizeId(firstAvailable);
    } else {
      setSelectedSizeId("");
    }
    setQty(1);
    setActiveImg(0);
  }, [product?.id]);

  if (loading) {
    return <Spinner label="Ürün yükleniyor…" />;
  }

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl">Ürün bulunamadı</h1>
        <p className="mt-2 text-cocoa-400">
          Aradığınız ürün kaldırılmış olabilir.
        </p>
        <Link to="/magaza" className="btn-primary mt-6">
          Mağazaya dön
        </Link>
      </div>
    );
  }

  const category = getCategoryById(product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const multiSize = hasSizes(product);
  const selectedSize = getSize(product, selectedSizeId);
  const displayPrice = getUnitPrice(product, selectedSizeId || undefined);
  const canAdd = multiSize
    ? isSizeInStock(product, selectedSizeId)
    : product.inStock;
  const anyAvailable = isProductAvailable(product);

  const handleAdd = () => {
    if (multiSize && !selectedSizeId) {
      notify("Lütfen bir ölçü seçin.", "info");
      return;
    }
    addItem(product.id, qty, selectedSizeId || undefined);
    const sizeNote = selectedSize ? ` (${selectedSize.label})` : "";
    notify(`${product.name}${sizeNote} — ${qty} adet sepete eklendi.`);
  };

  const handleBuyNow = () => {
    if (multiSize && !selectedSizeId) {
      notify("Lütfen bir ölçü seçin.", "info");
      return;
    }
    addItem(product.id, qty, selectedSizeId || undefined);
    navigate("/sepet");
  };

  return (
    <div className="animate-fade-in pb-24 lg:pb-0">
      <SeoHead
        title={product.name}
        description={product.shortDescription || product.description}
        image={getPrimaryImage(product)?.url}
        path={`/urun/${product.slug}`}
        product={product}
      />
      <div className="container py-6">
        <nav className="flex items-center gap-1 text-sm text-cocoa-400">
          <Link to="/magaza" className="flex items-center gap-1 hover:text-clay-400">
            <ChevronLeft className="h-4 w-4" /> Mağaza
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link
                to={`/magaza?kategori=${category.slug}`}
                className="hover:text-clay-400"
              >
                {category.name}
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="container grid gap-10 pb-12 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200 shadow-card">
            <img
              src={product.images[activeImg]?.url}
              alt={product.images[activeImg]?.alt ?? product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-xl border-2",
                    i === activeImg ? "border-clay-400" : "border-cream-200",
                  )}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            {product.isNew && (
              <span className="badge bg-sage-300/90 text-cocoa-700">Yeni</span>
            )}
            {category && (
              <span className="text-sm text-cocoa-400">{category.name}</span>
            )}
          </div>

          <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-cocoa-600">
              {formatPrice(displayPrice)}
            </span>
            {product.compareAtPrice && !multiSize && (
              <span className="text-lg text-cocoa-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-cocoa-400">KDV dahil fiyattır.</p>

          <p className="mt-5 leading-relaxed text-cocoa-500">
            {product.description}
          </p>

          {multiSize && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-cocoa-600">Ölçü seçin</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes!.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    disabled={!size.inStock}
                    onClick={() => setSelectedSizeId(size.id)}
                    className={cn(
                      "rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
                      selectedSizeId === size.id
                        ? "border-clay-400 bg-clay-50 text-clay-500"
                        : "border-cream-300 bg-cream-50 text-cocoa-600 hover:border-clay-300",
                      !size.inStock && "cursor-not-allowed opacity-45 line-through",
                    )}
                  >
                    {size.label}
                    {size.dimensions && (
                      <span className="ml-1 font-normal text-cocoa-400">
                        · {size.dimensions}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedSize?.dimensions && (
                <p className="mt-2 text-sm text-cocoa-400">
                  Seçilen ölçü: <strong>{selectedSize.dimensions}</strong>
                </p>
              )}
            </div>
          )}

          <div className="mt-5">
            {canAdd ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-400">
                <Check className="h-4 w-4" /> Stokta var
                {isLowStock(product, selectedSizeId || undefined) && (
                  <span className="rounded-full bg-clay-100 px-2 py-0.5 text-xs font-bold text-clay-500">
                    {getLowStockLabel(product, selectedSizeId || undefined)}
                  </span>
                )}
                {!isLowStock(product, selectedSizeId || undefined) &&
                  selectedSize?.stockCount &&
                  selectedSize.stockCount <= 5 && (
                  <span className="text-clay-400">
                    {" "}
                    · Son {selectedSize.stockCount} adet
                  </span>
                )}
                {!multiSize && product.stockCount && product.stockCount <= 5 && (
                  <span className="text-clay-400">
                    {" "}
                    · Son {product.stockCount} adet
                  </span>
                )}
              </span>
            ) : anyAvailable ? (
              <span className="text-sm font-semibold text-clay-500">
                Bu ölçü şu an tükendi
              </span>
            ) : (
              <span className="text-sm font-semibold text-clay-500">
                Şu an tükendi — yakında yeniden üretilecek
              </span>
            )}
          </div>

          <div className="mt-6 hidden flex-wrap items-center gap-3 lg:flex">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="btn-primary flex-1"
            >
              <ShoppingBag className="h-4 w-4" /> Sepete Ekle
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!canAdd}
              className="btn-outline"
            >
              Hemen Al
            </button>
            {settings.contact.whatsapp && (
              <a
                href={whatsappLink(
                  settings.contact.whatsapp,
                  whatsappProductMessage(product.name),
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-outline border-sage-300 text-sage-400 hover:bg-sage-200/40"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp ile Sor
              </a>
            )}
          </div>

          <dl className="mt-8 divide-y divide-cream-200 border-y border-cream-200 text-sm">
            {product.materials.length > 0 && (
              <Row label="Malzeme" value={product.materials.join(", ")} />
            )}
            {!multiSize && product.dimensions && (
              <Row label="Ölçüler" value={product.dimensions} />
            )}
            {product.careInstructions && (
              <Row label="Bakım" value={product.careInstructions} />
            )}
          </dl>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Trust
              icon={Truck}
              title="Hızlı kargo"
              text={settings.shipping.estimatedDays}
            />
            <Trust icon={RefreshCw} title="Kolay iade" text="14 gün içinde" />
            <Trust icon={ShieldCheck} title="Güvenli ödeme" text="SSL korumalı" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container py-12">
          <h2 className="mb-6 text-2xl">Bunları da sevebilirsiniz</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-cream-50/95 px-4 py-3 pb-safe backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <QuantityStepper value={qty} onChange={setQty} />
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="btn-primary flex-1"
          >
            <ShoppingBag className="h-4 w-4" />
            {canAdd ? "Sepete Ekle" : "Tükendi"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3">
      <dt className="w-28 shrink-0 font-semibold text-cocoa-600">{label}</dt>
      <dd className="text-cocoa-500">{value}</dd>
    </div>
  );
}

function Trust({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-cream-200/60 px-3 py-2.5">
      <Icon className="h-5 w-5 shrink-0 text-clay-400" />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-cocoa-600">{title}</p>
        <p className="text-xs text-cocoa-400">{text}</p>
      </div>
    </div>
  );
}
