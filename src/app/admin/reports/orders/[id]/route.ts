import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { buildInvoiceHtml } from "@/lib/invoice/build-invoice";
import { toInvoiceOrder } from "@/lib/invoice/from-order";
import { htmlResponse } from "@/lib/reports/document";
import { reportFilename } from "@/lib/reports/format";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  await requireAdmin(["OWNER", "STAFF"], { next: `/admin/reports/orders/${id}` });
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const html = buildInvoiceHtml(toInvoiceOrder(order));
  return htmlResponse(html, reportFilename(`invoice-${order.number}`, "html"));
}
