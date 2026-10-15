import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { buildInvoiceHtml } from "@/lib/invoice/build-invoice";
import { toInvoiceOrder } from "@/lib/invoice/from-order";
import { bindMoneyFormat } from "@/lib/money";
import { htmlResponse } from "@/lib/reports/document";
import { reportFilename } from "@/lib/reports/format";
import { getCurrencyContent } from "@/server/queries/content";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  await requireAdmin(["OWNER", "STAFF"], { next: `/admin/reports/orders/${id}` });
  const [order, currency] = await Promise.all([
    db.order.findUnique({
      where: { id },
      include: { items: true },
    }),
    getCurrencyContent(),
  ]);
  if (!order) notFound();

  bindMoneyFormat(currency);
  const html = buildInvoiceHtml(toInvoiceOrder(order));
  return htmlResponse(html, reportFilename(`invoice-${order.number}`, "html"));
}
