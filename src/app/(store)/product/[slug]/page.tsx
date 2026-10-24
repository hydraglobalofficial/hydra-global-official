import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, PlayCircle, Smartphone } from "lucide-react";
import { TrackEvent } from "@/components/analytics/track-event";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductGrid } from "@/components/product/product-card";
import { ReviewForm } from "@/components/product/review-form";
import { TrustBadges } from "@/components/sections/trust-badges";
import { Badge, Rating, SectionHeading } from "@/components/ui/primitives";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getActiveProductSlugs, getProductBySlug, getRelatedProducts } from "@/server/queries/catalog";
import { getCurrencyContent, getShippingContent } from "@/server/queries/content";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getActiveProductSlugs();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline ?? product.description.slice(0, 155),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline ?? undefined,
      images: product.images.slice(0, 1).map((i) => ({ url: i.url, alt: i.alt })),
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const focusDeviceSlug = typeof sp.device === "string" ? sp.device.trim() : "";
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, currency, shipping] = await Promise.all([
    getRelatedProducts(product),
    getCurrencyContent(),
    getShippingContent(),
  ]);
  const specs = Object.entries((product.specs ?? {}) as Record<string, string>);
  const brand = product.devices[0]?.device.brandSlug ?? "iphone";
  const visibleDevices = focusDeviceSlug
    ? product.devices.filter(({ device }) => device.slug === focusDeviceSlug)
    : product.devices;
  const devicesForCompat = visibleDevices.length > 0 ? visibleDevices : product.devices;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      <JsonLd
        data={[
          productJsonLd({
            ...product,
            images: product.images.map((i) => i.url),
            priceCurrency: currency.code,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.category.name, path: `/shop?category=${product.category.slug}` },
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]}
      />

      <div className="container-page py-5 sm:py-8">
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href="/" className="hover:text-fg">Home</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href="/shop" className="hover:text-fg">Shop</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-fg">{product.category.name}</Link>
          <ChevronRight size={12} className="hidden shrink-0 sm:inline" />
          <span className="hidden max-w-[12rem] truncate text-fg sm:inline md:max-w-none">{product.name}</span>
        </nav>
      </div>

      <section className="container-page grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="min-w-0 space-y-7 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{product.category.name}</Badge>
              {product.featured && <Badge>Bestseller</Badge>}
            </div>
            <h1 className="text-lg font-semibold leading-snug tracking-tight text-balance sm:text-xl md:text-2xl">{product.name}</h1>
            {product.ratingCount > 0 && (
              <a href="#reviews" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
                <Rating value={product.ratingAverage} size={14} />
                {product.ratingAverage.toFixed(1)} · {product.ratingCount} reviews
              </a>
            )}
            {product.tagline && <p className="text-lg text-muted">{product.tagline}</p>}
          </div>

          <TrackEvent key={product.id} event="view_item" payload={{ items: [{ id: product.id, name: product.name, price: product.price }] }} />
          <PurchasePanel
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              stock: product.stock,
              image: product.images[0]?.url ?? null,
            }}
            variants={product.variants.map((v) => ({ id: v.id, name: v.name, priceOverride: v.priceOverride, stock: v.stock }))}
            devices={product.devices.map(({ device }) => ({ slug: device.slug, model: device.model }))}
            focusDeviceSlug={focusDeviceSlug || null}
          />

          {product.highlights.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="glass flex items-start gap-3 rounded-2xl p-4 text-sm">
                  <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" /> {h}
                </li>
              ))}
            </ul>
          )}

          {devicesForCompat.length > 0 && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                <Smartphone size={14} /> Compatible with
              </p>
              <div className="flex flex-wrap gap-2">
                {devicesForCompat.map(({ device }) => (
                  <span key={device.slug} className="rounded-full border border-line px-3 py-1.5 text-xs">{device.model}</span>
                ))}
              </div>
            </div>
          )}

          <Link href={`/installation/${brand}`} className="glass flex items-center justify-between rounded-2xl p-5 transition-colors hover:border-accent/30">
            <span className="flex items-center gap-3">
              <PlayCircle className="text-accent" />
              <span>
                <span className="block text-sm font-medium">Installation guide</span>
                <span className="text-xs text-muted">Bubble-free in under 2 minutes</span>
              </span>
            </span>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 sm:gap-10 sm:py-20 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0 space-y-4">
          <h2 className="text-xl font-semibold sm:text-2xl">About this product</h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            {product.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        {specs.length > 0 && (
          <div className="min-w-0 space-y-4">
            <h2 className="text-xl font-semibold sm:text-2xl">Specifications</h2>
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 bg-surface px-4 py-3.5 text-sm sm:grid-cols-2 sm:gap-4 sm:px-5 sm:py-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="min-w-0 break-words font-mono">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      <section className="container-page">
        <TrustBadges shipping={shipping} />
      </section>

      <section id="reviews" className="container-page scroll-mt-28 py-14 sm:py-20 md:py-24">
        <SectionHeading eyebrow="Reviews" title="What owners say" />
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <p className="font-mono text-5xl font-semibold">{product.ratingAverage.toFixed(1)}</p>
              <Rating value={product.ratingAverage} size={16} />
              <p className="mt-2 text-sm text-muted">Based on {product.ratingCount} reviews</p>
              <div className="mt-6 space-y-2">
                {distribution.map(({ star, count }) => {
                  const total = product.reviews.length || 1;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs text-muted">
                      <span className="w-3 font-mono">{star}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                      <span className="w-6 text-right font-mono">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <details className="glass rounded-3xl p-6">
              <summary className="cursor-pointer text-sm font-medium">Write a review</summary>
              <div className="mt-6">
                <ReviewForm productId={product.id} />
              </div>
            </details>
          </div>

          <div className="divide-y divide-line">
            {product.reviews.length === 0 && <p className="text-muted">No reviews yet — be the first.</p>}
            {product.reviews.map((r) => (
              <article key={r.id} className="py-6 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Rating value={r.rating} size={13} />
                  <time className="text-xs text-subtle" dateTime={new Date(r.createdAt).toISOString()}>{formatDate(r.createdAt)}</time>
                </div>
                {r.title && <h3 className="mt-3 font-medium">{r.title}</h3>}
                <p className="mt-2 leading-relaxed text-muted">{r.comment}</p>
                <p className="mt-3 flex items-center gap-2 text-xs text-subtle">
                  {r.authorName}
                  {r.verified && (
                    <span className="flex items-center gap-1 text-success">
                      <BadgeCheck size={12} /> Verified buyer
                    </span>
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page pb-12">
          <SectionHeading eyebrow="You may also like" title="Complete your setup" />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
