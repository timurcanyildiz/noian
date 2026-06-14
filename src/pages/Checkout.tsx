import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  Phone,
  Receipt,
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useCart, cartItemKey } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FormField, validators } from "@/components/FormField";
import { formatPrice, generateOrderNumber, cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { startPayment, isLivePayment } from "@/lib/payment";
import { useSettings } from "@/context/SettingsContext";
import type { Address, Order, OrderItem, PaymentMethod } from "@/data/types";

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  desc: string;
}[] = [
  {
    id: "shopier",
    label: "Kredi / Banka Kartı (Shopier)",
    desc: "Güvenli ödeme sayfasına yönlendirilirsiniz.",
  },
  {
    id: "havale",
    label: "Havale / EFT",
    desc: "Sipariş sonrası IBAN bilgileri paylaşılır.",
  },
];

export function Checkout() {
  const { lines, subtotal, shippingCost, total, clear } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    city: "",
    district: "",
    addressLine: "",
    postalCode: "",
    note: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("shopier");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  if (lines.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl">Sepetiniz boş</h1>
        <p className="mt-2 text-cocoa-400">
          Ödeme yapmadan önce sepetinize ürün ekleyin.
        </p>
        <Link to="/magaza" className="btn-primary mt-6">
          Mağazaya git
        </Link>
      </div>
    );
  }

  const validate = () => {
    const n: Record<string, string> = {};
    n.fullName = validators.required(form.fullName) ?? "";
    n.email = validators.email(form.email) ?? "";
    n.phone = validators.phone(form.phone) || (validators.required(form.phone) ?? "");
    n.city = validators.required(form.city) ?? "";
    n.district = validators.required(form.district) ?? "";
    n.addressLine = validators.minLen(10)(form.addressLine) ?? "";
    return Object.fromEntries(Object.entries(n).filter(([, v]) => v));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = validate();
    setErrors(cleaned);
    if (Object.keys(cleaned).length) {
      document
        .querySelector(".is-invalid")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      userId: user?.id,
      fullName: form.fullName,
      phone: form.phone,
      city: form.city,
      district: form.district,
      addressLine: form.addressLine,
      postalCode: form.postalCode,
    };

    const items: OrderItem[] = lines.map((l, i) => ({
      id: `oi-${Date.now()}-${i}`,
      orderId: "",
      productId: l.product.id,
      productName: l.product.name,
      sizeLabel: l.sizeLabel,
      unitPrice: l.unitPrice,
      quantity: l.quantity,
    }));

    const orderNumber = generateOrderNumber();
    const order: Order = {
      id: `o-${Date.now()}`,
      orderNumber,
      userId: user?.id,
      email: form.email,
      items: items.map((it) => ({ ...it, orderId: `o-${Date.now()}` })),
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      status: "beklemede",
      paymentMethod: payment,
      paymentStatus: isLivePayment() ? "beklemede" : "test",
      note: form.note,
      createdAt: new Date().toISOString(),
    };

    // Sipariş kaydedilir (sunucu varsa Neon'a, yoksa yerel yedeğe).
    await api.createOrder(order);

    // Ödeme başlat (demo modda gerçek tahsilat yapılmaz)
    const result = await startPayment(order);
    setSubmitting(false);

    if (result.status === "redirect") {
      window.location.href = result.url; // Gerçek Shopier yönlendirmesi
      return;
    }

    // Demo / havale akışı: teşekkür sayfasına git
    clear();
    navigate(`/tesekkurler?siparis=${orderNumber}`);
  };

  return (
    <div className="container animate-fade-in py-10 pb-28 lg:pb-10">
      <h1 className="text-3xl sm:text-4xl">Ödeme</h1>
      <p className="mt-2 text-cocoa-400">
        Bilgilerinizi girin, siparişinizi tamamlayalım.{" "}
        {!user && (
          <>
            Hesabınız varsa{" "}
            <Link to="/giris" className="font-semibold text-clay-400 hover:underline">
              giriş yapın
            </Link>{" "}
            veya üye olmadan devam edin.
          </>
        )}
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* 1) Teslimat Bilgileri */}
          <Section icon={Truck} step={1} title="Teslimat Bilgileri">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Ad Soyad"
                name="fullName"
                value={form.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
                autoComplete="name"
                required
              />
              <FormField
                label="İl"
                name="city"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
                placeholder="İstanbul"
                required
              />
              <FormField
                label="İlçe"
                name="district"
                value={form.district}
                onChange={set("district")}
                error={errors.district}
                placeholder="Kadıköy"
                required
              />
              <FormField
                label="Posta Kodu"
                name="postalCode"
                value={form.postalCode}
                onChange={set("postalCode")}
                placeholder="34000"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="addressLine" className="field-label">
                Açık Adres <span className="text-clay-400">*</span>
              </label>
              <textarea
                id="addressLine"
                name="addressLine"
                rows={3}
                value={form.addressLine}
                onChange={set("addressLine")}
                placeholder="Mahalle, sokak, bina ve daire bilgisi"
                className={cn("input-field", errors.addressLine && "is-invalid")}
              />
              {errors.addressLine && (
                <p className="field-error">{errors.addressLine}</p>
              )}
            </div>
          </Section>

          {/* 2) İletişim Bilgileri */}
          <Section icon={Phone} step={2} title="İletişim Bilgileri">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="E-posta"
                name="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                autoComplete="email"
                hint="Sipariş onayı bu adrese gönderilir."
                required
              />
              <FormField
                label="Telefon"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
                autoComplete="tel"
                placeholder="05XX XXX XX XX"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="note" className="field-label">
                Sipariş Notu (opsiyonel)
              </label>
              <textarea
                id="note"
                name="note"
                rows={2}
                value={form.note}
                onChange={set("note")}
                placeholder="Hediye paketi, teslimat tercihi vb."
                className="input-field"
              />
            </div>
          </Section>

          {/* 4) Ödeme Adımı */}
          <Section icon={CreditCard} step={3} title="Ödeme Yöntemi">
            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    payment === opt.id
                      ? "border-clay-400 bg-clay-50/60"
                      : "border-cream-300 hover:border-clay-200",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                    className="mt-1 h-4 w-4 text-clay-400 focus:ring-clay-300"
                  />
                  <span>
                    <span className="block font-semibold text-cocoa-600">
                      {opt.label}
                    </span>
                    <span className="block text-sm text-cocoa-400">
                      {opt.desc}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Section>
        </div>

        {/* 3) Sipariş Özeti */}
        <aside>
          <div className="card sticky top-20 p-6">
            <h2 className="flex items-center gap-2 text-xl">
              <Receipt className="h-5 w-5 text-clay-400" /> Sipariş Özeti
            </h2>

            <ul className="mt-4 flex flex-col gap-3 border-b border-cream-200 pb-4">
              {lines.map((l) => (
                <li key={cartItemKey(l)} className="flex gap-3 text-sm">
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-cream-200 px-1 text-xs font-bold text-cocoa-500">
                    {l.quantity}
                  </span>
                  <span className="flex-1 text-cocoa-500">
                    {l.product.name}
                    {l.sizeLabel && (
                      <span className="block text-xs text-cocoa-400">
                        Ölçü: {l.sizeLabel}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-cocoa-600">
                    {formatPrice(l.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-sm">
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
              <div className="flex justify-between border-t border-cream-200 pt-2 text-base">
                <dt className="font-semibold text-cocoa-600">Toplam</dt>
                <dd className="font-bold text-cocoa-600">{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-6 hidden w-full lg:flex"
            >
              <Lock className="h-4 w-4" />
              {submitting ? "İşleniyor…" : "Siparişi Tamamla"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-cocoa-400">
              <ShieldCheck className="h-4 w-4 text-sage-400" /> 256-bit SSL ile
              güvenli ödeme
            </div>
            <p className="mt-1 text-center text-xs text-cocoa-400">
              {settings.shipping.carrierNote} Tahmini teslimat:{" "}
              {settings.shipping.estimatedDays}.
            </p>
          </div>
        </aside>

        {/* MOBİL sabit alt çubuk */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-cream-50/95 px-4 py-3 pb-safe backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="leading-tight">
              <p className="text-xs text-cocoa-400">Toplam</p>
              <p className="text-lg font-bold text-cocoa-600">
                {formatPrice(total)}
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              <Lock className="h-4 w-4" />
              {submitting ? "İşleniyor…" : "Siparişi Tamamla"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({
  icon: Icon,
  step,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 flex items-center gap-3 text-xl">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-clay-400 text-sm font-bold text-cream-50">
          {step}
        </span>
        <Icon className="h-5 w-5 text-clay-400" />
        {title}
      </h2>
      {children}
    </section>
  );
}
