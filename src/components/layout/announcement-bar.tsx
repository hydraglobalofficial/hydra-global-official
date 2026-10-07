import Link from "next/link";
import { safeInternalHref } from "@/lib/content-safety";

type Announcement = { id: string; message: string; href: string | null };

const MIN_ITEMS = 8;

export function AnnouncementBar({ items }: { items: Announcement[] }) {
  if (items.length === 0) return null;

  const repeated = Array.from({ length: Math.ceil(MIN_ITEMS / items.length) }, () => items).flat();

  const track = (hidden: boolean, suffix: string) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {repeated.map((item, i) => (
        <li key={`${suffix}-${item.id}-${i}`} className="flex items-center">
          {item.href && safeInternalHref(item.href, "") ? (
            <Link
              href={safeInternalHref(item.href)}
              tabIndex={hidden ? -1 : 0}
              className="inline-flex items-center px-5 py-2 font-medium uppercase tracking-[0.18em] transition-colors hover:text-accent sm:px-6"
            >
              {item.message} <span className="ml-1 text-accent">→</span>
            </Link>
          ) : (
            <span className="inline-flex items-center px-5 py-2 font-medium uppercase tracking-[0.18em] sm:px-6">{item.message}</span>
          )}
          <span aria-hidden className="inline-flex items-center text-accent/70">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    /* z below header so mobile drawer (inside header) can cover this bar */
    <div className="group relative z-30 overflow-hidden border-b border-line bg-surface pt-[env(safe-area-inset-top,0px)] text-[11px] leading-none text-fg/90">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface to-transparent sm:w-16" />
      <div className="flex h-9 w-max animate-marquee items-center group-hover:[animation-play-state:paused] [animation-duration:60s]">
        {track(false, "a")}
        {track(true, "b")}
      </div>
    </div>
  );
}
