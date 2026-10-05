"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Warm the Next.js router cache so every admin destination is one-click fast. */
const PREFETCH_ROUTES = [
  "/admin",
  "/admin/orders",
  "/admin/inquiries",
  "/admin/reviews",
  "/admin/products",
  "/admin/products/new",
  "/admin/catalog",
  "/admin/content",
  "/admin/about",
  "/admin/installation",
  "/admin/team",
] as const;

export function AdminRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const href of PREFETCH_ROUTES) {
        router.prefetch(href);
      }
    }, 50);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
