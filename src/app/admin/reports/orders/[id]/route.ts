import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { htmlResponse, reportDocument } from "@/lib/reports/document";
import { escapeHtml, formatReportDate, formatReportMoney, reportFilename } from "@/lib/reports/format";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  await requireAdmin(["OWNER", "STAFF"], { next: `/admin/reports/orders/${id}` });
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const itemRows = order.items
    .map(
      (item, index) => `
      <tr>
        <td class="num">${index + 1}</td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
          ${item.variantName ? `<br/><span style="color:#5c6478">${escapeHtml(item.variantName)}</span>` : ""}
        </td>
        <td class="mono">${escapeHtml(item.sku)}</td>
        <td class="num">${item.quantity}</td>
        <td class="num mono">${escapeHtml(formatReportMoney(item.unitPrice))}</td>
        <td class="num mono">${escapeHtml(formatReportMoney(item.unitPrice * item.quantity))}</td>
      </tr>`,
    )
    .join("");

  const address = [order.address, order.area, order.city, order.postalCode, order.country]
    .filter(Boolean)
    .join(", ");

  const body = `
    <table class="data">
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Item description</th>
          <th>SKU</th>
          <th class="num">Qty</th>
          <th class="num">Unit price</th>
          <th class="num">Line total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="totals">
      <div class="row"><span>Subtotal</span><span>${escapeHtml(formatReportMoney(order.subtotal))}</span></div>
      <div class="row"><span>Shipping</span><span>${escapeHtml(formatReportMoney(order.shippingFee))}</span></div>
      ${
        order.discount > 0
          ? `<div class="row"><span>Discount</span><span>-${escapeHtml(formatReportMoney(order.discount))}</span></div>`
          : ""
      }
      <div class="row"><span>Grand total</span><span>${escapeHtml(formatReportMoney(order.total))}</span></div>
    </div>

    <div class="meta-grid" style="margin-top:22px">
      <div class="meta-item">
        <span class="meta-label">Bill to</span>
        <span class="meta-value">${escapeHtml(order.customerName)}</span>
        <div style="margin-top:4px;color:#5c6478">${escapeHtml(order.phone)}<br/>${escapeHtml(order.email)}<br/>${escapeHtml(address)}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">Payment</span>
        <span class="meta-value">${escapeHtml(order.paymentMethod)} · ${escapeHtml(order.paymentStatus)}</span>
        ${order.paymentRef ? `<div style="margin-top:4px;color:#5c6478">Ref: ${escapeHtml(order.paymentRef)}</div>` : ""}
      </div>
      <div class="meta-item">
        <span class="meta-label">Fulfillment</span>
        <span class="meta-value">${escapeHtml(order.status)}</span>
        ${order.fulfillmentNote ? `<div style="margin-top:4px;color:#5c6478">${escapeHtml(order.fulfillmentNote)}</div>` : ""}
        ${order.notes ? `<div style="margin-top:4px;color:#5c6478">Customer note: ${escapeHtml(order.notes)}</div>` : ""}
      </div>
    </div>
  `;

  const html = reportDocument({
    title: "Sales invoice / order statement",
    subtitle: `Official statement for order ${order.number}.`,
    meta: [
      { label: "Order number", value: order.number },
      { label: "Order date", value: formatReportDate(order.createdAt) },
      { label: "Status", value: order.status },
      { label: "Currency", value: "USD" },
    ],
    body,
    footerNote: "This statement is generated from HYDRA Admin order records for internal and customer documentation.",
  });

  return htmlResponse(html, reportFilename(`invoice-${order.number}`, "html"));
}
