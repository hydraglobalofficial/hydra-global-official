"use client";

import dynamic from "next/dynamic";

export const ConsentAnalytics = dynamic(
  () => import("@/components/analytics/consent-analytics").then((m) => m.ConsentAnalytics),
  { ssr: false },
);
