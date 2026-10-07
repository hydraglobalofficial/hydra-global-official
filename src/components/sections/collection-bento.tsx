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
  const items = section.items.slice(0, 5);

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
              <SpotlightCard className="group h-full overflow-hidden">
                <Link href={`/shop?category=${c.slug}`} className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                  {c.image && (
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.03]",
                        hero ? "bottom-20 sm:bottom-24" : "bottom-14 sm:bottom-16",
                      )}
                    >
                      <ProductImage
                        src={c.image}
                        alt=""
                        fill
                        sizes={hero ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                        className="object-contain p-3 opacity-90 sm:p-4"
                        priority={hero}
                      />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/75 to-transparent" />
                  <div className="relative flex items-end justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">{index}</p>
                      <h3
                        className={cn(
                          "mt-1.5 font-semibold tracking-tight text-balance sm:mt-2",
                          hero ? "text-2xl sm:text-4xl md:text-5xl" : "text-lg sm:text-2xl",
                        )}
                      >
                        {c.name}
                      </h3>
                      {hero && c.description ? (
                        <p className="mt-2 hidden max-w-sm text-sm text-muted sm:mt-3 sm:block">{c.description}</p>
                      ) : null}
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-white/5 transition-colors duration-300 group-hover:border-fg/40 group-hover:bg-fg group-hover:text-bg sm:size-10">
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
