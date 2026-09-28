import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { listProducts, sortOptions } from "@/server/queries/catalog";

const querySchema = z.object({
  brand: z.enum(["iphone", "samsung"]).optional(),
  device: z.string().max(80).optional(),
  category: z.string().max(80).optional(),
  sort: z.enum(sortOptions.map((o) => o.value) as [string, ...string[]]).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
});

/** Public, read-only catalog endpoint (device finder, integrations). */
export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", issues: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }
  const result = await listProducts(parsed.data as Parameters<typeof listProducts>[0]);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
