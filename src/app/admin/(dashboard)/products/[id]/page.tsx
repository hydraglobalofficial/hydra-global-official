import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { deleteProduct } from "@/server/actions/admin";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const session = await requireAdmin();
  const { id } = await params;
  const [product, categories, devices] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { devices: true, images: { orderBy: { position: "asc" } } } }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { position: "asc" } }),
    db.device.findMany({ select: { id: true, model: true, brand: true }, orderBy: [{ brand: "asc" }, { position: "asc" }] }),
  ]);
  if (!product) notFound();

  return (
    <>
      <AdminHeader
        title={product.name}
        description={`SKU ${product.sku}`}
        action={
          <div className="flex items-center gap-2">
            <Link href={`/product/${product.slug}`} target="_blank" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-fg">
              <ExternalLink size={14} /> View
            </Link>
            {session.role === "OWNER" && (
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={product.id} />
                <Button type="submit" variant="danger" size="sm"><Trash2 size={14} /> Delete</Button>
              </form>
            )}
          </div>
        }
      />
      <ProductForm
        categories={categories}
        devices={devices}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          tagline: product.tagline ?? "",
          description: product.description,
          sku: product.sku,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? "",
          stock: product.stock,
          status: product.status,
          featured: product.featured,
          categoryId: product.categoryId,
          deviceIds: product.devices.map((d) => d.deviceId),
          highlights: product.highlights.join("\n"),
          imageUrls: product.images.map((i) => i.url).join("\n"),
        }}
      />
    </>
  );
}
