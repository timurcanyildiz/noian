import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, User as UserIcon, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@/data/types";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<Order["status"], string> = {
  beklemede: "Ödeme bekleniyor",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim edildi",
  iptal: "İptal edildi",
};

export function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.email) api.listOrdersByEmail(user.email).then(setOrders);
  }, [user?.email]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/giris" replace />;
  }

  return (
    <div className="container animate-fade-in py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Hesabım</h1>
          <p className="mt-1 text-cocoa-400">Hoş geldiniz, {user.fullName}.</p>
        </div>
        <button onClick={logout} className="btn-outline">
          <LogOut className="h-4 w-4" /> Çıkış Yap
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Profil */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <UserIcon className="h-5 w-5 text-clay-400" /> Profil Bilgileri
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Info label="Ad Soyad" value={user.fullName} />
            <Info label="E-posta" value={user.email} />
            <Info label="Telefon" value={user.phone || "—"} />
            <Info label="Üyelik" value={formatDate(user.createdAt)} />
          </dl>
          <button className="btn-ghost mt-4 w-full" disabled>
            Bilgileri Düzenle
          </button>
          <p className="mt-2 text-center text-xs text-cocoa-400">
            (Profil düzenleme yakında — backend bağlandığında aktif olur)
          </p>
        </section>

        {/* Adresler */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-clay-400" /> Adreslerim
          </h2>
          <div className="mt-4 rounded-xl border border-dashed border-cream-300 p-6 text-center text-sm text-cocoa-400">
            Henüz kayıtlı adresiniz yok.
            <br />
            İlk siparişinizde adresiniz buraya kaydedilecek.
          </div>
        </section>

        {/* Hızlı bağlantılar */}
        <section className="card p-6">
          <h2 className="text-xl">Hızlı Erişim</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/magaza" className="btn-outline w-full">
              Alışverişe devam et
            </Link>
            <Link to="/sepet" className="btn-ghost w-full">
              Sepetim
            </Link>
            <Link to="/iletisim" className="btn-ghost w-full">
              Destek / İletişim
            </Link>
          </div>
        </section>
      </div>

      {/* Sipariş geçmişi */}
      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-2xl">
          <Package className="h-6 w-6 text-clay-400" /> Sipariş Geçmişi
        </h2>

        {orders.length === 0 ? (
          <div className="card mt-4 p-10 text-center text-cocoa-400">
            <Package className="mx-auto h-10 w-10 text-cream-300" />
            <p className="mt-3">Henüz bir siparişiniz bulunmuyor.</p>
            <Link to="/magaza" className="btn-primary mt-5">
              İlk siparişinizi verin
            </Link>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {orders.map((o) => (
              <article key={o.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-cocoa-600">
                      Sipariş #{o.orderNumber}
                    </p>
                    <p className="text-sm text-cocoa-400">
                      {formatDate(o.createdAt)} · {o.items.length} ürün
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge bg-clay-50 text-clay-500">
                      {STATUS_LABEL[o.status]}
                    </span>
                    <span className="font-bold text-cocoa-600">
                      {formatPrice(o.total)}
                    </span>
                  </div>
                </div>
                <ul className="mt-3 border-t border-cream-200 pt-3 text-sm text-cocoa-500">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex justify-between py-0.5">
                      <span>
                        {it.productName} × {it.quantity}
                      </span>
                      <span>{formatPrice(it.unitPrice * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cocoa-400">{label}</dt>
      <dd className="text-right font-semibold text-cocoa-600">{value}</dd>
    </div>
  );
}
