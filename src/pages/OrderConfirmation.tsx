import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, Truck, Mail, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/data/types";
import { formatPrice } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

export function OrderConfirmation() {
  const [params] = useSearchParams();
  const { settings } = useSettings();
  const orderNumber = params.get("siparis") ?? "";
  const [order, setOrder] = useState<Order | undefined>();

  useEffect(() => {
    if (orderNumber) api.getOrderByNumber(orderNumber).then(setOrder);
  }, [orderNumber]);

  return (
    <div className="container animate-fade-in py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sage-200">
          <CheckCircle2 className="h-10 w-10 text-sage-400" />
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl">Teşekkür ederiz!</h1>
        <p className="mt-3 text-lg text-cocoa-400">
          Siparişiniz başarıyla alındı. Her çanta gibi siparişiniz de özenle
          hazırlanacak.
        </p>

        {orderNumber && (
          <p className="mt-4 inline-block rounded-full bg-cream-200 px-5 py-2 text-sm">
            Sipariş Numaranız:{" "}
            <strong className="text-cocoa-600">{orderNumber}</strong>
          </p>
        )}
      </div>

      {/* Adımlar */}
      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        <Step
          icon={Mail}
          title="Onay e-postası"
          text="Sipariş detaylarını e-posta ile alacaksınız."
        />
        <Step
          icon={Package}
          title="Hazırlık"
          text="Çantanız sevgiyle paketlenir."
        />
        <Step
          icon={Truck}
          title="Kargo"
          text={`Tahmini teslimat: ${settings.shipping.estimatedDays}`}
        />
      </div>

      {/* Sipariş özeti */}
      {order && (
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="card p-6">
            <h2 className="text-xl">Sipariş Özeti</h2>
            <ul className="mt-4 flex flex-col gap-2 border-b border-cream-200 pb-4 text-sm">
              {order.items.map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span className="text-cocoa-500">
                    {it.productName} × {it.quantity}
                  </span>
                  <span className="font-semibold text-cocoa-600">
                    {formatPrice(it.unitPrice * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-base">
              <span className="font-semibold text-cocoa-600">Toplam</span>
              <span className="font-bold text-cocoa-600">
                {formatPrice(order.total)}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-cream-200/60 p-4 text-sm text-cocoa-500">
              <p>
                <strong>Teslimat:</strong> {order.shippingAddress.fullName},{" "}
                {order.shippingAddress.addressLine},{" "}
                {order.shippingAddress.district}/{order.shippingAddress.city}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link to="/magaza" className="btn-primary">
          Alışverişe devam et <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="card flex flex-col items-center p-5 text-center">
      <Icon className="h-7 w-7 text-clay-400" />
      <h3 className="mt-3 font-serif text-lg text-cocoa-600">{title}</h3>
      <p className="mt-1 text-sm text-cocoa-400">{text}</p>
    </div>
  );
}
