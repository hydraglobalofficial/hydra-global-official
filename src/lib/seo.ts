import { createElement } from "react";
import { siteConfig } from "@/config/site";
import type { SocialContent } from "@/content/site-sections";
import { absoluteUrl } from "./utils";

type Json = Record<string, unknown>;

/** Renders a JSON-LD script. `<` is escaped so user content can't break out of the tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
  });
}

export function organizationJsonLd(social: SocialContent = siteConfig.social): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: absoluteUrl("/"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressCountry: "BD" },
    sameAs: [social.facebook, social.instagram, social.youtube, social.x],
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(p: {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  ratingAverage: number;
  ratingCount: number;
  priceCurrency?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.sku,
    brand: { "@type": "Brand", name: siteConfig.name },
    image: p.images.map((src) => absoluteUrl(src)),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${p.slug}`),
      priceCurrency: p.priceCurrency || siteConfig.currency,
      price: p.price,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(p.ratingCount > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: p.ratingAverage.toFixed(1), reviewCount: p.ratingCount },
    }),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
