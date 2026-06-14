import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Gift,
  Heart,
  Leaf,
  MessageCircle,
  Package,
  RefreshCw,
  Ruler,
  Scissors,
  Sparkles,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { SectionHeading, Rating } from "@/components/common";
import { ScrollReveal } from "./ScrollReveal";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/data/settings";
import type { Testimonial } from "@/data/types";
import { whatsappLink } from "@/lib/whatsapp";

const PROCESS = [
  {
    step: "01",
    icon: Ruler,
    title: "Kumaş seçimi",
    text: "Dokusu, rengi ve dayanıklılığı özenle seçilen kumaşlar.",
  },
  {
    step: "02",
    icon: Scissors,
    title: "Kesim & hazırlık",
    text: "Her parça tek tek ölçülür, kalıp seri üretim değildir.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "El dikişi",
    text: "Annemin tezgâhında sabırla, dikiş dikiş tamamlanır.",
  },
  {
    step: "04",
    icon: Gift,
    title: "Özenli paket",
    text: "Sevgiyle paketlenir, kapınıza ulaştırılır.",
  },
];

const WHY = [
  {
    icon: Heart,
    title: "Her parça biricik",
    text: "Aynı kumaştan iki çanta bile tıpatıp aynısı değildir — el emeğinin doğal güzelliği.",
  },
  {
    icon: Leaf,
    title: "Özenli malzeme",
    text: "Dayanıklı, doğal dokulu kumaşlar; uzun ömürlü ve keyifle kullanılan parçalar.",
  },
  {
    icon: Package,
    title: "Küçük atölye",
    text: "Büyük fabrika yok. Az adet, çok emek; sınırlı koleksiyonlar.",
  },
];

