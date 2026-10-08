"use client";

import { useEffect, useState } from "react";
import type { WhatsappWidgetContent } from "@/content/site-sections";
import { cn } from "@/lib/utils";

/**
 * Right-side chat float: rotating staff portraits only (no WhatsApp glyph).
 * Dimensions use inline styles — arbitrary Tailwind size utilities were compiling to 0×0.
 */
export function WhatsappFloat({ content }: { content: WhatsappWidgetContent }) {
  const staff = content.staff.filter((s) => s.image);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (staff.length < 2) return;
    const ms = Math.min(8, Math.max(2, content.rotateSeconds)) * 1000;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % staff.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [staff.length, content.rotateSeconds]);

  if (!content.enabled || staff.length === 0 || !content.phone) return null;

  const href = `https://wa.me/${content.phone}?text=${encodeURIComponent(content.message || "Hi HYDRA!")}`;
  const active = staff[index] ?? staff[0];
  const label = active?.name ? `Chat with ${active.name}` : "Chat with HYDRA support";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        "group fixed z-40 block rounded-full",
        "transition-transform duration-300 hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      )}
      style={{
        width: 62,
        height: 62,
        bottom: "max(1.1rem, calc(env(safe-area-inset-bottom, 0px) + 0.85rem))",
        right: "max(0.9rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-sky-400/30 blur-md transition-opacity duration-500 group-hover:bg-sky-300/40"
        style={{ inset: -8 }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-sky-400/15"
      />

      <span
        className="relative block size-full overflow-hidden rounded-full bg-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.55)] ring-2 ring-white/25"
      >
        {staff.map((person, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- CMS/R2 URLs for float avatars
          <img
            key={`${person.image}-${i}`}
            src={person.image}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
            draggable={false}
          />
        ))}
      </span>
    </a>
  );
}
