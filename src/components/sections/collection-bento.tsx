import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductImage } from "@/components/product/product-image";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { defaultCollectionsContent, type CollectionsContent } from "@/content/site-sections";
import { cn } from "@/lib/utils";

/** Server-rendered homepage bento — CMS-driven via `home.collections`. */
export function CollectionBento({ content }: { content?: CollectionsContent | null }) {
  const section = {
    ...defaultCollectionsContent,
    ...content,
    items:
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : defaultCollectionsContent.items,
  };
  const items = section.items.slice(0, 8);

  return (
    <section className="container-page py-14 sm:py-20 md:py-24">
      <SectionHeading
        eyebrow={section.eyebrow}
        title={
          <>
            {section.title} <span className="text-muted">{section.titleMuted}</span>
          </>
        }
        action={
          <Link
            href={section.ctaHref}
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            {section.ctaLabel} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
      <RevealGroup
        className="grid auto-rows-[13rem] gap-3 sm:auto-rows-[15rem] sm:gap-4 md:grid-cols-4 md:auto-rows-[17rem]"
        stagger={0.08}
      >
        {items.map((c, i) => {
          const hero = i === 0;
          const index = String(i + 1).padStart(2, "0");
          return (
            <RevealItem key={`${c.slug}-${i}`} className={cn("h-full min-w-0", hero && "md:col-span-2 md:row-span-2")}>
              <SpotlightCard className="bento-fill group h-full overflow-hidden">
                <Link href={`/shop?category=${c.slug}`} className="relative block h-full">
                  {c.image ? (
                    <ProductImage
                      src={c.image}
                      alt=""
                      fill
                      sizes={hero ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                      className="object-cover"
                      priority={hero}
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:gap-4 sm:p-5 md:p-6">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{index}</p>
                      <h3
                        className={cn(
                          "mt-1.5 font-semibold tracking-tight text-balance text-white sm:mt-2",
                          hero ? "text-2xl sm:text-4xl md:text-5xl" : "text-lg sm:text-2xl",
                        )}
                      >
                        {c.name}
                      </h3>
                      {hero && c.description ? (
                        <p className="mt-2 hidden max-w-sm text-sm text-white/80 sm:mt-3 sm:block">{c.description}</p>
                      ) : null}
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/40 bg-black/30 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#0a0a0c] sm:size-10">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
