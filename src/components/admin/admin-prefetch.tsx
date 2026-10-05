"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Warm admin routes after idle — avoid hammering Next while pages are still compiling. */
const PREFETCH_ROUTES = [
  "/admin",
  "/admin/orders",
  "/admin/inquiries",
  "/admin/reviews",
  "/admin/products",
  "/admin/products/new",
  "/admin/catalog",
  "/admin/content",
  "/admin/collections",
  "/admin/about",
  "/admin/installation",
  "/admin/team",
] as const;

export function AdminRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let i = 0;

    const runOne = () => {
      if (cancelled || i >= PREFETCH_ROUTES.length) return;
      router.prefetch(PREFETCH_ROUTES[i]);
      i += 1;
      if (i < PREFETCH_ROUTES.length) {
        window.setTimeout(runOne, 350);
      }
    };

    const start = () => {
      if (cancelled) return;
      runOne();
    };

    // Wait for first paint + idle so RSC compile storms don't fail fetches.
    const delay = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(start);
      } else {
        start();
      }
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(delay);
    };
  }, [router]);

  return null;
}
