import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { BrandRecord, BrandSlug } from "@/config/site";
import { publicProductCard, publicStock } from "@/lib/public-data";

export const CATALOG_TAG = "catalog";
export const CONTENT_TAG = "content";

function toBrandRecord(row: {
  id: string;
  slug: string;
  code: string;
  label: string;
  shortLabel: string | null;
  blurb: string;
  image: string | null;
  position: number;
}): BrandRecord {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    label: row.label,
    shortLabel: row.shortLabel || row.label,
    blurb: row.blurb,
    image: row.image?.trim() || null,
    position: row.position,
  };
}

export const getBrands = unstable_cache(
  async (): Promise<BrandRecord[]> => {
    const rows = await db.brand.findMany({ orderBy: [{ position: "asc" }, { label: "asc" }] });
    return rows.map(toBrandRecord);
  },
  ["brands", "with-image-v2"],
  { tags: [CATALOG_TAG], revalidate: 3600 },
);

export async function getBrandBySlug(slug: string): Promise<BrandRecord | null> {
  const brands = await getBrands();
  return brands.find((b) => b.slug === slug) ?? null;
}

export async function getBrandByCode(code: string): Promise<BrandRecord | null> {
  const brands = await getBrands();
  return brands.find((b) => b.code === code) ?? null;
}

export const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  tagline: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  featured: true,
  ratingAverage: true,
  ratingCount: true,
  category: { select: { name: true, slug: true } },
  images: { select: { url: true, alt: true }, orderBy: { position: "asc" }, take: 2 },
  variants: { select: { id: true }, take: 1 },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const orderBy: Record<ProductSort, Prisma.ProductOrderByWithRelationInput[]> = {
  featured: [{ featured: "desc" }, { soldCount: "desc" }],
  newest: [{ createdAt: "desc" }],
  "price-asc": [{ price: "asc" }],
  "price-desc": [{ price: "desc" }],
  rating: [{ ratingAverage: "desc" }, { ratingCount: "desc" }],
};

export type ProductFilters = {
  brand?: BrandSlug;
  device?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: ProductSort;
  page?: number;
};

export const PAGE_SIZE = 12;

export const listProducts = unstable_cache(
  async (filters: ProductFilters) => {
    const page = Math.max(1, filters.page ?? 1);
    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
      ...(filters.category && { category: { slug: filters.category } }),
      ...(filters.inStock && { stock: { gt: 0 } }),
      ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
        price: { gte: filters.minPrice, lte: filters.maxPrice },
      }),
      ...((filters.brand || filters.device) && {
        devices: {
          some: {
            device: {
              ...(filters.brand && { brand: { slug: filters.brand } }),
              ...(filters.device && { slug: filters.device }),
            },
          },
        },
      }),
    };

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        select: productCardSelect,
        orderBy: orderBy[filters.sort ?? "featured"],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      db.product.count({ where }),
    ]);

    return {
      items: items.map(publicProductCard),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
  },
  ["list-products"],
  { tags: [CATALOG_TAG], revalidate: 600 },
);

export const getFeaturedProducts = unstable_cache(
  async (limit = 8) => {
    const featured = await db.product.findMany({
      where: { status: "ACTIVE", featured: true },
      select: productCardSelect,
      orderBy: [{ soldCount: "desc" }],
      take: limit,
    });
    if (featured.length >= limit) return featured.map(publicProductCard);
    const fill = await db.product.findMany({
      where: { status: "ACTIVE", featured: false },
      select: productCardSelect,
      orderBy: [{ soldCount: "desc" }],
      take: limit - featured.length,
    });
    return [...featured, ...fill].map(publicProductCard);
  },
  ["featured-products"],
  { tags: [CATALOG_TAG], revalidate: 600 },
);

export const getBestSellers = unstable_cache(
  async (limit = 4) => {
    const items = await db.product.findMany({
      where: { status: "ACTIVE" },
      select: productCardSelect,
      orderBy: [{ soldCount: "desc" }],
      take: limit,
    });
    return items.map(publicProductCard);
  },
  ["best-sellers"],
  { tags: [CATALOG_TAG], revalidate: 600 },
);

