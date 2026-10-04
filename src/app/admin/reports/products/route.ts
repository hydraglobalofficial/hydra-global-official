import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { csvResponse, htmlResponse, reportDocument } from "@/lib/reports/document";
import {
  escapeHtml,
  formatReportMoney,
  reportFilename,
  toCsv,
} from "@/lib/reports/format";

export async function GET(request: Request) {
  await requireAdmin(["OWNER", "STAFF"], { next: "/admin/reports/products" });
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "csv" ? "csv" : "html";
  const q = searchParams.get("q")?.trim() ?? "";

  const products = await db.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      name: true,
      sku: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      status: true,
      featured: true,
      soldCount: true,
      ratingAverage: true,
      ratingCount: true,
      category: { select: { name: true } },
    },
  });

  const active = products.filter((p) => p.status === "ACTIVE");
  const inventoryValue = active.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = active.filter((p) => p.stock < 15).length;

  if (format === "csv") {
    const csv = toCsv(
      [
        "SKU",
        "Name",
        "Category",
        "Status",
        "Featured",
        "Price",
        "Compare at",
        "Stock",
        "Sold",
        "Rating avg",
        "Rating count",
        "Inventory value",
      ],
      products.map((p) => [
        p.sku,
        p.name,
        p.category.name,
        p.status,
        p.featured ? "Yes" : "No",
        p.price,
        p.compareAtPrice ?? "",
        p.stock,
        p.soldCount,
        p.ratingAverage,
        p.ratingCount,
        p.price * p.stock,
      ]),
    );
    return csvResponse(csv, reportFilename("product-inventory", "csv"));
  }

  const rows = products
    .map(
      (p) => `
      <tr>
        <td class="mono">${escapeHtml(p.sku)}</td>
        <td>
          <strong>${escapeHtml(p.name)}</strong>
          ${p.featured ? `<br/><span class="badge">Featured</span>` : ""}
        </td>
        <td>${escapeHtml(p.category.name)}</td>
        <td><span class="badge">${escapeHtml(p.status)}</span></td>
        <td class="num mono">${escapeHtml(formatReportMoney(p.price))}</td>
        <td class="num" style="${p.stock < 15 ? "color:#b45309;font-weight:700" : ""}">${p.stock}</td>
        <td class="num">${p.soldCount}</td>
        <td class="num mono">${escapeHtml(formatReportMoney(p.price * p.stock))}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <table class="data">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Product</th>
          <th>Category</th>
          <th>Status</th>
          <th class="num">Price</th>
          <th class="num">Stock</th>
          <th class="num">Sold</th>
          <th class="num">Stock value</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="8" style="text-align:center;padding:28px;color:#5c6478">No products found.</td></tr>`}
      </tbody>
    </table>
    <div class="totals">
      <div class="row"><span>SKUs listed</span><span>${products.length}</span></div>
      <div class="row"><span>Active SKUs</span><span>${active.length}</span></div>
      <div class="row"><span>Low stock (&lt; 15)</span><span>${lowStock}</span></div>
      <div class="row"><span>Active inventory value</span><span>${escapeHtml(formatReportMoney(inventoryValue))}</span></div>
    </div>
  `;

  const html = reportDocument({
    title: "Product inventory statement",
    subtitle: "Catalog register with stock position and inventory valuation.",
    meta: [
      { label: "Search", value: q || "—" },
      { label: "SKUs", value: String(products.length) },
      { label: "Low stock", value: String(lowStock) },
      { label: "Currency", value: "USD" },
    ],
    body,
  });

  return htmlResponse(html, reportFilename("product-inventory", "html"));
}
