"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

type GalleryImage = { id: string; url: string; alt: string };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 sm:gap-4 md:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-0.5 md:mx-0 md:flex-col md:gap-3 md:overflow-visible md:px-0" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl border bg-surface-2 transition-all sm:size-20 sm:rounded-2xl",
                i === active ? "border-accent/70" : "border-line opacity-60 hover:opacity-100",
              )}
            >
              <ProductImage src={img.url} alt={img.alt} fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_35%,#18181e_0%,#050506_70%)] sm:rounded-3xl">
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
            className="object-contain p-6 animate-fade-up sm:p-10"
          />
        )}
      </div>
    </div>
  );
}
