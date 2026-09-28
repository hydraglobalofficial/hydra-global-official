import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader, StatusBadge, Table } from "@/components/admin/admin-ui";
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
    where: query ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }] } : undefined,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, name: true, sku: true, price: true, stock: true, status: true, featured: true, soldCount: true,
      category: { select: { name: true } },
      images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Products"
        description={`${products.length} products`}
        action={<ButtonLink href="/admin/products/new"><Plus size={16} /> New product</ButtonLink>}
      />
      {saved && <p className="mb-6 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">Product saved.</p>}
      <form className="mb-6">
        <input name="q" defaultValue={query} placeholder="Search name or SKU…" className="h-11 w-full max-w-sm rounded-xl border border-line bg-surface-2 px-4 text-sm focus:border-accent/60 focus:outline-none" />
      </form>
      <Table>
        <thead>
          <tr><th>Product</th><th>Category</th><th>Status</th><th className="text-right">Price</th><th className="text-right">Stock</th><th className="text-right">Sold</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-accent">
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                    {p.images[0] && <ProductImage src={p.images[0].url} alt="" fill sizes="40px" className="object-contain p-1" />}
                  </span>
                  <span>
                    <span className="block font-medium">{p.name}</span>
                    <span className="font-mono text-xs text-subtle">{p.sku}{p.featured && " · featured"}</span>
                  </span>
                </Link>
              </td>
              <td className="text-muted">{p.category.name}</td>
              <td><StatusBadge status={p.status} /></td>
              <td className="text-right font-mono">{formatPrice(p.price)}</td>
              <td className={`text-right font-mono ${p.stock < 15 ? "text-warning" : ""}`}>{p.stock}</td>
              <td className="text-right font-mono text-muted">{p.soldCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
