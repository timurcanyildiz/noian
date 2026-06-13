import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  MessageSquareQuote,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/admin/urunler", label: "Ürünler", icon: Package },
  { to: "/admin/kategoriler", label: "Kategoriler", icon: Tags },
  { to: "/admin/siparisler", label: "Siparişler", icon: ShoppingCart },
  { to: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquareQuote },
  { to: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export function AdminLayout() {
  const { isLoggedIn, logout } = useAdmin();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/admin/giris" replace state={{ from: location }} />;
  }

  return (
    <div className="flex min-h-dvh bg-cream-100">
      {/* Yan menü (masaüstü) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-cream-200 bg-cream-50 lg:flex">
        <SidebarContent onNavigate={() => {}} logout={logout} />
      </aside>

      {/* Mobil üst çubuk */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-cream-200 bg-cream-50 px-4 py-3 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream-200"
            aria-label="Menü"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg text-cocoa-600">
            Noian Yönetim
          </span>
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream-200"
            aria-label="Siteye dön"
          >
            <Store className="h-5 w-5" />
          </Link>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-cocoa-700/40"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-cream-50 shadow-soft">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent onNavigate={() => setOpen(false)} logout={logout} />
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  onNavigate,
  logout,
}: {
  onNavigate: () => void;
  logout: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-4">
      <Link
        to="/"
        className="mb-6 flex items-center gap-2 px-2"
        onClick={onNavigate}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-400 font-serif text-lg text-cream-50">
          N
        </span>
        <span className="font-serif text-lg text-cocoa-600">Noian Yönetim</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-clay-400 text-cream-50"
                  : "text-cocoa-500 hover:bg-cream-200",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-cream-200 pt-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-cocoa-500 hover:bg-cream-200"
        >
          <Store className="h-5 w-5" /> Siteyi Görüntüle
        </Link>
        <button
          onClick={() => {
            onNavigate();
            logout();
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-cocoa-500 hover:bg-cream-200"
        >
          <LogOut className="h-5 w-5" /> Çıkış Yap
        </button>
      </div>
    </div>
  );
}
