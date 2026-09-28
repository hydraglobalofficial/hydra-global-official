import Link from "next/link";

type Announcement = { id: string; message: string; href: string | null };

const MIN_ITEMS = 8;

export function AnnouncementBar({ items }: { items: Announcement[] }) {
  if (items.length === 0) return null;

  const repeated = Array.from({ length: Math.ceil(MIN_ITEMS / items.length) }, () => items).flat();

  const track = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {repeated.map((item, i) => (
        <li key={`${item.id}-${i}`} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              tabIndex={hidden ? -1 : undefined}
              className="px-6 font-medium uppercase tracking-[0.18em] transition-colors hover:text-accent"
            >
              {item.message} <span className="text-accent">→</span>
            </Link>
          ) : (
            <span className="px-6 font-medium uppercase tracking-[0.18em]">{item.message}</span>
          )}
          <span aria-hidden className="text-accent/70">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group relative z-50 overflow-hidden border-b border-accent/15 bg-[linear-gradient(90deg,#021a22,#07091a_40%,#120a2a_70%,#021a22)] text-[11px] text-fg/90">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#021a22] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#021a22] to-transparent" />
      <div className="flex h-9 w-max animate-marquee items-center group-hover:[animation-play-state:paused] [animation-duration:60s]">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
