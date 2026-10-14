"use client";

import dynamic from "next/dynamic";

export const ScrollTopButton = dynamic(
  () => import("@/components/layout/scroll-top-button").then((m) => m.ScrollTopButton),
  { ssr: false },
);
