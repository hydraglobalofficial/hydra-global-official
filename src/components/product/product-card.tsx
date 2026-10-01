"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Badge, Rating } from "@/components/ui/primitives";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/server/queries/catalog";
import { ProductImage } from "./product-image";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const [primary, secondary] = product.images;
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
    <Link
      href={`/product/${product.slug}`}
      className="card-premium group flex h-full flex-col overflow-hidden rounded-3xl hover:shadow-[0_30px_70px_-25px_rgba(30,64,175,0.4)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#1a1a22_0%,#08080b_72%)]">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_50%,#000,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-8 bottom-6 h-10 rounded-full bg-accent/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {primary && (
          <ProductImage
            src={primary.url}
            alt={primary.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
            className={cn(
              "object-contain p-8 transition-all duration-700 group-hover:scale-105",
              secondary && "group-hover:opacity-0",
            )}
          />
        )}
        {secondary && (
          <ProductImage
            src={secondary.url}
            alt={secondary.alt}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-8 opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {soldOut ? <Badge tone="danger">Sold out</Badge> : off > 0 && <Badge tone="accent">-{off}%</Badge>}
          {product.featured && !soldOut && <Badge>Bestseller</Badge>}
        </div>
        <span className="absolute right-4 top-4 grid size-9 translate-y-1 place-items-center rounded-full border border-line bg-black/60 text-fg opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{product.category.name}</p>
        <h3 className="line-clamp-2 font-medium leading-snug text-fg transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        {product.ratingCount > 0 && <Rating value={product.ratingAverage} count={product.ratingCount} size={12} />}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-mono text-lg tabular-nums">{formatPrice(product.price)}</span>
          {off > 0 && (
            <span className="font-mono text-sm text-subtle line-through tabular-nums">
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
    <motion.div
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ staggerChildren: 0.06 }}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </motion.div>
  );
}