export function HomeStats({ settings }: { settings: SiteSettings }) {
  const stats = [
    { value: "100%", label: "El yapımı" },
    { value: "∞", label: "Özgün parçalar" },
    { value: `${settings.shipping.freeShippingThreshold}₺+`, label: "Ücretsiz kargo" },
    { value: "14 gün", label: "Kolay iade" },
  ];

  return (
    <section className="relative overflow-hidden border-y border-clay-100 bg-gradient-to-r from-clay-50/80 via-cream-100 to-sage-200/30 py-8">
      <div className="container grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 80}>
            <div className="text-center">
              <p className="font-serif text-3xl text-clay-400 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-cocoa-400">
                {s.label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function HomeProcess() {
  return (
    <section className="container py-20">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Atölyemizden"
          title="Bir çanta nasıl doğar?"
          subtitle="Seri üretim yok; her adım sabır ve özenle ilerler."
        />
      </ScrollReveal>
      <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-clay-200 to-transparent lg:block"
          aria-hidden
        />
        {PROCESS.map((step, i) => (
          <ScrollReveal key={step.step} delay={i * 100}>
            <div className="card-hover relative flex flex-col items-center p-6 text-center">
              <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-clay-400 font-serif text-lg text-cream-50 shadow-soft ring-4 ring-cream-100">
                <step.icon className="h-6 w-6" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-clay-400">
                Adım {step.step}
              </span>
              <h3 className="mt-2 font-serif text-xl text-cocoa-600">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cocoa-400">{step.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function HomeWhyNoian() {
  return (
    <section className="bg-cream-200/35 py-20">
      <div className="container">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Neden Noian?"
            title="Seri üretim değil, samimi üretim"
            subtitle="Büyük markaların hızına değil; emeğin, sabrın ve hikâyenin peşindeyiz."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {WHY.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 120}>
              <div className="card-hover h-full p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-clay-50 text-clay-400">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-cocoa-600">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-cocoa-400">{item.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeQuote({ testimonial }: { testimonial?: Testimonial }) {
  if (!testimonial) return null;

  return (
    <section className="py-16">
      <div className="container">
        <ScrollReveal>
          <blockquote className="relative mx-auto max-w-3xl rounded-3xl border border-clay-100 bg-gradient-to-br from-clay-50/60 to-cream-50 px-8 py-12 text-center shadow-soft sm:px-14">
            <span
              className="pointer-events-none absolute left-6 top-4 font-serif text-7xl leading-none text-clay-200"
              aria-hidden
            >
              “
            </span>
            <Rating value={testimonial.rating} className="mx-auto justify-center" />
            <p className="mt-5 font-serif text-2xl leading-relaxed text-cocoa-600 sm:text-3xl">
              {testimonial.text}
            </p>
            <footer className="mt-6 text-sm font-semibold text-cocoa-500">
              — {testimonial.authorName}
              {testimonial.location && (
                <span className="font-normal text-cocoa-400">
                  {" "}
                  · {testimonial.location}
                </span>
              )}
            </footer>
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function HomeMiniFaq({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: "Çantalar gerçekten el yapımı mı?",
      a: "Evet. Her çanta tek tek dikilir; seri üretim yapmıyoruz.",
    },
    {
      q: "Siparişim ne zaman gelir?",
      a: `Tahmini teslimat ${settings.shipping.estimatedDays}. El yapımı ürünlerde hazırlık süresi olabilir.`,
    },
    {
      q: "Kargo ücreti var mı?",
      a: `${settings.shipping.freeShippingThreshold} TL üzeri ücretsiz. Altında ${settings.shipping.standardCost} TL.`,
    },
    {
      q: "İade edebilir miyim?",
      a: "14 gün içinde iade hakkınız var. Detaylar İade ve Değişim sayfasında.",
    },
  ];

  return (
    <section className="container py-20">
      <ScrollReveal>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Merak edilenler"
              title="Kısa cevaplar"
              subtitle="Daha fazlası için SSS sayfamıza göz atın veya bize yazın."
            />
            <Link
              to="/sss"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-clay-400 hover:underline"
            >
              Tüm sorular <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-cocoa-600">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-clay-400 transition-transform",
                      open === i && "rotate-180",
                    )}
                  />
                </button>
                {open === i && (
                  <p className="border-t border-cream-200 px-5 py-4 text-sm leading-relaxed text-cocoa-400">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function HomeTrustStrip({ settings }: { settings: SiteSettings }) {
  const items = [
    { icon: Truck, text: `${settings.shipping.estimatedDays} teslimat` },
    { icon: RefreshCw, text: "14 gün iade" },
    { icon: Package, text: "Özenli paketleme" },
    { icon: MessageCircle, text: "Samimi destek" },
  ];

  return (
    <section className="border-y border-cream-200 bg-cream-50/90 py-6">
      <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {items.map((item) => (
          <span
            key={item.text}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cocoa-500"
          >
            <item.icon className="h-4 w-4 text-clay-400" />
            {item.text}
          </span>
        ))}
      </div>
    </section>
  );
}

export function HomeCtaBand({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-20">
      <div className="container">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-clay-400 via-clay-500 to-cocoa-600 px-8 py-14 text-center text-cream-50 shadow-soft sm:px-14 sm:py-16">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cream-50/10 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-sage-300/20 blur-3xl"
              aria-hidden
            />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream-200">
              İlk adım
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Size uygun çantayı birlikte bulalım
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-cream-100/90">
              Koleksiyonumuzu keşfedin veya özel sipariş için doğrudan yazın —
              her soruya içtenlikle cevap veriyoruz.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/magaza"
                className="inline-flex items-center gap-2 rounded-full bg-cream-50 px-7 py-3.5 text-sm font-bold text-clay-500 transition-transform hover:scale-[1.02]"
              >
                Mağazaya Git <ArrowRight className="h-4 w-4" />
              </Link>
              {settings.contact.whatsapp && (
                <a
                  href={whatsappLink(
                    settings.contact.whatsapp,
                    "Merhaba, çantalarınız hakkında bilgi almak istiyorum.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream-50/40 px-7 py-3.5 text-sm font-bold text-cream-50 transition-colors hover:bg-cream-50/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/40 px-7 py-3.5 text-sm font-bold text-cream-50 transition-colors hover:bg-cream-50/10"
              >
                İletişim
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
