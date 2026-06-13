import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { FormField, validators } from "@/components/FormField";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function Register() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    next.fullName = validators.required(form.fullName) ?? "";
    next.email = validators.email(form.email) ?? "";
    next.phone = validators.phone(form.phone) ?? "";
    next.password = validators.minLen(6)(form.password) ?? "";
    if (form.password2 !== form.password)
      next.password2 = "Şifreler eşleşmiyor.";
    if (!accepted) next.accepted = "Devam etmek için sözleşmeyi onaylayın.";

    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v),
    );
    setErrors(cleaned);
    if (Object.keys(cleaned).length) return;

    setLoading(true);
    const res = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setLoading(false);
    if (res.ok) {
      notify("Hesabınız oluşturuldu, hoş geldiniz!");
      navigate("/hesabim");
    } else {
      setErrors({ form: res.error ?? "Kayıt oluşturulamadı." });
    }
  };

  return (
    <AuthShell
      title="Kayıt Ol"
      subtitle="Noian ailesine katılın, alışverişiniz daha kolay olsun."
      footer={
        <>
          Zaten hesabınız var mı?{" "}
          <Link to="/giris" className="font-semibold text-clay-400 hover:underline">
            Giriş Yapın
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {errors.form && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.form}
          </div>
        )}
        <FormField
          label="Ad Soyad"
          name="fullName"
          autoComplete="name"
          placeholder="Adınız Soyadınız"
          value={form.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
          required
        />
        <FormField
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@eposta.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
        />
        <FormField
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
          hint="Sipariş bilgilendirmesi için (opsiyonel)"
        />
        <FormField
          label="Şifre"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="En az 6 karakter"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          required
        />
        <FormField
          label="Şifre (Tekrar)"
          name="password2"
          type="password"
          autoComplete="new-password"
          placeholder="Şifrenizi tekrar girin"
          value={form.password2}
          onChange={set("password2")}
          error={errors.password2}
          required
        />

        <label className="flex items-start gap-2 text-sm text-cocoa-500">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-cream-300 text-clay-400 focus:ring-clay-300"
          />
          <span>
            <Link to="/gizlilik-politikasi" className="text-clay-400 hover:underline">
              Gizlilik Politikası
            </Link>{" "}
            ve{" "}
            <Link to="/mesafeli-satis-sozlesmesi" className="text-clay-400 hover:underline">
              kullanım koşullarını
            </Link>{" "}
            okudum, onaylıyorum.
          </span>
        </label>
        {errors.accepted && <p className="field-error">{errors.accepted}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Hesap oluşturuluyor…" : "Kayıt Ol"}
        </button>
      </form>
    </AuthShell>
  );
}
