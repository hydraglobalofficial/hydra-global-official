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
import { Reveal } from "@/components/motion/reveal";
import { HydraRise } from "@/components/hydra/hydra-rise";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, nav] = await Promise.all([getFeaturedProducts(8), getNavigationData()]);

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
      <CollectionBento categories={nav.categories} />
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
      <HowItWorks />
      <NewsletterBlock />
    </>
  );
}
