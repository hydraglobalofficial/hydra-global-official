import { NextResponse } from "next/server";
import { safeEqualString } from "@/lib/auth/master-key";
import { db } from "@/lib/db";

/**
 * Pathao parcel status webhook.
 * Configure: POST {NEXT_PUBLIC_SITE_URL}/api/webhooks/pathao
 *
 * Requires PATHAO_WEBHOOK_SECRET (header x-pathao-signature or Authorization: Bearer …).
 */
export async function POST(request: Request) {
  const secret = process.env.PATHAO_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[pathao webhook] PATHAO_WEBHOOK_SECRET is not set");
    return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 503 });
  }

  const header =
    request.headers.get("x-pathao-signature") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  if (!header || !safeEqualString(header, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const consignmentId = String(
    body.consignment_id ??
      body.consignmentId ??
      (body.data as { consignment_id?: string } | undefined)?.consignment_id ??
      "",
  ).trim();
  const status = String(
    body.order_status ??
      body.status ??
      (body.data as { order_status?: string } | undefined)?.order_status ??
      "",
  ).trim();
  const merchantOrderId = String(body.merchant_order_id ?? body.merchantOrderId ?? "").trim();

  if (!consignmentId && !merchantOrderId) {
    return NextResponse.json({ ok: false, error: "Missing consignment / order id" }, { status: 400 });
  }

  const order = consignmentId
    ? await db.order.findFirst({ where: { courierConsignmentId: consignmentId } })
    : await db.order.findUnique({ where: { number: merchantOrderId } });

  if (!order) {
    return NextResponse.json({ ok: true, matched: false });
  }

  const delivered = /deliver/i.test(status);
  await db.order.update({
    where: { id: order.id },
    data: {
      courierStatus: status || order.courierStatus,
      courierLastSyncAt: new Date(),
      ...(delivered && order.status !== "CANCELLED" && order.status !== "RETURNED"
        ? { status: "DELIVERED" as const }
        : /transit|picked|hub|assigned|pickup/i.test(status) &&
            ["CONFIRMED", "PROCESSING"].includes(order.status)
          ? { status: "SHIPPED" as const }
          : {}),
    },
  });

  return NextResponse.json({ ok: true, matched: true });
}
