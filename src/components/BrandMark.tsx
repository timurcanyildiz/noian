import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

/**
 * Marka işareti: ayarlardaki logo yüklüyse onu, değilse "N" harfli
 * varsayılan rozeti gösterir. Admin > Ayarlar'dan logo yüklenebilir.
 */
export function BrandMark({
  showName = true,
  size = "md",
}: {
  showName?: boolean;
  size?: "md" | "lg" | "header";
}) {
  const { settings } = useSettings();
  const hasLogo = Boolean(settings.brand.logoUrl);

  const badgeDim =
    size === "header" ? "h-11 w-11 text-xl" : size === "lg" ? "h-12 w-12 text-2xl" : "h-9 w-9 text-lg";

  const logoClass =
    size === "header"
      ? "h-11 w-auto max-w-[200px] object-contain sm:h-12 sm:max-w-[220px]"
      : size === "lg"
        ? "h-12 w-auto max-w-[160px] object-contain"
        : "h-10 w-auto max-w-[140px] object-contain";

  const nameClass =
    size === "header"
      ? "text-xl sm:text-2xl"
      : size === "lg"
        ? "text-2xl"
        : "text-xl";

  return (
    <span className="flex items-center gap-2.5">
      {hasLogo ? (
        <img
          src={settings.brand.logoUrl}
          alt={settings.brand.name}
          className={logoClass}
        />
      ) : (
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full bg-clay-400 font-serif text-cream-50",
            badgeDim,
          )}
        >
          N
        </span>
      )}
      {showName && !hasLogo && (
        <span
          className={cn(
            "font-serif tracking-wide text-cocoa-600",
            nameClass,
          )}
        >
          {settings.brand.name}
        </span>
      )}
    </span>
  );
}
