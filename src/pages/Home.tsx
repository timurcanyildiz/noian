import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scissors,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading, Rating } from "@/components/common";
import { useCatalog } from "@/context/CatalogContext";
import { useSettings } from "@/context/SettingsContext";
import { DEFAULT_HERO_IMAGE } from "@/data/settings";
import { api } from "@/lib/api";
import type { Testimonial } from "@/data/types";

export function Home() {
  const { getFeaturedProducts, categories } = useCatalog();
  const { settings } = useSettings();
  const featured = getFeaturedProducts();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.listTestimonials().then(setTestimonials);
  }, []);

  const FEATURES = [
    {
      icon: Scissors,
      title: "El emeği üretim",
      text: "Her çanta annemin tezgâhında tek tek dikilir.",
    },
    {
      icon: Sparkles,
      title: "Sınırlı sayıda",
      text: "Küçük atölye ruhu; seri üretim yok, her parça özel.",
    },
    {
      icon: Truck,
      title: "Özenli kargo",
      text: `${settings.shipping.freeShippingThreshold} TL üzeri ücretsiz, özenle paketlenir.`,
    },
    {
      icon: ShieldCheck,
      title: "Güvenli alışveriş",
      text: "Kolay iade ve güvenli ödeme altyapısı.",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="max-w-xl">
            <span className="badge bg-clay-50 text-clay-500">
              {settings.brand.tagline}
            </span>
            <h1 className="mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {settings.home.heroTitle}
            </h1>
            <p className="mt-5 text-lg text-cocoa-400">
              {settings.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/magaza" className="btn-primary">
                Çantaları Keşfet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/hakkimizda" className="btn-outline">
                Hikayemiz
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
              <img
                src={settings.home.heroImageUrl || DEFAULT_HERO_IMAGE}
                alt="El yapımı kumaş çanta"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-cream-200 bg-cream-50 px-5 py-4 shadow-soft sm:block">
              <p className="font-serif text-2xl text-clay-400">100%</p>
              <p className="text-sm text-cocoa-400">El yapımı & özgün</p>
            </div>
          </div>
        </div>
      </section>

      {/* GÜVEN ŞERİDİ */}
      <section className="border-y border-cream-200 bg-cream-50">
        <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-clay-50 text-clay-400">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg text-cocoa-600">{f.title}</h3>
                <p className="text-sm text-cocoa-400">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="Koleksiyon"
          title="Kategoriler"
          subtitle="İhtiyacınıza ve tarzınıza uygun parçayı bulun."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/magaza?kategori=${c.slug}`}
              className="group rounded-2xl border border-cream-200 bg-cream-50 p-6 shadow-card transition-shadow hover:shadow-soft"
            >
              <h3 className="font-serif text-xl text-cocoa-600 group-hover:text-clay-400">
                {c.name}
              </h3>
              <p className="mt-2 text-sm text-cocoa-400">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-clay-400">
                İncele <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKAN ÜRÜNLER */}
      <section className="bg-cream-200/50 py-16">
        <div className="container">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Seçtiklerimiz"
              title="Öne çıkan çantalar"
            />
            <Link
              to="/magaza"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-clay-400 hover:text-clay-500 sm:flex"
            >
              Tümünü gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/magaza" className="btn-outline">
              Tüm ürünleri gör
            </Link>
          </div>
        </div>
      </section>

      {/* HİKAYE ŞERİDİ */}
      <section className="container grid items-center gap-10 py-16 lg:grid-cols-2">
        <div className="aspect-[5/4] overflow-hidden rounded-2xl shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
            alt="Dikiş atölyesi"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="Hikayemiz"
            title="Bir annenin sabrı, bir ailenin emeği"
          />
          <p className="mt-4 text-cocoa-400">{settings.home.aboutText}</p>
          <Link to="/hakkimizda" className="btn-outline mt-6">
            Hikayenin tamamı <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* YORUMLAR */}
      <section className="bg-cream-200/50 py-16">
        <div className="container">
          <SectionHeading eyebrow="Müşterilerimiz" title="Sizden gelenler" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="card flex h-full flex-col p-6"
              >
                <Rating value={t.rating} />
                <blockquote className="mt-3 flex-1 text-cocoa-500">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-cocoa-600">
                  {t.authorName}
                  {t.location && (
                    <span className="font-normal text-cocoa-400">
                      {" "}
                      · {t.location}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
