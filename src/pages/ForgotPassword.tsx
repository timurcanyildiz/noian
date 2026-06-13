import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { FormField, validators } from "@/components/FormField";
import { useAuth } from "@/context/AuthContext";

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validators.email(email);
    setError(err);
    if (err) return;
    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell
      title="Şifremi Unuttum"
      subtitle="E-posta adresinizi girin, sıfırlama bağlantısı gönderelim."
      footer={
        <Link to="/giris" className="font-semibold text-clay-400 hover:underline">
          Giriş ekranına dön
        </Link>
      }
    >
      {sent ? (
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-sage-400" />
          <h2 className="mt-3 text-xl">E-postanızı kontrol edin</h2>
          <p className="mt-2 text-sm text-cocoa-400">
            Eğer <strong>{email}</strong> ile kayıtlı bir hesap varsa, şifre
            sıfırlama bağlantısı gönderildi.
          </p>
          <p className="owner-note mt-4 text-left">
            ⚠️ <strong>Sahibine not:</strong> Gerçek e-posta gönderimi için bir
            e-posta servisi (örn. Resend) bağlanmalıdır. Demo'da e-posta
            gönderilmez.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <FormField
            label="E-posta"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
