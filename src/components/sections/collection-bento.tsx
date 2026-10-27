import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { defaultCollectionsContent, type CollectionsContent } from "@/content/site-sections";
import { cn } from "@/lib/utils";
import { CollectionCard } from "./collection-card";

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
    <section className="py-14 sm:py-20 md:py-24">
      <div className="container-page">
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
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-pl-4 px-4 pb-1 touch-pan-x md:hidden">
        {items.map((c, i) => (
          <CollectionCard
            key={`${c.slug}-${i}`}
            item={c}
            index={i}
            className="aspect-[4/5] w-[78vw] max-w-[21rem] shrink-0 snap-start"
          />
        ))}
      </div>
      <RevealGroup
        className="container-page hidden auto-rows-[17rem] grid-cols-4 gap-4 md:grid"
        stagger={0.08}
      >
        {items.map((c, i) => {
          const hero = i === 0;
          return (
            <RevealItem key={`${c.slug}-${i}`} className={cn("h-full min-w-0", hero && "col-span-2 row-span-2")}>
              <CollectionCard item={c} index={i} hero={hero} />
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
