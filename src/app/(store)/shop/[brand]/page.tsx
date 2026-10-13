import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/primitives";
import { ShopView } from "@/components/shop/shop-view";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getBrandBySlug, getBrands } from "@/server/queries/catalog";

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ brand: brand.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps<"/shop/[brand]">): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.label} Screen Protectors & Accessories`,
    description: `Shop HYDRA tempered glass, privacy screens and camera protection for ${brand.label}. ${brand.blurb}`,
    alternates: { canonical: `/shop/${brand.slug}` },
  };
}

export default async function BrandShopPage({ params, searchParams }: PageProps<"/shop/[brand]">) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  const sp = await searchParams;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: brand.label, path: `/shop/${brand.slug}` },
        ])}
      />
      <PageHeader eyebrow={`Shop · ${brand.label}`} title={`${brand.label} protection`} description={brand.blurb} />
      <ShopView params={sp} brand={brand.slug} />
    </>
  );
}
