import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { FormField, validators } from "@/components/FormField";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    next.email = validators.email(email) ?? "";
    next.password = validators.required(password) ?? "";
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v),
    );
    setErrors(cleaned);
    if (Object.keys(cleaned).length) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      notify("Tekrar hoş geldiniz!");
      navigate("/hesabim");
    } else {
      setErrors({ form: res.error ?? "Giriş yapılamadı." });
    }
  };

  return (
    <AuthShell
      title="Giriş Yap"
      subtitle="Hesabınıza giriş yaparak siparişlerinizi takip edin."
      footer={
        <>
          Hesabınız yok mu?{" "}
          <Link to="/kayit" className="font-semibold text-clay-400 hover:underline">
            Kayıt Olun
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
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@eposta.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <FormField
          label="Şifre"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        <div className="flex justify-end">
          <Link
            to="/sifremi-unuttum"
            className="text-sm font-semibold text-clay-400 hover:underline"
          >
            Şifremi Unuttum
          </Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
    </AuthShell>
  );
}
