import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { StaticPage } from "@/components/StaticPage";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

export function Faq() {
  const { settings } = useSettings();
  const [open, setOpen] = useState<number | null>(0);

  const FAQS = [
    {
      q: "Çantalar gerçekten el yapımı mı?",
      a: "Evet. Her çanta annemin elleriyle, tek tek dikilir. Seri üretim yapmıyoruz; bu yüzden her parça biricik.",
    },
    {
      q: "Siparişim ne zaman elime ulaşır?",
      a: `Tahmini teslimat süresi ${settings.shipping.estimatedDays}'dür. El yapımı oldukları için bazı ürünler hazırlık süresi gerektirebilir.`,
    },
    {
      q: "Kargo ücreti ne kadar?",
      a: `${settings.shipping.freeShippingThreshold} TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde ${settings.shipping.standardCost} TL kargo ücreti uygulanır.`,
    },
    {
      q: "İade edebilir miyim?",
      a: "Evet, ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. Detaylar İade ve Değişim sayfamızda.",
    },
    {
      q: "Özel sipariş verebilir miyim?",
      a: "Tabii ki! Renk, kumaş veya ölçü tercihleriniz için bize İletişim sayfasından ulaşabilirsiniz.",
    },
    {
      q: "Üye olmadan sipariş verebilir miyim?",
      a: "Evet, üye olmadan da (misafir olarak) kolayca sipariş verebilirsiniz.",
    },
  ];
  return (
    <StaticPage
      title="Sıkça Sorulan Sorular"
      intro="Merak ettiklerinizin yanıtları burada. Aradığınızı bulamazsanız bize yazın."
    >
      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-serif text-lg text-cocoa-600">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-clay-400 transition-transform",
                  open === i && "rotate-180",
                )}
              />
            </button>
            {open === i && (
              <p className="border-t border-cream-200 px-5 py-4 text-cocoa-500">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
