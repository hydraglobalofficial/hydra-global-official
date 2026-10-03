import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/product/product-card";
import { Hero } from "@/components/sections/hero";
import { DeviceFinder } from "@/components/sections/device-finder";
import { ClarityCompare } from "@/components/sections/clarity-compare";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { SectionDivider } from "@/components/ui/section-divider";
import { HowItWorks, NewsletterBlock, ShopByDevice, TechGrid } from "@/components/sections/home-sections";
import { Testimonials } from "@/components/sections/testimonials-carousel";
import { CollectionBento, DropTest, ImpactStat, VideoShowcase } from "@/components/sections/showcase-sections";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { getFeaturedProducts, getNavigationData } from "@/server/queries/catalog";
import { defaultCollectionsContent } from "@/content/site-sections";
import { getCollectionsContent, getHowItWorksContent, getNewsletterContent } from "@/server/queries/content";
import { Reveal } from "@/components/motion/reveal";
import { HydraRise } from "@/components/hydra/hydra-rise";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, nav, collections, howItWorks, newsletter] = await Promise.all([
    getFeaturedProducts(8),
    getNavigationData(),
    getCollectionsContent(),
    getHowItWorksContent(),
    getNewsletterContent(),
  ]);
  const collectionsContent = collections ?? defaultCollectionsContent;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
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
      <ImpactStat />
      <DropTest />

      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Bestsellers"
          title={<>The armor everyone&apos;s <span className="text-muted">talking about.</span></>}
          action={
            <ButtonLink href="/shop" variant="outline">
              View all <ArrowRight size={16} />
            </ButtonLink>
          }
        />
        <ProductGrid products={featured} priorityCount={4} />
      </section>

      <SectionDivider />
      <Reveal><ClarityCompare /></Reveal>
      <Testimonials />
      <VideoShowcase />
      <SectionDivider />
      <TechGrid />
      <HowItWorks content={howItWorks} />
      <NewsletterBlock content={newsletter} />
    </>
  );
}
