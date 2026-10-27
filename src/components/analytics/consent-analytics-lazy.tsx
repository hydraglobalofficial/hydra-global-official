"use client";

import dynamic from "next/dynamic";
import type { TrackingContent } from "@/content/site-sections";

const ConsentAnalyticsInner = dynamic(
  () => import("@/components/analytics/consent-analytics").then((m) => m.ConsentAnalytics),
  { ssr: false },
);

export function ConsentAnalytics({ tracking }: { tracking: TrackingContent }) {
  return <ConsentAnalyticsInner tracking={tracking} />;
}
