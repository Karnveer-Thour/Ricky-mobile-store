import { useEffect } from "react";

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_TITLE =
  "Ricky Mobile Store Khanna | Best Mobile Phone Shop & Repair in Khanna, Ludhiana Punjab";
const DEFAULT_DESCRIPTION =
  "Ricky Mobile Store is the top-rated mobile phone shop and smartphone repair center in Khanna, Ludhiana (Punjab). Buy Apple iPhone, Samsung Galaxy, OnePlus, and Vivo with 0% Bajaj Finserv EMI, same-day delivery in Khanna (141401) & 100% genuine brand warranty.";
const BASE_URL = "https://rickymobilestore.in";

/**
 * Reusable dynamic SEO component for route-specific titles, meta descriptions,
 * OpenGraph tags, canonical links, and Schema.org JSON-LD structured data.
 */
export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=630&fit=crop",
  schema,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Document Title
    const finalTitle = title ? `${title} | Ricky Mobile Store` : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to update or create meta tags
    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // 2. Primary Meta Description
    const finalDesc = description || DEFAULT_DESCRIPTION;
    setMeta("name", "description", finalDesc);

    // 3. OpenGraph Tags
    setMeta("property", "og:title", finalTitle);
    setMeta("property", "og:description", finalDesc);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage);
    const finalUrl = canonicalUrl
      ? canonicalUrl.startsWith("http")
        ? canonicalUrl
        : `${BASE_URL}${canonicalUrl}`
      : typeof window !== "undefined"
      ? window.location.href
      : BASE_URL;
    setMeta("property", "og:url", finalUrl);

    // 4. Twitter Card Tags
    setMeta("name", "twitter:title", finalTitle);
    setMeta("name", "twitter:description", finalDesc);
    setMeta("name", "twitter:image", ogImage);

    // 5. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = finalUrl;

    // 6. Route-Specific JSON-LD Schema
    const existingScript = document.getElementById("route-schema");
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement("script");
      script.id = "route-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById("route-schema");
      if (s) {
        s.remove();
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schema]);

  return null;
}
