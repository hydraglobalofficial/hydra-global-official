import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/product/product-card";
import { Hero } from "@/components/sections/hero";
import { DeviceFinder } from "@/components/sections/device-finder";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { SectionDivider } from "@/components/ui/section-divider";
import { ShopByDevice } from "@/components/sections/home-sections";
import { CollectionBento } from "@/components/sections/collection-bento";
import { HomeBelowFold } from "@/components/sections/home-below-fold";
import { HydraRise } from "@/components/hydra/hydra-rise-lazy";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { getFeaturedProducts, getNavigationData } from "@/server/queries/catalog";
import { defaultCollectionsContent, defaultHomeHeroContent } from "@/content/site-sections";
import {
  getCollectionsContent,
  getHomeHeroContent,
  getHowItWorksContent,
  getNewsletterContent,
} from "@/server/queries/content";
import { Reveal } from "@/components/motion/reveal";

/** Longer ISR — catalog/CMS tags still purge on publish. */
export const revalidate = 900;

export default async function HomePage() {
  const [featured, nav, collections, howItWorks, newsletter, hero] = await Promise.all([
    getFeaturedProducts(8),
    getNavigationData(),
    getCollectionsContent(),
    getHowItWorksContent(),
    getNewsletterContent(),
    getHomeHeroContent(),
  ]);
  const collectionsContent = collections ?? defaultCollectionsContent;
  const heroContent = hero ?? defaultHomeHeroContent;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero content={heroContent} />
      <div id="explore" className="mt-16 scroll-mt-24">
        <BrandMarquee />
      </div>

      <HydraRise />

      <Reveal className="container-page pt-16">
        <DeviceFinder devices={nav.devices} />
      </Reveal>

      <ShopByDevice devices={nav.devices} />
      <SectionDivider />
      <CollectionBento content={collectionsContent} />

      <HomeBelowFold
        howItWorks={howItWorks}
        newsletter={newsletter}
        bestsellers={
          <section className="container-page py-24">
            <SectionHeading
              eyebrow="Bestsellers"
              title={
                <>
                  The armor everyone&apos;s <span className="text-muted">talking about.</span>
                </>
              }
              action={
                <ButtonLink href="/shop" variant="outline">
                  View all <ArrowRight size={16} />
                </ButtonLink>
              }
            />
            <ProductGrid products={featured} priorityCount={2} />
          </section>
        }
      />
    </>
  );
}
