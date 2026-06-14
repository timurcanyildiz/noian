import { Star } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Bölüm başlığı (ortalanmış, butik tarzı) */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-clay-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-medium sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-cocoa-400">{subtitle}</p>
      )}
    </div>
  );
}

/** Yıldız puanı göstergesi */
export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} / 5 puan`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.round(value)
              ? "fill-clay-300 text-clay-300"
              : "fill-cream-300 text-cream-300",
          )}
        />
      ))}
    </div>
  );
}

/** Miktar ayarlayıcı (+ / -) */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-cream-300 bg-cream-50">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-10 w-10 place-items-center rounded-l-full text-cocoa-500 transition-colors hover:bg-cream-200 disabled:opacity-40"
        aria-label="Adet azalt"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-10 w-10 place-items-center rounded-r-full text-cocoa-500 transition-colors hover:bg-cream-200 disabled:opacity-40"
        aria-label="Adet artır"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Yükleniyor iskeleti */
export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-cocoa-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-clay-200 border-t-clay-400" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
