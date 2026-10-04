import { AdminHeader } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, devices] = await Promise.all([
    db.category.findMany({ select: { id: true, name: true }, orderBy: { position: "asc" } }),
    db.device.findMany({
      select: { id: true, model: true, brand: true, series: true },
      orderBy: [{ brand: "asc" }, { position: "asc" }],
    }),
  ]);

  return (
    <>
      <AdminHeader title="New product" />
      <ProductForm
        categories={categories}
        devices={devices}
        initial={{
          name: "", slug: "", tagline: "", description: "", sku: "", price: "", compareAtPrice: "", stock: "",
          status: "DRAFT", featured: false, categoryId: "", deviceIds: [], highlights: "", imageUrls: "",
        }}
      />
    </>
  );
}
