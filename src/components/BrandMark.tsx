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
  size?: "md" | "lg";
}) {
  const { settings } = useSettings();
  const dim = size === "lg" ? "h-12 w-12 text-2xl" : "h-9 w-9 text-lg";

  return (
    <span className="flex items-center gap-2">
      {settings.brand.logoUrl ? (
        <img
          src={settings.brand.logoUrl}
          alt={settings.brand.name}
          className={cn("rounded-full object-cover", dim)}
        />
      ) : (
        <span
          className={cn(
            "grid place-items-center rounded-full bg-clay-400 font-serif text-cream-50",
            dim,
          )}
        >
          N
        </span>
      )}
      {showName && (
        <span
          className={cn(
            "font-serif tracking-wide text-cocoa-600",
            size === "lg" ? "text-2xl" : "text-xl",
          )}
        >
          {settings.brand.name}
        </span>
      )}
    </span>
  );
}
