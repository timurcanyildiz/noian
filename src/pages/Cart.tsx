import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart, cartItemKey } from "@/context/CartContext";
import { getPrimaryImage } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { QuantityStepper } from "@/components/common";
import { useSettings } from "@/context/SettingsContext";

export function Cart() {
  const { lines, subtotal, shippingCost, total, setQuantity, removeItem } =
    useCart();
  const { settings } = useSettings();

  if (lines.length === 0) {
    return (
      <div className="container py-20 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-cream-200 text-cocoa-400">
          <ShoppingBag className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl">Sepetiniz boş</h1>
        <p className="mt-2 text-cocoa-400">
          Beğendiğiniz çantaları sepetinize ekleyin, sizi bekliyor.
        </p>
        <Link to="/magaza" className="btn-primary mt-6">
          Alışverişe başla <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const remainingForFree =
    settings.shipping.freeShippingThreshold - subtotal;

  return (
    <div className="container animate-fade-in py-10 pb-28 lg:pb-10">
      <h1 className="text-3xl sm:text-4xl">Sepetim</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Kalemler */}
        <div className="lg:col-span-2">
          {remainingForFree > 0 && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-clay-50 px-4 py-3 text-sm text-clay-600">
              <Truck className="h-4 w-4 shrink-0" />
              <span>
                Ücretsiz kargoya{" "}
                <strong>{formatPrice(remainingForFree)}</strong> kaldı!
              </span>
            </div>
          )}

          <ul className="flex flex-col gap-4">
            {lines.map((line) => {
              const img = getPrimaryImage(line.product);
              return (
                <li
                  key={cartItemKey(line)}
                  className="card flex gap-4 p-4"
                >
                  <Link
                    to={`/urun/${line.product.slug}`}
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-200"
                  >
                    <img
                      src={img?.url}
                      alt={img?.alt ?? line.product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/urun/${line.product.slug}`}
                        className="font-serif text-lg text-cocoa-600 hover:text-clay-400"
                      >
                        {line.product.name}
                      </Link>
                      <button
                        onClick={() =>
                          removeItem(line.productId, line.sizeId)
                        }
                        className="grid h-8 w-8 place-items-center rounded-full text-cocoa-400 hover:bg-cream-200 hover:text-clay-500"
                        aria-label="Ürünü kaldır"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-cocoa-400">
                      {line.sizeLabel && (
                        <span className="mr-2 rounded-full bg-cream-200 px-2 py-0.5 text-xs font-semibold text-cocoa-600">
                          {line.sizeLabel}
                        </span>
                      )}
                      {formatPrice(line.unitPrice)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        value={line.quantity}
                        onChange={(v) =>
                          setQuantity(line.productId, v, line.sizeId)
                        }
                      />
                      <span className="font-semibold text-cocoa-600">
                        {formatPrice(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            to="/magaza"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-clay-400 hover:text-clay-500"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Alışverişe devam et
          </Link>
        </div>

        {/* Özet */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-20 p-6">
            <h2 className="text-xl">Sipariş Özeti</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-cocoa-400">Ara toplam</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cocoa-400">Kargo</dt>
                <dd className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-sage-400">Ücretsiz</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-cream-200 pt-3 text-base">
                <dt className="font-semibold text-cocoa-600">Toplam</dt>
                <dd className="font-bold text-cocoa-600">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <Link to="/odeme" className="btn-primary mt-6 hidden w-full lg:flex">
              Ödemeye Geç <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 hidden text-center text-xs text-cocoa-400 lg:block">
              Üye olmadan da sipariş verebilirsiniz.
            </p>
          </div>
        </aside>
      </div>

      {/* MOBİL sabit alt çubuk */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-cream-50/95 px-4 py-3 pb-safe backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="leading-tight">
            <p className="text-xs text-cocoa-400">Toplam</p>
            <p className="text-lg font-bold text-cocoa-600">
              {formatPrice(total)}
            </p>
          </div>
          <Link to="/odeme" className="btn-primary flex-1">
            Ödemeye Geç <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
