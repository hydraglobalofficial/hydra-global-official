import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { listProducts, sortOptions } from "@/server/queries/catalog";

const querySchema = z.object({
  brand: z.enum(["iphone", "samsung"]).optional(),
  device: z.string().max(80).optional(),
  category: z.string().max(80).optional(),
  sort: z.enum(sortOptions.map((o) => o.value) as [string, ...string[]]).optional(),
  page: z.coerce.number().int().min(1).max(50).optional(),
});

/**
 * Public catalog JSON — disabled unless PUBLIC_CATALOG_API=1.
 * Even when enabled: rate-limited, capped fields, no soldCount / draft / admin fields.
 */
export async function GET(request: NextRequest) {
  if (process.env.PUBLIC_CATALOG_API !== "1") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limited = await rateLimit("api-products", 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const result = await listProducts(parsed.data as Parameters<typeof listProducts>[0]);
  const items = result.items.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    featured: p.featured,
    ratingAverage: p.ratingAverage,
    ratingCount: p.ratingCount,
    category: p.category,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
  }));

  return NextResponse.json(
    { items, total: result.total, page: result.page, pageCount: result.pageCount },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
