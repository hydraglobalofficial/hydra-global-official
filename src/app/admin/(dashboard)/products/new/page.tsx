import { AdminHeader } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, brands, devices] = await Promise.all([
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

  return (
    <>
      <AdminHeader title="New product" />
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
          name: "", slug: "", tagline: "", description: "", sku: "", price: "", compareAtPrice: "", stock: "",
          status: "DRAFT", featured: false, categoryId: "", deviceIds: [], highlights: "", imageUrls: "",
        }}
      />
    </>
  );
}
