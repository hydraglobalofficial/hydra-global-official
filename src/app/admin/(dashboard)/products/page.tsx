import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AdminHeader, Card, Panel, StatusBadge, Table } from "@/components/admin/admin-ui";
import { ReportActions } from "@/components/admin/report-actions";
import { ButtonLink } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Products" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const { q, saved } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const products = await db.product.findMany({
    where: query
      ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }] }
      : undefined,
    orderBy: { updatedAt: "desc" },
    take: 120,
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      status: true,
      featured: true,
      soldCount: true,
      category: { select: { name: true } },
      images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
    },
  });

  const active = products.filter((p) => p.status === "ACTIVE");
  const inventoryValue = active.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = active.filter((p) => p.stock < 15).length;
  const qs = query ? `q=${encodeURIComponent(query)}` : "";
  const htmlHref = `/admin/reports/products${qs ? `?${qs}` : ""}`;
  const csvHref = `/admin/reports/products?${qs ? `${qs}&` : ""}format=csv`;

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Catalog"
        title="Products"
        description="Manage the catalog and download a formal inventory statement."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ReportActions htmlHref={htmlHref} csvHref={csvHref} label="Inventory statement" />
            <ButtonLink href="/admin/products/new">
              <Plus size={16} /> New product
            </ButtonLink>
          </div>
        }
      />

      {saved && (
        <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">Product saved.</p>
      )}

      <Card className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">SKUs</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{products.length}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Active</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{active.length}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Low stock</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-warning">{lowStock}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Stock value</p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums sm:text-2xl">{formatPrice(inventoryValue)}</p>
        </div>
      </Card>

      <form className="relative max-w-sm">
        <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name or SKU…"
          className="h-11 w-full rounded-xl border border-white/10 bg-black/30 py-2 pl-9 pr-4 text-sm focus:border-accent/50 focus:outline-none"
        />
      </form>

      <Panel title="Catalog register">
        <ul className="divide-y divide-white/[0.05] sm:hidden">
          {products.map((p) => (
            <li key={p.id} className="px-4 py-3.5">
              <Link href={`/admin/products/${p.id}`} className="flex items-start gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  {p.images[0] && <ProductImage src={p.images[0].url} alt="" fill sizes="48px" className="object-contain p-1" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{p.name}</span>
                  <span className="mt-0.5 block font-mono text-xs text-subtle">{p.sku}</span>
                  <span className="mt-2 flex items-center justify-between gap-2">
                    <StatusBadge status={p.status} />
                    <span className="font-mono text-sm tabular-nums">{formatPrice(p.price)}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden sm:block">
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-right">Price</th>
                <th className="text-right">Stock</th>
                <th className="text-right">Sold</th>
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 transition-colors hover:text-accent">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        {p.images[0] && (
                          <ProductImage src={p.images[0].url} alt="" fill sizes="44px" className="object-contain p-1" />
                        )}
                      </span>
                      <span>
                        <span className="block font-medium">{p.name}</span>
                        <span className="font-mono text-xs text-subtle">
                          {p.sku}
                          {p.featured ? " · featured" : ""}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="text-muted">{p.category.name}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="text-right font-mono tabular-nums">{formatPrice(p.price)}</td>
                  <td className={`text-right font-mono tabular-nums ${p.stock < 15 ? "text-warning" : ""}`}>{p.stock}</td>
                  <td className="text-right font-mono tabular-nums text-muted">{p.soldCount}</td>
                  <td className="text-right font-mono tabular-nums text-muted">{formatPrice(p.price * p.stock)}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Panel>
    </div>
  );
}
