import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

export type CollectionCardItem = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export function CollectionCard({
  item,
  index,
  hero = false,
  className,
}: {
  item: CollectionCardItem;
  index: number;
  hero?: boolean;
  className?: string;
}) {
  const label = String(index + 1).padStart(2, "0");
  return (
    <div className={cn("h-full min-w-0", className)}>
      <SpotlightCard className="bento-fill group h-full overflow-hidden">
        <Link href={`/shop?category=${item.slug}`} className="relative block h-full">
          {item.image ? (
            <ProductImage
              src={item.image}
              alt=""
              fill
              sizes={hero ? "(min-width: 768px) 50vw, 70vw" : "(min-width: 768px) 25vw, 70vw"}
              className="object-cover"
              priority={hero && index === 0}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:gap-4 sm:p-5 md:p-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{label}</p>
              <h3
                className={cn(
                  "mt-1.5 font-semibold tracking-tight text-balance text-white sm:mt-2",
                  hero ? "text-2xl sm:text-4xl md:text-5xl" : "text-lg sm:text-2xl",
                )}
              >
                {item.name}
              </h3>
              {hero && item.description ? (
                <p className="mt-2 hidden max-w-sm text-sm text-white/80 sm:mt-3 sm:block">{item.description}</p>
              ) : null}
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/40 bg-black/30 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#0a0a0c] sm:size-10">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
      </SpotlightCard>
    </div>
  );
}
