import type { Product } from "@/data/types";
import { getPrimaryImage } from "@/data/products";
import { isProductAvailable } from "@/lib/productHelpers";

const SITE_URL = typeof window !== "undefined" ? window.location.origin : "";

export function setMetaTag(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

export function buildProductSchema(product: Product, brandName: string) {
  const img = getPrimaryImage(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: img?.url ? [img.url] : undefined,
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price,
      availability: isProductAvailable(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function buildOrganizationSchema(
  brandName: string,
  description: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    description,
    url,
  };
}

export function buildWebSiteSchema(brandName: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/magaza?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
