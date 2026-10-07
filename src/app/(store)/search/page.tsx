import type { Metadata } from "next";
import Link from "next/link";
import { TrackEvent } from "@/components/analytics/track-event";
import { ProductGrid } from "@/components/product/product-card";
import { SearchForm } from "@/components/search/search-form";
import { EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button";
import { searchProducts } from "@/server/queries/catalog";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: typeof q === "string" && q ? `Search: ${q}` : "Search",
    robots: { index: false, follow: true },
  };
}

const suggestions = ["Privacy", "iPhone 17 Pro Max", "Galaxy S25 Ultra", "Camera lens", "Matte"];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="container-page py-10 sm:py-16">
      {query && <TrackEvent key={query} event="search" payload={{ searchTerm: query }} />}
      <SearchForm key={query || "empty"} defaultQuery={query} />

      <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2 sm:mt-6">
        {suggestions.map((s) => (
          <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-muted hover:border-accent/40 hover:text-fg">
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-10 sm:mt-14">
        {query && (
          <p className="mb-6 text-sm text-muted">
            <span className="font-mono text-fg">{results.length}</span> result{results.length === 1 ? "" : "s"} for “{query}”
          </p>
        )}
        {query && results.length === 0 ? (
          <EmptyState
            title="No matches found"
            description="Try a device model like “iPhone 16” or a product type like “privacy”."
            action={<Link href="/shop" className={buttonStyles({ variant: "outline", size: "sm" })}>Browse all products</Link>}
          />
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </div>
  );
}
