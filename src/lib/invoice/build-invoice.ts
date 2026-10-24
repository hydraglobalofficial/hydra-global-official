import "server-only";
import { companyInfo, siteConfig } from "@/config/site";
import { getActiveMoneyFormat } from "@/lib/money";
import { signOrderAccess } from "@/lib/order-access";
import { escapeHtml, formatReportDate, formatReportMoney } from "@/lib/reports/format";
import { reportDocument } from "@/lib/reports/document";
import type { InvoiceOrder } from "./types";

function paymentCopy(order: InvoiceOrder) {
  if (order.paymentMethod === "COD") {
    return order.paymentStatus === "PAID"
      ? "Cash on delivery — collected"
      : `Cash on delivery · ${formatReportMoney(order.total)} due on receipt`;
  }
  if (order.paymentStatus === "PAID") return `${order.paymentMethod} · Paid`;
  if (order.paymentStatus === "REFUNDED") return `${order.paymentMethod} · Refunded`;
  return `${order.paymentMethod} · ${order.paymentStatus}`;
}

function shipTo(order: InvoiceOrder) {
  return [order.address, order.area, order.city, order.postalCode, order.country].filter(Boolean).join(", ");
}

function siteBase() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  // Public assets for email must be an https URL email clients can fetch (not localhost).
  const base = (fromEnv || "https://hydraglobal.com").replace(/\/$/, "");
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(base)) {
    return "https://hydraglobal.com";
  }
  return base;
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
      Track with invoice ID <strong class="mono">${escapeHtml(order.number)}</strong>
      plus the secure link from your confirmation email (or invoice ID + checkout email).
    </p>
  `;

  const html = reportDocument({
    title: "Tax invoice / sales receipt",
    subtitle: `Invoice UID ${order.number} · issued for confirmed HYDRA order.`,
    meta: [
      { label: "Invoice UID", value: order.number },
      { label: "Order date", value: formatReportDate(order.createdAt) },
      { label: "Status", value: order.status.replaceAll("_", " ") },
      { label: "Currency", value: getActiveMoneyFormat().code || siteConfig.currency },
    ],
    body,
    footerNote: `${siteConfig.legalName} · ${companyInfo.registeredOffice} · This invoice uses the same ID for courier consignment when shipping is booked.`,
  });

  if (opts?.toolbar === false) {
    return html.replace(/<div class="toolbar">[\s\S]*?<\/div>/, "");
  }
  return html;
}

/** Customer-facing confirmation email (inline CSS, Gmail/Outlook safe). */
export function buildInvoiceEmailHtml(order: InvoiceOrder) {
  const site = siteBase();
  const firstName = order.customerName.trim().split(/\s+/)[0] || "there";
  const trackToken = signOrderAccess(order.number);
  const trackUrl = `${site}/track?order=${encodeURIComponent(order.number)}&t=${encodeURIComponent(trackToken)}`;
  const markUrl = `${site}/products/Hydra_Mark.png`;
  const issued = formatReportDate(order.createdAt);

  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #d9e0ec;vertical-align:top">
          <div style="font-size:15px;font-weight:650;color:#0c1222;line-height:1.35">${escapeHtml(item.name)}</div>
          ${
            item.variantName
              ? `<div style="margin-top:4px;font-size:12px;color:#5b657a">${escapeHtml(item.variantName)}</div>`
              : ""
          }
          <div style="margin-top:5px;font-size:11px;letter-spacing:0.06em;color:#8490a5;font-family:Consolas,ui-monospace,monospace">
            ${escapeHtml(item.sku)} &nbsp;·&nbsp; Qty ${item.quantity}
          </div>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #d9e0ec;text-align:right;vertical-align:top;white-space:nowrap;font-family:Consolas,ui-monospace,monospace;font-size:14px;color:#0c1222;font-weight:600">
          ${escapeHtml(formatReportMoney(item.unitPrice * item.quantity))}
        </td>
      </tr>`,
    )
    .join("");

  const brandLockup = `
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:middle;padding-right:14px">
          <img src="${escapeHtml(markUrl)}" width="72" height="72" alt="${escapeHtml(siteConfig.name)}"
               style="display:block;width:72px;height:72px;border:0;outline:none;border-radius:14px;background:#0c1222" />
        </td>
        <td style="vertical-align:middle">
          <div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;font-weight:750;line-height:1.3;color:#ffffff">
            ${escapeHtml(siteConfig.legalName)}
          </div>
          <div style="margin-top:6px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;color:#c5d0e2">
            ${escapeHtml(companyInfo.registeredOffice)}
          </div>
        </td>
      </tr>
    </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(siteConfig.name)} invoice ${escapeHtml(order.number)}</title>
</head>
<body style="margin:0;padding:0;background:#d8dee9;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#0c1222">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">
    Invoice ${escapeHtml(order.number)} · ${escapeHtml(formatReportMoney(order.total))} · Track your HYDRA order
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#d8dee9;padding:28px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#edf0f6;border:1px solid #c5cddc;overflow:hidden">

          <!-- Brand header -->
          <tr>
            <td style="padding:30px 32px 26px;background:#0c1222;background-image:linear-gradient(145deg,#0c1222 0%,#162038 55%,#1a2744 100%);color:#ffffff">
              ${brandLockup}
              <div style="margin-top:22px;height:1px;background:#2a3650;line-height:1;font-size:0">&nbsp;</div>
              <p style="margin:18px 0 0;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#8b9bb8">
                Sales invoice
              </p>
              <h1 style="margin:8px 0 0;font-size:26px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#ffffff">
                Order confirmed
              </h1>
              <p style="margin:10px 0 0;font-size:14px;line-height:1.55;color:#b6c2d6">
                Dear ${escapeHtml(firstName)}, thank you for choosing ${escapeHtml(siteConfig.name)}.
                This email is your official invoice.
              </p>
            </td>
          </tr>

          <!-- Accent strip -->
          <tr>
            <td style="height:4px;background:#c4a35a;font-size:0;line-height:0">&nbsp;</td>
          </tr>

          <!-- Meta grid -->
          <tr>
            <td style="padding:0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:18px 28px;width:50%;vertical-align:top;background:#e4e9f2;border-bottom:1px solid #cfd7e6">
                    <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b768c">Invoice ID</div>
                    <div style="margin-top:7px;font-family:Consolas,ui-monospace,monospace;font-size:15px;font-weight:700;color:#0c1222">
                      ${escapeHtml(order.number)}
                    </div>
                  </td>
                  <td style="padding:18px 28px;width:50%;vertical-align:top;background:#e4e9f2;border-bottom:1px solid #cfd7e6;border-left:1px solid #cfd7e6">
                    <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b768c">Issued</div>
                    <div style="margin-top:7px;font-size:15px;font-weight:650;color:#0c1222">${escapeHtml(issued)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 28px;width:50%;vertical-align:top;background:#dde3ef;border-bottom:1px solid #cfd7e6">
                    <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b768c">Amount due</div>
                    <div style="margin-top:7px;font-family:Consolas,ui-monospace,monospace;font-size:20px;font-weight:800;color:#0c1222">
                      ${escapeHtml(formatReportMoney(order.total))}
                    </div>
                  </td>
                  <td style="padding:16px 28px;width:50%;vertical-align:top;background:#dde3ef;border-bottom:1px solid #cfd7e6;border-left:1px solid #cfd7e6">
                    <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b768c">Payment</div>
                    <div style="margin-top:7px;font-size:14px;font-weight:650;color:#0c1222;line-height:1.4">
                      ${escapeHtml(paymentCopy(order))}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line items -->
          <tr>
            <td style="padding:8px 28px 6px;background:#edf0f6">
              <p style="margin:16px 0 2px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b768c;font-weight:700">
                Items
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;font-size:14px">
                <tr>
                  <td style="padding:7px 0;color:#5b657a">Subtotal</td>
                  <td style="padding:7px 0;text-align:right;font-family:Consolas,ui-monospace,monospace;color:#0c1222">${escapeHtml(formatReportMoney(order.subtotal))}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#5b657a">Shipping</td>
                  <td style="padding:7px 0;text-align:right;font-family:Consolas,ui-monospace,monospace;color:#0c1222">${escapeHtml(formatReportMoney(order.shippingFee))}</td>
                </tr>
                ${
                  order.discount > 0
                    ? `<tr>
                  <td style="padding:7px 0;color:#5b657a">Discount</td>
                  <td style="padding:7px 0;text-align:right;font-family:Consolas,ui-monospace,monospace;color:#0c1222">-${escapeHtml(formatReportMoney(order.discount))}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:14px 0 8px;font-weight:800;border-top:2px solid #0c1222;color:#0c1222;font-size:15px">Total</td>
                  <td style="padding:14px 0 8px;text-align:right;font-weight:800;border-top:2px solid #0c1222;font-family:Consolas,ui-monospace,monospace;color:#0c1222;font-size:16px">
                    ${escapeHtml(formatReportMoney(order.total))}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery -->
          <tr>
            <td style="padding:20px 28px;background:#e4e9f2;border-top:1px solid #cfd7e6">
              <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b768c;font-weight:700">Deliver to</div>
              <p style="margin:9px 0 0;font-size:14px;line-height:1.6;color:#0c1222">
                <strong>${escapeHtml(order.customerName)}</strong><br/>
                ${escapeHtml(order.phone)} · ${escapeHtml(order.email)}<br/>
                ${escapeHtml(shipTo(order))}
              </p>
            </td>
          </tr>

          <!-- Track CTA -->
          <tr>
            <td style="padding:22px 28px 28px;background:#edf0f6">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c1222;background-image:linear-gradient(145deg,#0c1222,#1a2744)">
                <tr>
                  <td style="padding:24px 20px;text-align:center">
                    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8b9bb8;font-weight:700">Shipment tracking</div>
                    <p style="margin:10px 0 18px;font-size:13px;line-height:1.5;color:#c5d0e2">
                      Follow live courier status with your invoice ID.
                    </p>
                    <a href="${escapeHtml(trackUrl)}"
                       style="display:inline-block;background:#c4a35a;color:#0c1222;text-decoration:none;padding:13px 24px;font-size:13px;font-weight:800;letter-spacing:0.04em">
                      TRACK ORDER
                    </a>
                    <p style="margin:14px 0 0;font-size:11px;color:#7a879c;word-break:break-all;font-family:Consolas,ui-monospace,monospace">
                      ${escapeHtml(trackUrl)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px 26px;background:#0c1222;font-size:11px;line-height:1.6;color:#8b9bb8">
              <img src="${escapeHtml(markUrl)}" width="36" height="36" alt="${escapeHtml(siteConfig.name)}" style="display:block;width:36px;height:36px;border:0;border-radius:8px;background:#0c1222;margin-bottom:10px" />
              ${escapeHtml(siteConfig.legalName)}<br/>
              ${escapeHtml(companyInfo.registeredOffice)}<br/>
              Support: ${escapeHtml(process.env.SMTP_REPLY_TO?.trim() || siteConfig.email)} · ${escapeHtml(siteConfig.phone)}<br/>
              Invoice ID is your courier reference — please keep this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildInvoiceEmailText(order: InvoiceOrder) {
  const site = siteBase();
  const trackToken = signOrderAccess(order.number);
  const trackUrl = `${site}/track?order=${encodeURIComponent(order.number)}&t=${encodeURIComponent(trackToken)}`;
  const lines = [
    `${siteConfig.name} — Official invoice`,
    ``,
    `Dear ${order.customerName},`,
    ``,
    `Thank you for your order. This message is your sales invoice.`,
    ``,
    `Invoice ID: ${order.number}`,
    `Issued: ${formatReportDate(order.createdAt)}`,
    `Status: ${order.status}`,
    `Payment: ${paymentCopy(order)}`,
    `Subtotal: ${formatReportMoney(order.subtotal)}`,
    `Shipping: ${formatReportMoney(order.shippingFee)}`,
    `Total: ${formatReportMoney(order.total)}`,
    ``,
    `Items`,
    ...order.items.map(
      (i) =>
        `  • ${i.name}${i.variantName ? ` (${i.variantName})` : ""} ×${i.quantity} — ${formatReportMoney(i.unitPrice * i.quantity)}`,
    ),
    ``,
    `Deliver to`,
    `  ${order.customerName}`,
    `  ${order.phone} · ${order.email}`,
    `  ${shipTo(order)}`,
    ``,
    `Track shipment: ${trackUrl}`,
    ``,
    `${siteConfig.legalName}`,
    companyInfo.registeredOffice,
    `Support: ${process.env.SMTP_REPLY_TO?.trim() || siteConfig.email} · ${siteConfig.phone}`,
  ];
  return lines.join("\n");
}
