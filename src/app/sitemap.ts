import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getActiveProductSlugs, getBrands } from "@/server/queries/catalog";

export const revalidate = 3600;

const staticRoutes = [
  "/",
  "/shop",
  "/installation",
  "/support",
  "/support/faq",
  "/support/warranty",
  "/support/returns",
  "/support/contact",
  "/about",
  "/contact",
  "/legal/privacy-policy",
  "/legal/terms",
  "/legal/shipping-policy",
  "/legal/return-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([getActiveProductSlugs(), getBrands()]);
  const brandRoutes = brands.flatMap((b) => [`/shop/${b.slug}`]);
  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: path.startsWith("/shop") || path === "/" ? ("daily" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path.startsWith("/shop") ? 0.9 : 0.5,
    })),
    ...brandRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
