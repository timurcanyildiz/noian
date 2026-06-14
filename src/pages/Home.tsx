import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scissors,
  Truck,
  ShieldCheck,
  Sparkles,
  Instagram,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading, Rating } from "@/components/common";
import { SeoHead } from "@/components/SeoHead";
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
  const posts = settings.home.instagramPosts.filter((p) => p.imageUrl);

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
      <SeoHead
        description={settings.seo.defaultDescription}
        image={settings.home.heroImageUrl || settings.seo.ogImageUrl}
        includeSiteSchema
      />

      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="max-w-xl animate-fade-in-up">
            <span className="badge bg-clay-50 text-clay-500">
              {settings.brand.tagline}
            </span>
            <h1 className="hero-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              {settings.home.heroTitle}
              {settings.home.heroTitleEmphasis && (
                <span className="hero-display-emphasis text-3xl sm:text-4xl lg:text-5xl">
                  {settings.home.heroTitleEmphasis}
                </span>
              )}
            </h1>
            <p className="mt-5 animate-fade-in-up-delay-1 text-lg text-cocoa-400">
              {settings.home.heroSubtitle}
            </p>
            <div className="mt-8 flex animate-fade-in-up-delay-2 flex-wrap gap-3">
              <Link to="/magaza" className="btn-primary">
                Çantaları Keşfet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/hakkimizda" className="btn-outline">
                Hikayemiz
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in-up-delay-2">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-cream-200/80 shadow-soft">
              <img
                src={settings.home.heroImageUrl || DEFAULT_HERO_IMAGE}
                alt="El yapımı kumaş çanta"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-cream-200 bg-cream-50/95 px-5 py-4 shadow-soft backdrop-blur sm:block">
              <p className="font-serif text-2xl text-clay-400">100%</p>
              <p className="text-sm text-cocoa-400">El yapımı & özgün</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cream-200/80 bg-cream-50/80 backdrop-blur-sm">
        <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="flex items-start gap-3"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-clay-50 text-clay-400 ring-1 ring-clay-100">
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

      <section className="container py-16 section-reveal">
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
              className="card-hover group p-6"
            >
              <h3 className="font-serif text-xl text-cocoa-600 transition-colors group-hover:text-clay-400">
                {c.name}
              </h3>
              <p className="mt-2 text-sm text-cocoa-400">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-clay-400">
                İncele <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream-200/40 py-16">
        <div className="container section-reveal">
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

      {posts.length > 0 && (
        <section className="container py-16 section-reveal">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Instagram"
              title={settings.home.instagramTitle}
              subtitle={settings.home.instagramSubtitle}
            />
            <a
              href={settings.contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-clay-400 hover:text-clay-500"
            >
              <Instagram className="h-4 w-4" />
              @noianbags
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {posts.slice(0, 6).map((post, i) => {
              const cell = (
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-cream-200 bg-cream-200 shadow-card">
                  <img
                    src={post.imageUrl}
                    alt="Atölyeden kare"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-cocoa-700/0 transition-colors group-hover:bg-cocoa-700/10" />
                </div>
              );
              return post.link ? (
                <a key={i} href={post.link} target="_blank" rel="noreferrer">
                  {cell}
                </a>
              ) : (
                <div key={i}>{cell}</div>
              );
            })}
          </div>
        </section>
      )}

      <section className="container grid items-center gap-10 py-16 lg:grid-cols-2 section-reveal">
        <div className="aspect-[5/4] overflow-hidden rounded-2xl border border-cream-200/80 shadow-soft">
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

      <section className="bg-cream-200/40 py-16">
        <div className="container section-reveal">
          <SectionHeading eyebrow="Müşterilerimiz" title="Sizden gelenler" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="card-hover flex h-full flex-col p-6">
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
