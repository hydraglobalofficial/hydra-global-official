"use client";

import { useEffect } from "react";
import { hasAnalyticsConsent, track, type AnalyticsEvent, type AnalyticsPayload } from "@/lib/analytics";

/** Fires an analytics event once on mount. With `onceKey`, fires at most once per browser session. */
export function TrackEvent({ event, payload, onceKey }: { event: AnalyticsEvent; payload?: AnalyticsPayload; onceKey?: string }) {
  const serialized = JSON.stringify(payload ?? {});

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    if (onceKey) {
      const key = `hydra.tracked.${onceKey}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    }
    track(event, JSON.parse(serialized));
  }, [event, serialized, onceKey]);

  return null;
}
