import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { ShopView } from "@/components/shop/shop-view";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Tempered glass, privacy screens, camera lens armor and cases for iPhone and Samsung Galaxy.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }])} />
      <PageHeader
        eyebrow="Shop"
        title="All products"
        description="Precision-cut protection for every flagship. Filter by device, category or price."
      />
      <ShopView params={params} />
    </>
  );
}
