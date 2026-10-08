import "server-only";
import { companyInfo, siteConfig } from "@/config/site";
import { escapeHtml, formatReportDate, formatReportMoney } from "@/lib/reports/format";
import { reportDocument } from "@/lib/reports/document";
import type { InvoiceOrder } from "./types";

function paymentCopy(order: InvoiceOrder) {
  if (order.paymentMethod === "COD") {
    return order.paymentStatus === "PAID"
      ? "Cash on delivery — collected"
      : `Pay on delivery · ${formatReportMoney(order.total)} due on receipt`;
  }
  if (order.paymentStatus === "PAID") return `${order.paymentMethod} · Paid`;
  if (order.paymentStatus === "REFUNDED") return `${order.paymentMethod} · Refunded`;
  return `${order.paymentMethod} · ${order.paymentStatus}`;
}

function shipTo(order: InvoiceOrder) {
  return [order.address, order.area, order.city, order.postalCode, order.country].filter(Boolean).join(", ");
}

/** Full print/admin HTML invoice. Invoice UID = order.number (courier-ready). */
export function buildInvoiceHtml(order: InvoiceOrder, opts?: { toolbar?: boolean }) {
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
      <div class="row"><span>Amount due</span><span>${escapeHtml(formatReportMoney(order.total))}</span></div>
    </div>

    <div class="meta-grid" style="margin-top:22px">
      <div class="meta-item">
        <span class="meta-label">Bill / ship to</span>
        <span class="meta-value">${escapeHtml(order.customerName)}</span>
        <div style="margin-top:4px;color:#5c6478">
          ${escapeHtml(order.phone)}<br/>
          ${escapeHtml(order.email)}<br/>
          ${escapeHtml(shipTo(order))}
        </div>
      </div>
      <div class="meta-item">
        <span class="meta-label">Payment</span>
        <span class="meta-value">${escapeHtml(paymentCopy(order))}</span>
        ${order.paymentRef ? `<div style="margin-top:4px;color:#5c6478">Ref: ${escapeHtml(order.paymentRef)}</div>` : ""}
      </div>
      <div class="meta-item">
        <span class="meta-label">Fulfillment</span>
        <span class="meta-value">${escapeHtml(order.status.replaceAll("_", " "))}</span>
        ${order.fulfillmentNote ? `<div style="margin-top:4px;color:#5c6478">${escapeHtml(order.fulfillmentNote)}</div>` : ""}
        ${order.notes ? `<div style="margin-top:4px;color:#5c6478">Customer note: ${escapeHtml(order.notes)}</div>` : ""}
      </div>
    </div>

    <p style="margin-top:18px;color:#5c6478;font-size:12px">
      Track this order anytime with invoice ID <strong class="mono">${escapeHtml(order.number)}</strong>
      at ${escapeHtml(siteConfig.name)} · ${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "hydraglobal.com")}/track
    </p>
  `;

  const html = reportDocument({
    title: "Tax invoice / sales receipt",
    subtitle: `Invoice UID ${order.number} · issued for confirmed HYDRA order.`,
    meta: [
      { label: "Invoice UID", value: order.number },
      { label: "Order date", value: formatReportDate(order.createdAt) },
      { label: "Status", value: order.status.replaceAll("_", " ") },
      { label: "Currency", value: siteConfig.currency },
    ],
    body,
    footerNote: `${siteConfig.legalName} · ${companyInfo.registeredOffice} · This invoice uses the same ID for courier consignment when shipping is booked.`,
  });

  if (opts?.toolbar === false) {
    return html.replace(/<div class="toolbar">[\s\S]*?<\/div>/, "");
  }
  return html;
}

/** Compact HTML email body (inline-friendly). */
export function buildInvoiceEmailHtml(order: InvoiceOrder) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hydraglobal.com").replace(/\/$/, "");
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eceff5;font-size:14px;color:#0f1117">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.variantName ? `<div style="color:#5c6478;font-size:12px">${escapeHtml(item.variantName)}</div>` : ""}
          <div style="color:#5c6478;font-size:12px;font-family:ui-monospace,monospace">${escapeHtml(item.sku)} · ×${item.quantity}</div>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eceff5;text-align:right;font-family:ui-monospace,monospace;font-size:14px;white-space:nowrap">
          ${escapeHtml(formatReportMoney(item.unitPrice * item.quantity))}
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;background:#eef1f7;font-family:Segoe UI,system-ui,-apple-system,sans-serif;color:#0f1117">
  <div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #d8dde8;border-radius:16px;overflow:hidden">
    <div style="padding:28px 28px 20px;background:linear-gradient(135deg,#0b1224,#1e3a8a);color:#fff">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.75">HYDRA · Official invoice</div>
      <h1 style="margin:10px 0 0;font-size:26px;letter-spacing:-0.02em">Order confirmed</h1>
      <p style="margin:8px 0 0;opacity:0.9;font-size:14px">Hi ${escapeHtml(order.customerName.split(" ")[0] || "there")}, your HYDRA order is confirmed.</p>
    </div>
    <div style="padding:24px 28px">
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;padding:14px 16px;background:#f4f6fb;border-radius:12px;margin-bottom:20px">
        <div>
          <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5c6478">Invoice UID</div>
          <div style="margin-top:4px;font-family:ui-monospace,monospace;font-weight:700;font-size:16px">${escapeHtml(order.number)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5c6478">Amount due</div>
          <div style="margin-top:4px;font-family:ui-monospace,monospace;font-weight:700;font-size:16px">${escapeHtml(formatReportMoney(order.total))}</div>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse">${rows}</table>

      <table style="width:100%;margin-top:12px;font-size:14px">
        <tr><td style="padding:4px 0;color:#5c6478">Subtotal</td><td style="padding:4px 0;text-align:right;font-family:ui-monospace,monospace">${escapeHtml(formatReportMoney(order.subtotal))}</td></tr>
        <tr><td style="padding:4px 0;color:#5c6478">Shipping</td><td style="padding:4px 0;text-align:right;font-family:ui-monospace,monospace">${escapeHtml(formatReportMoney(order.shippingFee))}</td></tr>
        ${
          order.discount > 0
            ? `<tr><td style="padding:4px 0;color:#5c6478">Discount</td><td style="padding:4px 0;text-align:right;font-family:ui-monospace,monospace">-${escapeHtml(formatReportMoney(order.discount))}</td></tr>`
            : ""
        }
        <tr><td style="padding:10px 0 0;font-weight:700">Total</td><td style="padding:10px 0 0;text-align:right;font-weight:700;font-family:ui-monospace,monospace">${escapeHtml(formatReportMoney(order.total))}</td></tr>
      </table>

      <div style="margin-top:22px;padding-top:18px;border-top:1px solid #eceff5;font-size:13px;color:#5c6478;line-height:1.55">
        <strong style="color:#0f1117">Payment</strong><br/>${escapeHtml(paymentCopy(order))}<br/><br/>
        <strong style="color:#0f1117">Deliver to</strong><br/>
        ${escapeHtml(order.customerName)} · ${escapeHtml(order.phone)}<br/>
        ${escapeHtml(shipTo(order))}
      </div>

      <div style="margin-top:22px">
        <a href="${escapeHtml(site)}/track?order=${encodeURIComponent(order.number)}"
           style="display:inline-block;background:#1e40af;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:650;font-size:14px">
          Track order status
        </a>
      </div>
    </div>
    <div style="padding:16px 28px 24px;background:#fafbfe;border-top:1px solid #eceff5;font-size:11px;color:#5c6478;line-height:1.5">
      ${escapeHtml(siteConfig.legalName)} · ${escapeHtml(companyInfo.registeredOffice)}<br/>
      Questions? ${escapeHtml(siteConfig.email)} · ${escapeHtml(siteConfig.phone)}<br/>
      Invoice UID matches your courier consignment reference when the parcel ships.
    </div>
  </div>
</body>
</html>`;
}

export function buildInvoiceEmailText(order: InvoiceOrder) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hydraglobal.com").replace(/\/$/, "");
  const lines = [
    `${siteConfig.name} — Order confirmed`,
    ``,
    `Hi ${order.customerName},`,
    `Your order is confirmed.`,
    ``,
    `Invoice UID: ${order.number}`,
    `Status: ${order.status}`,
    `Payment: ${paymentCopy(order)}`,
    `Total: ${formatReportMoney(order.total)}`,
    ``,
    `Items:`,
    ...order.items.map(
      (i) =>
        `- ${i.name}${i.variantName ? ` (${i.variantName})` : ""} ×${i.quantity} · ${formatReportMoney(i.unitPrice * i.quantity)}`,
    ),
    ``,
    `Ship to: ${order.customerName}, ${order.phone}`,
    shipTo(order),
    ``,
    `Track: ${site}/track?order=${encodeURIComponent(order.number)}`,
    ``,
    `${siteConfig.legalName} · ${siteConfig.email}`,
  ];
  return lines.join("\n");
}
