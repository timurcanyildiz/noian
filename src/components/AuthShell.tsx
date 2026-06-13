import { Link } from "react-router-dom";
import { Info } from "lucide-react";

/** Giriş/Kayıt sayfaları için ortak, sıcak görünümlü kabuk. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-clay-400 font-serif text-2xl text-cream-50"
          >
            N
          </Link>
          <h1 className="text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-cocoa-400">{subtitle}</p>}
        </div>

        <div className="card p-6 sm:p-8">{children}</div>

        {footer && (
          <p className="mt-5 text-center text-sm text-cocoa-500">{footer}</p>
        )}

        {/* Demo bilgilendirme notu */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-dashed border-clay-200 bg-clay-50/60 px-3 py-2.5 text-xs text-clay-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <strong>Demo modu:</strong> Üyelik bilgileri şu an yalnızca bu
            tarayıcıda saklanır. Sipariş vermek için üyelik zorunlu değildir;
            misafir olarak da alışveriş yapabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
