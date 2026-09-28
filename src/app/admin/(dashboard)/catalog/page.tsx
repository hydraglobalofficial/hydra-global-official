import { Plus, Trash2 } from "lucide-react";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { createCategory, createDevice, deleteCategory, deleteDevice } from "@/server/actions/admin";

export const metadata = { title: "Categories & Devices" };

export default async function AdminCatalogPage() {
  const session = await requireAdmin();
  const isOwner = session.role === "OWNER";
  const [categories, devices] = await Promise.all([
    db.category.findMany({ orderBy: { position: "asc" }, include: { _count: { select: { products: true } } } }),
    db.device.findMany({ orderBy: [{ brand: "asc" }, { position: "asc" }], include: { _count: { select: { products: true } } } }),
  ]);

  return (
    <>
      <AdminHeader title="Categories & Devices" description="These drive the mega menu, device finder and shop filters." />
      <div className="grid gap-8 xl:grid-cols-2">
        <section className="space-y-4">
          <h2 className="font-medium">Categories</h2>
          <Card className="p-4">
            <form action={createCategory} className="flex flex-col gap-3 sm:flex-row">
              <Input name="name" placeholder="Category name" required />
              <Input name="description" placeholder="Short description" />
              <Button type="submit" size="sm" className="h-12"><Plus size={14} /> Add</Button>
            </form>
          </Card>
          <Card className="divide-y divide-line">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-subtle">/{c.slug} · {c._count.products} products</p>
                </div>
                {isOwner && c._count.products === 0 && (
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="rounded-full p-2 text-muted hover:text-danger" aria-label={`Delete ${c.name}`}><Trash2 size={14} /></button>
                  </form>
                )}
              </div>
            ))}
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="font-medium">Devices</h2>
          <Card className="p-4">
            <form action={createDevice} className="grid gap-3 sm:grid-cols-[8rem_1fr_1fr_auto]">
              <Select name="brand" defaultValue="APPLE"><option value="APPLE">Apple</option><option value="SAMSUNG">Samsung</option></Select>
              <Input name="series" placeholder="Series (iPhone 17)" required />
              <Input name="model" placeholder="Model (iPhone 17 Pro)" required />
              <Button type="submit" size="sm" className="h-12"><Plus size={14} /> Add</Button>
            </form>
          </Card>
          <Card className="max-h-[36rem] divide-y divide-line overflow-y-auto">
            {devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div>
                  <p className="font-medium">{d.model}</p>
                  <p className="text-xs text-subtle">{d.brand.toLowerCase()} · {d.series} · {d._count.products} products</p>
                </div>
                {isOwner && (
                  <form action={deleteDevice}>
                    <input type="hidden" name="id" value={d.id} />
                    <button type="submit" className="rounded-full p-2 text-muted hover:text-danger" aria-label={`Delete ${d.model}`}><Trash2 size={14} /></button>
                  </form>
                )}
              </div>
            ))}
          </Card>
        </section>
      </div>
    </>
  );
}
