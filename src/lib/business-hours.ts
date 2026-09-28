import { siteConfig } from "@/config/site";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export type BusinessStatus = { open: boolean; day: number; localTime: string; nextOpen: string | null };

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:00 ${suffix}`;
}

/** Open/closed state in the business's own time zone, independent of the visitor's clock. */
export function getBusinessStatus(now = new Date()): BusinessStatus {
  const { timeZone, open, close } = siteConfig.businessHours;
  const days: readonly number[] = siteConfig.businessHours.days;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const day = WEEKDAY_INDEX[parts.weekday];
  const hour = Number(parts.hour);
  const localTime = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(now);

  const isOpen = days.includes(day) && hour >= open && hour < close;
  if (isOpen) return { open: true, day, localTime, nextOpen: null };

  for (let offset = 0; offset < 8; offset++) {
    const candidate = (day + offset) % 7;
    if (!days.includes(candidate)) continue;
    if (offset === 0 && hour >= open) continue;
    const label = offset === 0 ? "today" : offset === 1 ? "tomorrow" : DAY_NAMES[candidate];
    return { open: false, day, localTime, nextOpen: `${label} at ${formatHour(open)}` };
  }
  return { open: false, day, localTime, nextOpen: null };
}
