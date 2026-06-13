import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, Heart } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { BrandMark } from "@/components/BrandMark";

const LINKS = {
  shop: [
    { to: "/magaza", label: "Tüm Ürünler" },
    { to: "/magaza?kategori=omuz-cantalari", label: "Omuz Çantaları" },
    { to: "/magaza?kategori=el-cantalari", label: "El Çantaları" },
    { to: "/magaza?kategori=bez-cantalar", label: "Bez & Tote" },
  ],
  help: [
    { to: "/kargo-politikasi", label: "Kargo Politikası" },
    { to: "/iade-ve-degisim", label: "İade ve Değişim" },
    { to: "/iletisim", label: "İletişim" },
    { to: "/sss", label: "Sıkça Sorulanlar" },
  ],
  legal: [
    { to: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
    { to: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
    { to: "/on-bilgilendirme-formu", label: "Ön Bilgilendirme Formu" },
    { to: "/sahip-rehberi", label: "Site Sahibi Rehberi" },
    { to: "/admin", label: "Yönetim Paneli" },
  ],
};

export function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="mt-20 border-t border-cream-200 bg-cream-200/50">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3">
            <BrandMark />
          </div>
          <p className="text-sm leading-relaxed text-cocoa-400">
            {settings.brand.description}
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-cocoa-500">
            <a
              href={`mailto:${settings.contact.email}`}
              className="flex items-center gap-2 hover:text-clay-400"
            >
              <Mail className="h-4 w-4" /> {settings.contact.email}
            </a>
            <a
              href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-clay-400"
            >
              <Phone className="h-4 w-4" /> {settings.contact.phone}
            </a>
            <a
              href={settings.contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-clay-400"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>

        <FooterCol title="Alışveriş" links={LINKS.shop} />
        <FooterCol title="Yardım" links={LINKS.help} />
        <FooterCol title="Kurumsal" links={LINKS.legal} />
      </div>

      <div className="border-t border-cream-200">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-cocoa-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.brand.name}. Tüm hakları
            saklıdır.
          </p>
          <p className="flex items-center gap-1">
            El emeğiyle <Heart className="h-3 w-3 fill-clay-300 text-clay-300" />{" "}
            üretildi
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-cocoa-600">
        {title}
      </h4>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-cocoa-400 hover:text-clay-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
