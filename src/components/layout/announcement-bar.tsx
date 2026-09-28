"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Announcement = { id: string; message: string; href: string | null };

const INTERVAL_MS = 4500;

export function AnnouncementBar({ items }: { items: Announcement[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [items.length, paused]);

  if (items.length === 0) return null;
  const step = (dir: 1 | -1) => setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <div
      className="relative z-50 border-b border-line bg-[linear-gradient(90deg,#03141a,#0a0a14,#0d0820)] text-xs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page flex h-10 items-center justify-between gap-4">
        <button type="button" onClick={() => step(-1)} className="text-muted hover:text-fg" aria-label="Previous announcement">
          <ChevronLeft size={14} />
        </button>
        <div className="relative h-full flex-1 overflow-hidden" aria-live="polite">
          {items.map((item, i) => {
            const content = (
              <span className="tracking-wide">
                {item.message}
                {item.href && <span className="ml-2 text-accent underline-offset-4 group-hover:underline">Shop now →</span>}
              </span>
            );
            return (
              <div
                key={item.id}
                className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                style={{
                  opacity: i === index ? 1 : 0,
                  transform: `translateY(${i === index ? 0 : i < index ? -100 : 100}%)`,
                }}
                aria-hidden={i !== index}
              >
                {item.href ? (
                  <Link href={item.href} className="group" tabIndex={i === index ? 0 : -1}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => step(1)} className="text-muted hover:text-fg" aria-label="Next announcement">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
