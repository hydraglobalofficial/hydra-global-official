import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { deleteProduct } from "@/server/actions/admin";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories, brands, devices] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { devices: true, images: { orderBy: { position: "asc" } } } }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { position: "asc" } }),
    db.brand.findMany({
      select: { code: true, label: true, shortLabel: true },
      orderBy: [{ position: "asc" }, { label: "asc" }],
    }),
    db.device.findMany({
      select: {
        id: true,
        model: true,
        series: true,
        brand: { select: { code: true } },
      },
      orderBy: [{ brand: { position: "asc" } }, { position: "asc" }],
    }),
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
            <ConfirmDeleteForm
              action={deleteProduct}
              title={`Delete “${product.name}”?`}
              text="If this SKU has order history it will be archived. Otherwise it’s permanently removed."
            >
              <input type="hidden" name="id" value={product.id} />
              <Button type="submit" variant="danger" size="sm"><Trash2 size={14} /> Delete</Button>
            </ConfirmDeleteForm>
          </div>
        }
      />
      <ProductForm
        categories={categories}
        brands={brands}
        devices={devices.map((d) => ({
          id: d.id,
          model: d.model,
          series: d.series,
          brand: d.brand.code,
        }))}
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
          specs: Object.entries((product.specs ?? {}) as Record<string, string>).map(([key, value]) => ({
            key,
            value,
          })),
        }}
      />
    </>
  );
}
