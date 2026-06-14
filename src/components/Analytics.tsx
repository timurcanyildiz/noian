import { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const { settings } = useSettings();
  const gaId = settings.marketing.googleAnalyticsId?.trim();
  const pixelId = settings.marketing.metaPixelId?.trim();

  useEffect(() => {
    if (!gaId || document.getElementById("ga-script")) return;

    const s = document.createElement("script");
    s.id = "ga-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }, [gaId]);

  useEffect(() => {
    if (!pixelId || document.getElementById("meta-pixel")) return;

    const init = document.createElement("script");
    init.id = "meta-pixel";
    init.innerHTML = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${pixelId}');
      fbq('track','PageView');
    `;
    document.head.appendChild(init);
  }, [pixelId]);

  return null;
}
