import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { absoluteUrl, formatCode } from "@/lib/utils";

/** CSV for the packaging printer: code, formatted code, and QR target URL. */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const batch = request.nextUrl.searchParams.get("batch");
  const productId = request.nextUrl.searchParams.get("product");
  if (!batch) return NextResponse.json({ error: "batch is required" }, { status: 400 });

  const codes = await db.authenticityCode.findMany({
    where: { batch, ...(productId && { productId }) },
    select: { code: true, status: true },
    orderBy: { createdAt: "asc" },
  });

  const rows = [
    "code,display_code,status,qr_url",
    ...codes.map((c) => {
      const display = formatCode(c.code);
      return `${c.code},${display},${c.status},${absoluteUrl(`/verify?code=${display}`)}`;
    }),
  ];

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hydra-codes-${batch.replace(/[^\w-]/g, "")}.csv"`,
    },
  });
}
