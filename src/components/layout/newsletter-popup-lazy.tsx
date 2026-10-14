"use client";

import dynamic from "next/dynamic";

export const NewsletterPopup = dynamic(
  () => import("@/components/layout/newsletter-popup").then((m) => m.NewsletterPopup),
  { ssr: false },
);
