import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function PromoBanner() {
  const { settings } = useSettings();
  const { banner } = settings;

  if (!banner.enabled || !banner.message.trim()) return null;

  const inner = (
    <>
      <Sparkles className="h-4 w-4 shrink-0 opacity-80" />
      <span className="font-medium">{banner.message}</span>
    </>
  );

  return (
    <div className="border-b border-clay-200/60 bg-gradient-to-r from-clay-50 via-cream-100 to-clay-50 text-center text-sm text-clay-600">
      <div className="container flex items-center justify-center gap-2 px-4 py-2.5">
        {banner.link ? (
          <Link
            to={banner.link}
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            {inner}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2">{inner}</span>
        )}
      </div>
    </div>
  );
}
