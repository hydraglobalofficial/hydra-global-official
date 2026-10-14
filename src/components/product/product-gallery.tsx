"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

type GalleryImage = { id: string; url: string; alt: string };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const total = images.length;
  const current = images[active];

  const go = (dir: -1 | 1) => {
    if (total < 2) return;
    setActive((i) => (i + dir + total) % total);
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
      <div className="relative aspect-square min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        {total > 1 ? (
          <p className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full border border-line/60 bg-bg/70 px-2.5 py-1 font-mono text-[10px] tabular-nums tracking-wide text-muted backdrop-blur-sm sm:top-4 sm:text-[11px]">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        ) : null}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-3 z-10 grid size-9 place-items-center rounded-full border border-line/60 bg-bg/70 text-fg backdrop-blur-sm transition-colors hover:bg-surface sm:left-3 sm:top-4 sm:size-10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-3 z-10 grid size-9 place-items-center rounded-full border border-line/60 bg-bg/70 text-fg backdrop-blur-sm transition-colors hover:bg-surface sm:right-3 sm:top-4 sm:size-10"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}

        {current ? (
          <ProductImage
            key={current.id}
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain animate-fade-up"
          />
        ) : null}
      </div>

      {total > 1 ? (
        <div
          className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-0.5"
          role="tablist"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl border transition-all sm:size-20 sm:rounded-2xl",
                i === active ? "border-accent/70" : "border-line opacity-60 hover:opacity-100",
              )}
            >
              <ProductImage src={img.url} alt={img.alt} fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