export const getNavigationData = unstable_cache(
  async () => {
    const [categories, brands, devices] = await Promise.all([
      db.category.findMany({
        where: { parentId: null },
        select: { name: true, slug: true, description: true, icon: true },
        orderBy: { position: "asc" },
      }),
      db.brand.findMany({
        orderBy: [{ position: "asc" }, { label: "asc" }],
      }),
      db.device.findMany({
        select: {
          series: true,
          model: true,
          slug: true,
          brand: { select: { code: true, slug: true, label: true, shortLabel: true } },
        },
        orderBy: [{ brand: { position: "asc" } }, { position: "asc" }],
      }),
    ]);
    return {
      categories,
      brands: brands.map(toBrandRecord),
      devices: devices.map((d) => ({
        brand: d.brand.code,
        brandSlug: d.brand.slug,
        brandLabel: d.brand.shortLabel || d.brand.label,
        series: d.series,
        model: d.model,
        slug: d.slug,
      })),
    };
  },
  ["navigation", "with-brand-image-v2"],
  { tags: [CATALOG_TAG], revalidate: 3600 },
);

export type NavigationData = Awaited<ReturnType<typeof getNavigationData>>;
export type DeviceOption = NavigationData["devices"][number];

export const getProductBySlug = cache(async (slug: string) => {
  const product = await db.product.findFirst({
    where: { slug, status: "ACTIVE" },
    select: {
      id: true,
      slug: true,
      name: true,
      tagline: true,
      description: true,
      price: true,
      compareAtPrice: true,
      sku: true,
      stock: true,
      featured: true,
      highlights: true,
      specs: true,
      ratingAverage: true,
      ratingCount: true,
      categoryId: true,
      category: { select: { name: true, slug: true } },
      images: {
        orderBy: { position: "asc" as const },
        select: { id: true, url: true, alt: true, position: true },
      },
      variants: {
        orderBy: { position: "asc" as const },
        select: { id: true, name: true, priceOverride: true, stock: true, position: true },
      },
      devices: {
        select: {
          deviceId: true,
          device: {
            select: {
              series: true,
              model: true,
              slug: true,
              brand: { select: { code: true, slug: true, label: true, shortLabel: true } },
            },
          },
        },
      },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          authorName: true,
          rating: true,
          title: true,
          comment: true,
          verified: true,
          createdAt: true,
        },
      },
    },
  });
  if (!product) return null;
  return {
    ...product,
    stock: publicStock(product.stock),
    variants: product.variants.map((v) => ({ ...v, stock: publicStock(v.stock) })),
    devices: product.devices.map(({ deviceId, device }) => ({
      deviceId,
      device: {
        brand: device.brand.code,
        brandSlug: device.brand.slug,
        series: device.series,
        model: device.model,
        slug: device.slug,
      },
    })),
  };
});

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

export async function getRelatedProducts(product: ProductDetail, limit = 4) {
  const deviceIds = product.devices.map((d) => d.deviceId);
  const items = await db.product.findMany({
    where: {
      status: "ACTIVE",
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId },
        ...(deviceIds.length ? [{ devices: { some: { deviceId: { in: deviceIds } } } }] : []),
      ],
    },
    select: productCardSelect,
    orderBy: [{ soldCount: "desc" }],
    take: limit,
  });
  return items.map(publicProductCard);
}

export async function getActiveProductSlugs() {
  return db.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true },
  });
}

export async function searchProducts(query: string, limit = 48): Promise<ProductCardData[]> {
  const q = query.trim().slice(0, 100);
  if (!q) return [];

  let ranked: { id: string }[] = [];
  try {
    ranked = await db.$queryRaw<{ id: string }[]>`
      SELECT p.id
      FROM "Product" p
      CROSS JOIN LATERAL (
        SELECT to_tsvector('english',
          p.name || ' ' || coalesce(p.tagline, '') || ' ' || p.description || ' ' ||
          coalesce((
            SELECT string_agg(d.model || ' ' || d.series, ' ')
            FROM "ProductDevice" pd JOIN "Device" d ON d.id = pd."deviceId"
            WHERE pd."productId" = p.id
          ), '')
        ) AS doc
      ) x
      CROSS JOIN websearch_to_tsquery('english', ${q}) query
      WHERE p.status = 'ACTIVE' AND (x.doc @@ query OR p.name ILIKE ${`%${q}%`})
      ORDER BY ts_rank(x.doc, query) DESC, p."soldCount" DESC
      LIMIT ${limit}
    `;
  } catch {
    // websearch_to_tsquery can reject odd punctuation — fall back to ILIKE.
    ranked = [];
  }

  if (ranked.length === 0) {
    const items = await db.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { devices: { some: { device: { model: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      select: productCardSelect,
      orderBy: [{ soldCount: "desc" }, { name: "asc" }],
      take: limit,
    });
    return items.map(publicProductCard);
  }

  const products = await db.product.findMany({
    where: { id: { in: ranked.map((r) => r.id) } },
    select: productCardSelect,
  });
  const order = new Map(ranked.map((r, i) => [r.id, i]));
  return products.sort((a, b) => order.get(a.id)! - order.get(b.id)!).map(publicProductCard);
}
