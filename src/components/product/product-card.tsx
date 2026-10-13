"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Badge, Rating } from "@/components/ui/primitives";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/server/queries/catalog";
import { ProductImage } from "./product-image";

const FALLBACK_SRC = "/products/glass-clear.jpg";

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const reduce = useReducedMotion();
  const [primary, secondary] = product.images;
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;
  const primarySrc = primary?.url?.trim() || FALLBACK_SRC;
  const primaryAlt = primary?.alt || product.name;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "80px 0px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="card-premium group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
      >
        <div className="product-media-stage relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#1a1a22_0%,#08080b_72%)]">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_50%,#000,transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-8 bottom-6 h-10 rounded-full bg-accent/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <ProductImage
            src={primarySrc}
            alt={primaryAlt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
            className={cn(
              "product-media-art object-contain p-2.5 transition-all duration-700 group-hover:scale-105 sm:p-4",
              secondary && "group-hover:opacity-0",
            )}
          />
          {secondary?.url ? (
            <ProductImage
              src={secondary.url}
              alt={secondary.alt || product.name}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
              className="product-media-art object-contain p-2.5 opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 sm:p-4"
            />
          ) : null}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
            {soldOut ? <Badge tone="danger">Sold out</Badge> : off > 0 && <Badge tone="accent">-{off}%</Badge>}
            {product.featured && !soldOut && <Badge>Bestseller</Badge>}
          </div>
          <span className="absolute right-4 top-4 hidden size-9 translate-y-1 place-items-center rounded-full border border-line bg-black/60 text-fg opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:grid">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3.5 sm:gap-2 sm:p-5">
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-subtle sm:text-[10px] sm:tracking-[0.2em]">{product.category.name}</p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-fg transition-colors group-hover:text-accent sm:text-base">
            {product.name}
          </h3>
          {product.ratingCount > 0 && <Rating value={product.ratingAverage} count={product.ratingCount} size={12} />}
          <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-1.5 pt-1.5 sm:gap-2 sm:pt-2">
            <span className="font-mono text-base tabular-nums sm:text-lg">{formatPrice(product.price)}</span>
            {off > 0 && (
              <span className="font-mono text-xs text-subtle line-through tabular-nums sm:text-sm">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: ProductCardData[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
