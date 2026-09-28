import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";
import { TrackEvent } from "@/components/analytics/track-event";
import { ProductGrid } from "@/components/product/product-card";
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
    <div className="container-page py-16">
      {query && <TrackEvent key={query} event="search" payload={{ searchTerm: query }} />}
      <Form action="/search" className="border-gradient mx-auto flex max-w-3xl items-center gap-3 rounded-full p-2 pl-6">
        <Search size={20} className="text-accent" />
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search products or devices"
          aria-label="Search"
          className="h-12 flex-1 bg-transparent text-lg placeholder:text-subtle focus:outline-none"
        />
        <button type="submit" className={buttonStyles({ size: "md" })}>Search</button>
      </Form>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-fg">
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-14">
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
