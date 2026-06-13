import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Database,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/data/types";

export function Dashboard() {
  const { products, categories, refresh } = useCatalog();
  const [orders, setOrders] = useState<Order[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  useEffect(() => {
    api.adminListOrders().then(setOrders);
  }, []);

  const revenue = orders
    .filter((o) => o.paymentStatus === "odendi")
    .reduce((s, o) => s + o.total, 0);

  const runSeed = async () => {
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await api.seedDatabase();
      setSeedMsg({ ok: true, text: res.message });
      await refresh();
    } catch (e) {
      setSeedMsg({
        ok: false,
        text:
          (e as Error).message ||
          "Veritabanı kurulamadı. Neon (DATABASE_URL) bağlı mı kontrol edin.",
      });
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { icon: Package, label: "Ürün", value: products.length, to: "/admin/urunler" },
    { icon: ShoppingCart, label: "Sipariş", value: orders.length, to: "/admin/siparisler" },
    { icon: Database, label: "Kategori", value: categories.length, to: "/admin/kategoriler" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl">Hoş geldiniz 👋</h1>
      <p className="mt-1 text-cocoa-400">
        Mağazanızı buradan yönetebilirsiniz.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card p-5 hover:shadow-soft">
            <s.icon className="h-6 w-6 text-clay-400" />
            <p className="mt-3 text-3xl font-bold text-cocoa-600">{s.value}</p>
            <p className="text-sm text-cocoa-400">{s.label}</p>
          </Link>
        ))}
        <div className="card p-5">
          <span className="font-serif text-2xl text-clay-400">₺</span>
          <p className="mt-3 text-2xl font-bold text-cocoa-600">
            {formatPrice(revenue)}
          </p>
          <p className="text-sm text-cocoa-400">Tahsil edilen (ödendi)</p>
        </div>
      </div>

      {/* Veritabanı kurulumu */}
      <section className="card mt-6 p-6">
        <div className="flex items-start gap-3">
          <Database className="mt-1 h-6 w-6 shrink-0 text-clay-400" />
          <div className="flex-1">
            <h2 className="text-xl">Veritabanı Kurulumu</h2>
            <p className="mt-1 text-sm text-cocoa-400">
              Vercel'de Neon veritabanını bağladıktan sonra bu düğmeye basın.
              Tablolar oluşturulur ve mağaza demo ürünlerle doldurulur. (Zaten
              kurulmuşsa mevcut verilerinize dokunmaz.)
            </p>
            <button
              onClick={runSeed}
              disabled={seeding}
              className="btn-primary mt-4"
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Veritabanını Kur / Demo Verileri Yükle
            </button>

            {seedMsg && (
              <div
                className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
                  seedMsg.ok
                    ? "bg-sage-200/60 text-cocoa-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {seedMsg.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{seedMsg.text}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hızlı bağlantılar */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/urunler" className="card flex items-center justify-between p-5 hover:shadow-soft">
          <span className="font-semibold text-cocoa-600">Yeni ürün ekle</span>
          <ArrowRight className="h-5 w-5 text-clay-400" />
        </Link>
        <Link to="/admin/ayarlar" className="card flex items-center justify-between p-5 hover:shadow-soft">
          <span className="font-semibold text-cocoa-600">
            Logo & site ayarları
          </span>
          <ArrowRight className="h-5 w-5 text-clay-400" />
        </Link>
      </div>
    </div>
  );
}
