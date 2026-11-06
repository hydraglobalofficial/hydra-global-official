import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getActiveProductSlugs, getBrands } from "@/server/queries/catalog";

export const revalidate = 3600;

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/installation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support", changeFrequency: "monthly", priority: 0.6 },
  { path: "/support/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/support/warranty", changeFrequency: "monthly", priority: 0.5 },
  { path: "/support/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/legal/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/shipping-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/return-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([getActiveProductSlugs(), getBrands()]);
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...brands.map((brand) => ({
      url: absoluteUrl(`/shop/${brand.slug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
