import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { useAdmin } from "../AdminContext";
import { Field, Input } from "../components";

export function AdminLogin() {
  const { login, isLoggedIn } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate("/admin", { replace: true });
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const res = await login(password);
    setLoading(false);
    if (res.ok) navigate("/admin", { replace: true });
    else setError(res.error ?? "Giriş yapılamadı.");
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-cream-100 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-clay-400 text-cream-50">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h1 className="text-2xl">Yönetim Paneli</h1>
          <p className="mt-1 text-sm text-cocoa-400">
            Devam etmek için yönetici şifrenizi girin.
          </p>
        </div>

        <form onSubmit={submit} className="card flex flex-col gap-4 p-6">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <Field label="Yönetici Şifresi">
            <Input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Lock className="h-4 w-4" />
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <div className="owner-note mt-5">
          ⚠️ <strong>Not:</strong> Şifre, Vercel'de{" "}
          <code>ADMIN_PASSWORD</code> ortam değişkeninden ayarlanır. Henüz
          ayarlamadıysanız (lokal mod) geçici şifre: <code>noian-admin</code>.
        </div>
      </div>
    </div>
  );
}
