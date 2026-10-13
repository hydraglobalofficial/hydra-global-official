import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button";
import type { BrandSlug } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  getNavigationData,
  listProducts,
  sortOptions,
  type ProductFilters,
  type ProductSort,
} from "@/server/queries/catalog";
import { ShopFilters } from "./shop-filters";

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const toInt = (v: string | undefined) => {
  const n = v ? Number.parseInt(v, 10) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseShopParams(params: RawParams, brand?: BrandSlug): ProductFilters {
  const sort = first(params.sort) as ProductSort | undefined;
  return {
    brand,
    category: first(params.category),
    device: first(params.device),
    minPrice: toInt(first(params.min)),
    maxPrice: toInt(first(params.max)),
    inStock: first(params.stock) === "1",
    sort: sortOptions.some((o) => o.value === sort) ? sort : "featured",
    page: toInt(first(params.page)) || 1,
  };
}

function pageHref(base: string, params: RawParams, page: number) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const value = first(v);
    if (value && k !== "page") sp.set(k, value);
  }
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function ShopView({ params, brand }: { params: RawParams; brand?: BrandSlug }) {
  const filters = parseShopParams(params, brand);
  const base = brand ? `/shop/${brand}` : "/shop";
  const [result, nav] = await Promise.all([listProducts(filters), getNavigationData()]);
  const devices = brand ? nav.devices.filter((d) => d.brandSlug === brand) : nav.devices;

  return (
    <div className="container-page grid gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <details className="group glass rounded-2xl p-4 sm:p-5 lg:!block lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none" open>
          <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-medium lg:hidden">Filter &amp; sort</summary>
          <div className="mt-6 lg:mt-0">
            <ShopFilters
              key={JSON.stringify(filters)}
              action={base}
              categories={nav.categories}
              devices={devices}
              sortOptions={sortOptions}
              current={filters}
            />
          </div>
        </details>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-3 text-sm text-muted sm:mb-6">
          <p>
            <span className="font-mono text-fg">{result.total}</span> product{result.total === 1 ? "" : "s"}
          </p>
          {result.pageCount > 1 && (
            <p className="font-mono text-xs">
              Page {result.page} / {result.pageCount}
            </p>
          )}
        </div>

        {result.items.length === 0 ? (
          <EmptyState
            title="No products match these filters"
            description="Try removing a filter or browsing another device."
            action={
              <Link href={base} className={buttonStyles({ variant: "outline", size: "sm" })}>
                Clear filters
              </Link>
            }
          />
        ) : (
          <ProductGrid products={result.items} priorityCount={4} />
        )}

        {result.pageCount > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            <Link
              href={pageHref(base, params, result.page - 1)}
              aria-disabled={result.page <= 1}
              className={cn(buttonStyles({ variant: "outline", size: "icon" }), result.page <= 1 && "pointer-events-none opacity-30")}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </Link>
            {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(base, params, p)}
                aria-current={p === result.page ? "page" : undefined}
                className={cn(buttonStyles({ variant: p === result.page ? "primary" : "ghost", size: "icon" }), "font-mono text-sm")}
              >
                {p}
              </Link>
            ))}
            <Link
              href={pageHref(base, params, result.page + 1)}
              aria-disabled={result.page >= result.pageCount}
              className={cn(buttonStyles({ variant: "outline", size: "icon" }), result.page >= result.pageCount && "pointer-events-none opacity-30")}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
