import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/data/types";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "beklemede", label: "Ödeme bekleniyor" },
  { value: "hazirlaniyor", label: "Hazırlanıyor" },
  { value: "kargoda", label: "Kargoda" },
  { value: "teslim_edildi", label: "Teslim edildi" },
  { value: "iptal", label: "İptal" },
];

export function OrdersAdmin() {
  const { notify } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    api.adminListOrders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const changeStatus = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    notify("Sipariş durumu güncellendi.");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl">Siparişler</h1>
      <p className="mt-1 text-cocoa-400">{orders.length} sipariş</p>

      {loading ? (
        <p className="mt-8 text-center text-cocoa-400">Yükleniyor…</p>
      ) : orders.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-cocoa-400">
          <Package className="mx-auto h-10 w-10 text-cream-300" />
          <p className="mt-3">Henüz sipariş yok.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <button
                    onClick={() => setOpen(open === o.id ? null : o.id)}
                    className="font-semibold text-cocoa-600 hover:text-clay-400"
                  >
                    #{o.orderNumber}
                  </button>
                  <p className="text-sm text-cocoa-400">
                    {formatDate(o.createdAt)} · {o.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {o.paymentStatus === "test" && (
                    <span className="badge bg-cream-200 text-cocoa-500">
                      Test
                    </span>
                  )}
                  <span className="font-bold text-cocoa-600">
                    {formatPrice(o.total)}
                  </span>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      changeStatus(o.id, e.target.value as OrderStatus)
                    }
                    className="rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {open === o.id && (
                <div className="mt-4 grid gap-4 border-t border-cream-200 pt-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-cocoa-600">
                      Ürünler
                    </h4>
                    <ul className="space-y-1 text-sm text-cocoa-500">
                      {o.items.map((it) => (
                        <li key={it.id} className="flex justify-between">
                          <span>
                            {it.productName}
                            {it.sizeLabel && (
                              <span className="text-cocoa-400">
                                {" "}
                                ({it.sizeLabel})
                              </span>
                            )}{" "}
                            × {it.quantity}
                          </span>
                          <span>{formatPrice(it.unitPrice * it.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-cocoa-600">
                      Teslimat
                    </h4>
                    <p className="text-sm text-cocoa-500">
                      {o.shippingAddress.fullName}
                      <br />
                      {o.shippingAddress.phone}
                      <br />
                      {o.shippingAddress.addressLine}
                      <br />
                      {o.shippingAddress.district}/{o.shippingAddress.city}
                    </p>
                    {o.note && (
                      <p className="mt-2 text-sm text-cocoa-400">
                        Not: {o.note}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
