import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl, siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/cart", "/checkout", "/search", "/track"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl() === "http://localhost:3000" ? siteConfig.website : siteUrl(),
  };
}
