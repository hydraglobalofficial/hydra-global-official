"use client";

import { useEffect, useState } from "react";

export type LockScreenClock = {
  /** e.g. MONDAY */
  day: string;
  /** e.g. DHAKA — derived from the device timezone */
  place: string;
  /** e.g. 09:41 — zero-padded 24h */
  time: string;
  /** e.g. MONDAY · DHAKA */
  label: string;
};

function placeFromTimeZone(tz: string) {
  const leaf = tz.split("/").pop() ?? tz;
  const place = leaf.replace(/_/g, " ").toUpperCase();
  // Keep lock-screen labels short on narrow phone art.
  if (place.length <= 12) return place;
  const first = place.split(" ")[0] ?? place;
  return first.length <= 12 ? first : first.slice(0, 10);
}

function readClock(now: Date): LockScreenClock {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now).toUpperCase();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  );
  const time = `${(parts.hour ?? "00").padStart(2, "0")}:${(parts.minute ?? "00").padStart(2, "0")}`;
  const place = placeFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  return { day, place, time, label: `${day} · ${place}` };
}

const FALLBACK: LockScreenClock = {
  day: "MONDAY",
  place: "LOCAL",
  time: "09:41",
  label: "MONDAY · LOCAL",
};

/** Live device-local weekday + place + HH:MM for lock-screen mockups. */
export function useLocalLockScreen(tickMs = 1000): LockScreenClock {
  const [clock, setClock] = useState<LockScreenClock>(FALLBACK);

  useEffect(() => {
    const tick = () => setClock(readClock(new Date()));
    tick();
    const id = setInterval(tick, tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  return clock;
}
