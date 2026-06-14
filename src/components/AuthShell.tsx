import { Link } from "react-router-dom";

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
      </div>
    </div>
  );
}
