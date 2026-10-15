import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { getProductsForDevices } from "@/server/queries/catalog";

const querySchema = z.object({
  devices: z.string().max(400).optional(),
  exclude: z.string().max(400).optional(),
});

/**
 * Device-matched cart upsells — always available, rate-limited.
 * Only returns products compatible with the given device slugs.
 */
export async function GET(request: NextRequest) {
  const limited = await rateLimit("cart-suggestions", 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const deviceSlugs = (parsed.data.devices ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
  const excludeIds = (parsed.data.exclude ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (!deviceSlugs.length) {
    return NextResponse.json({ items: [] });
  }

  const products = await getProductsForDevices(deviceSlugs, {
    excludeProductIds: excludeIds,
    limit: 4,
  });

  const items = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.images[0]?.url ?? null,
    stock: p.stock,
  }));

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "private, max-age=60" } },
  );
}
