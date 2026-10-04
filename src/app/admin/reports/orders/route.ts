import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { csvResponse, htmlResponse, reportDocument } from "@/lib/reports/document";
import {
  escapeHtml,
  formatReportDate,
  formatReportMoney,
  reportFilename,
  toCsv,
} from "@/lib/reports/format";
import type { OrderStatus } from "@/generated/prisma/enums";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export async function GET(request: Request) {
  await requireAdmin(["OWNER", "STAFF"], { next: "/admin/reports/orders" });
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "csv" ? "csv" : "html";
  const statusParam = searchParams.get("status");
  const q = searchParams.get("q")?.trim() ?? "";
  const status = statuses.includes(statusParam as OrderStatus) ? (statusParam as OrderStatus) : undefined;

  const orders = await db.order.findMany({
    where: {
      ...(status && { status }),
      ...(q && {
        OR: [
          { number: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { email: { contains: q, mode: "insensitive" } },
          { customerName: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 2000,
    select: {
      number: true,
      customerName: true,
      phone: true,
      city: true,
      total: true,
      subtotal: true,
      shippingFee: true,
      discount: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "RETURNED")
    .reduce((sum, o) => sum + o.total, 0);

  if (format === "csv") {
    const csv = toCsv(
      [
        "Order #",
        "Date",
        "Customer",
        "Phone",
        "City",
        "Items",
        "Payment method",
        "Payment status",
        "Order status",
        "Subtotal",
        "Shipping",
        "Discount",
        "Total",
      ],
      orders.map((o) => [
        o.number,
        formatReportDate(o.createdAt),
        o.customerName,
        o.phone,
        o.city,
        o._count.items,
        o.paymentMethod,
        o.paymentStatus,
        o.status,
        o.subtotal,
        o.shippingFee,
        o.discount,
        o.total,
      ]),
    );
    return csvResponse(csv, reportFilename("order-register", "csv"));
  }

  const rows = orders
    .map(
      (o) => `
      <tr>
        <td class="mono">${escapeHtml(o.number)}</td>
        <td>${escapeHtml(formatReportDate(o.createdAt))}</td>
        <td>
          <strong>${escapeHtml(o.customerName)}</strong><br/>
          <span style="color:#5c6478">${escapeHtml(o.phone)} · ${escapeHtml(o.city)}</span>
        </td>
        <td class="num">${o._count.items}</td>
        <td><span class="badge">${escapeHtml(o.paymentMethod)}</span><br/><span style="color:#5c6478;font-size:11px">${escapeHtml(o.paymentStatus)}</span></td>
        <td><span class="badge">${escapeHtml(o.status)}</span></td>
        <td class="num mono">${escapeHtml(formatReportMoney(o.total))}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <table class="data">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date</th>
          <th>Customer</th>
          <th class="num">Items</th>
          <th>Payment</th>
          <th>Status</th>
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="7" style="text-align:center;padding:28px;color:#5c6478">No orders in this register.</td></tr>`}
      </tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Orders listed</span><span>${orders.length}</span></div>
      <div class="row"><span>Net sales (excl. cancelled/returned)</span><span>${escapeHtml(formatReportMoney(revenue))}</span></div>
    </div>
  `;

  const html = reportDocument({
    title: "Order register",
    subtitle: "Sales statement for HYDRA storefront orders.",
    meta: [
      { label: "Filter status", value: status ?? "ALL" },
      { label: "Search", value: q || "—" },
      { label: "Records", value: String(orders.length) },
      { label: "Currency", value: "USD" },
    ],
    body,
  });

  return htmlResponse(html, reportFilename("order-register", "html"));
}
