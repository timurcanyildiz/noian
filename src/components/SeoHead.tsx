import { useEffect } from "react";
import type { Product } from "@/data/types";
import { useSettings } from "@/context/SettingsContext";
import {
  buildOrganizationSchema,
  buildProductSchema,
  buildWebSiteSchema,
  removeJsonLd,
  setCanonical,
  setJsonLd,
  setMetaTag,
} from "@/lib/seo";

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  product?: Product;
  includeSiteSchema?: boolean;
};

export function SeoHead({
  title,
  description,
  image,
  path = "",
  product,
  includeSiteSchema = false,
}: SeoProps) {
  const { settings } = useSettings();

  useEffect(() => {
    const siteName = settings.brand.name;
    const pageTitle = title ? `${title} — ${siteName}` : siteName;
    const desc = description || settings.seo.defaultDescription;
    const ogImage =
      image ||
      settings.seo.ogImageUrl ||
      settings.home.heroImageUrl ||
      settings.brand.logoUrl;
    const url = `${window.location.origin}${path || window.location.pathname}`;

    document.title = pageTitle;
    setMetaTag("name", "description", desc);
    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", desc);
    setMetaTag("property", "og:type", product ? "product" : "website");
    setMetaTag("property", "og:locale", "tr_TR");
    if (ogImage) setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:url", url);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", pageTitle);
    setMetaTag("name", "twitter:description", desc);
    if (ogImage) setMetaTag("name", "twitter:image", ogImage);
    setCanonical(url);

    if (product) {
      setJsonLd(
        "seo-product",
        buildProductSchema(product, siteName),
      );
    } else {
      removeJsonLd("seo-product");
    }

    if (includeSiteSchema) {
      setJsonLd(
        "seo-org",
        buildOrganizationSchema(
          siteName,
          settings.brand.description,
          window.location.origin,
        ),
      );
      setJsonLd(
        "seo-website",
        buildWebSiteSchema(siteName, window.location.origin),
      );
    }

    return () => {
      removeJsonLd("seo-product");
      if (includeSiteSchema) {
        removeJsonLd("seo-org");
        removeJsonLd("seo-website");
      }
    };
  }, [
    title,
    description,
    image,
    path,
    product,
    includeSiteSchema,
    settings,
  ]);

  return null;
}
