"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

type GalleryImage = { id: string; url: string; alt: string };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:flex-col" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-surface-2 transition-all",
                i === active ? "border-accent/70 shadow-[0_0_24px_-6px_var(--color-accent)]" : "border-line opacity-60 hover:opacity-100",
              )}
            >
              <ProductImage src={img.url} alt={img.alt} fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_35%,#18181e_0%,#050506_70%)]">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-x-1/4 bottom-10 h-16 rounded-full bg-accent/25 blur-3xl animate-pulse-glow" />
        {current && (
          <ProductImage
            key={current.id}
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-10 animate-fade-up"
          />
        )}
      </div>
    </div>
  );
}
