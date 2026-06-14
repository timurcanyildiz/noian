import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, User as UserIcon, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/BrandMark";

const NAV = [
  { to: "/magaza", label: "Mağaza" },
  { to: "/hakkimizda", label: "Hikayemiz" },
  { to: "/kargo-politikasi", label: "Kargo" },
  { to: "/iletisim", label: "İletişim" },
];

export function Header() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Sayfa değişince mobil menüyü kapat
  useEffect(() => setOpen(false), [location.pathname]);

  // Menü açıkken arka plan kaymasın
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-cream-100/90 backdrop-blur">
      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        {/* Sol: mobil menü + logo */}
        <div className="flex items-center gap-2">
          <button
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <BrandMark size="header" showName={!settings.brand.logoUrl} />
          </Link>
        </div>

        {/* Orta: masaüstü menü */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold transition-colors hover:text-clay-400",
                  isActive ? "text-clay-400" : "text-cocoa-500",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sağ: hesap + sepet */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                to="/hesabim"
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-cocoa-500 hover:bg-cream-200"
              >
                <UserIcon className="h-4 w-4 text-clay-400" />
                <span className="max-w-[8rem] truncate">
                  {user?.fullName.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="grid h-10 w-10 place-items-center rounded-full text-cocoa-500 hover:bg-cream-200"
                aria-label="Çıkış yap"
                title="Çıkış Yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/giris"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-cocoa-500 hover:bg-cream-200 sm:flex"
            >
              <UserIcon className="h-4 w-4" />
              Giriş Yap
            </Link>
          )}

          <Link
            to="/sepet"
            className="relative grid h-10 w-10 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200"
            aria-label="Sepet"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay-400 px-1 text-[11px] font-bold text-cream-50">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobil yan menü */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-cocoa-700/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-cream-100 p-5 shadow-soft animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-xl text-cocoa-600">
                {settings.brand.name}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 text-base font-semibold",
                      isActive
                        ? "bg-clay-50 text-clay-500"
                        : "text-cocoa-600 hover:bg-cream-200",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-cream-200 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-1">
                  <Link
                    to="/hesabim"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-cocoa-600 hover:bg-cream-200"
                  >
                    <UserIcon className="h-5 w-5 text-clay-400" /> Hesabım
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-cocoa-600 hover:bg-cream-200"
                  >
                    <LogOut className="h-5 w-5" /> Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/giris" className="btn-primary w-full">
                    Giriş Yap
                  </Link>
                  <Link to="/kayit" className="btn-outline w-full">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
