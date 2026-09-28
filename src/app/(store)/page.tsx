import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/product/product-card";
import { Hero } from "@/components/sections/hero";
import { TrustBadges } from "@/components/sections/trust-badges";
import { DeviceFinder } from "@/components/sections/device-finder";
import { ClarityCompare } from "@/components/sections/clarity-compare";
import {
  CategoryShowcase,
  NewsletterBlock,
  ShopByDevice,
  TechGrid,
  Testimonials,
} from "@/components/sections/home-sections";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { getFeaturedProducts, getNavigationData } from "@/server/queries/catalog";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, nav] = await Promise.all([getFeaturedProducts(8), getNavigationData()]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />

      <section className="container-page py-16">
        <TrustBadges />
      </section>

      <section className="container-page">
        <DeviceFinder devices={nav.devices} />
      </section>

      <CategoryShowcase categories={nav.categories} />

      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Bestsellers"
          title="The armor everyone's talking about."
          action={
            <ButtonLink href="/shop" variant="outline">
              View all <ArrowRight size={16} />
            </ButtonLink>
          }
        />
        <ProductGrid products={featured} priorityCount={4} />
      </section>

      <ClarityCompare />
      <ShopByDevice devices={nav.devices} />
      <TechGrid />
      <Testimonials />
      <NewsletterBlock />
    </>
  );
}
