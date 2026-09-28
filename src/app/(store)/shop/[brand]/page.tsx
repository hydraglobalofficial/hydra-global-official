import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/primitives";
import { ShopView } from "@/components/shop/shop-view";
import { brands, isBrandSlug } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return Object.keys(brands).map((brand) => ({ brand }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/shop/[brand]">): Promise<Metadata> {
  const { brand } = await params;
  if (!isBrandSlug(brand)) return {};
  const { label } = brands[brand];
  return {
    title: `${label} Screen Protectors & Accessories`,
    description: `Shop HYDRA tempered glass, privacy screens and camera protection for ${label}. ${brands[brand].blurb}`,
    alternates: { canonical: `/shop/${brand}` },
  };
}

export default async function BrandShopPage({ params, searchParams }: PageProps<"/shop/[brand]">) {
  const { brand } = await params;
  if (!isBrandSlug(brand)) notFound();
  const sp = await searchParams;
  const { label, blurb } = brands[brand];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: label, path: `/shop/${brand}` },
        ])}
      />
      <PageHeader eyebrow={`Shop · ${label}`} title={`${label} protection`} description={blurb} />
      <ShopView params={sp} brand={brand} />
    </>
  );
}
