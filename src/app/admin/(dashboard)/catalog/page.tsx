import { FolderTree, Plus, Smartphone, Tags } from "lucide-react";
import { AdminHeader, Card, Panel } from "@/components/admin/admin-ui";
import { CategoryEditor, DeviceEditor } from "@/components/admin/catalog-editor";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { createCategory, createDevice } from "@/server/actions/admin";

export const metadata = { title: "Categories & Devices" };

const addControl =
  "h-11 border-white/[0.08] bg-black/30 text-[13.5px] text-zinc-100 placeholder:text-zinc-600 focus:border-accent/50 focus:bg-black/40";

export default async function AdminCatalogPage() {
  const session = await requireAdmin();
  const isOwner = session.role === "OWNER";
  const [categories, devices] = await Promise.all([
    db.category.findMany({
      orderBy: { position: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        position: true,
        _count: { select: { products: true } },
      },
    }),
    db.device.findMany({
      orderBy: [{ brand: "asc" }, { position: "asc" }],
      select: {
        id: true,
        brand: true,
        series: true,
        model: true,
        slug: true,
        position: true,
        _count: { select: { products: true } },
      },
    }),
  ]);

  const categoryProducts = categories.reduce((sum, c) => sum + c._count.products, 0);
  const appleCount = devices.filter((d) => d.brand === "APPLE").length;
  const samsungCount = devices.filter((d) => d.brand === "SAMSUNG").length;

  return (
    <div className="space-y-7">
      <AdminHeader
        eyebrow="Catalog"
        title="Categories & Devices"
        description="Power the mega menu, device finder, and shop filters. Edit a row, then Save."
      />

      <Card className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 sm:gap-5 sm:p-5" glow>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Categories</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-fg">{categories.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Devices</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-fg">{devices.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Linked SKUs</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-blue-200">{categoryProducts}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Brands</p>
          <p className="mt-1.5 text-sm font-medium text-zinc-200">
            <span className="font-mono tabular-nums text-fg">{appleCount}</span>
            <span className="mx-1.5 text-zinc-600">Apple</span>
            <span className="text-zinc-700">·</span>
            <span className="ml-1.5 font-mono tabular-nums text-fg">{samsungCount}</span>
            <span className="ml-1.5 text-zinc-600">Samsung</span>
          </p>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2 xl:gap-7">
        <Panel
          title="Categories"
          icon={<Tags size={14} className="text-accent" />}
          action={
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              {categories.length} total
            </span>
          }
        >
          <div className="border-b border-white/[0.05] bg-accent/[0.06] px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center gap-2">
              <FolderTree size={14} className="text-blue-300" />
              <p className="text-xs font-medium text-zinc-300">Add category</p>
            </div>
            <form action={createCategory} className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_auto] sm:items-end">
              <label className="min-w-0">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  Name
                </span>
                <Input name="name" placeholder="e.g. Privacy Glass" required className={addControl} />
              </label>
              <label className="min-w-0">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  Description
                </span>
                <Input name="description" placeholder="Short line for menus" className={addControl} />
              </label>
              <Button type="submit" size="sm" className="h-11">
                <Plus size={14} /> Add
              </Button>
            </form>
          </div>
          <CategoryEditor
            canDelete={isOwner}
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description,
              productCount: c._count.products,
            }))}
          />
        </Panel>

        <Panel
          title="Devices"
          icon={<Smartphone size={14} className="text-accent" />}
          action={
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              {devices.length} total
            </span>
          }
          className="xl:max-h-[calc(100dvh-12rem)]"
        >
          <div className="border-b border-white/[0.05] bg-accent/[0.06] px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone size={14} className="text-blue-300" />
              <p className="text-xs font-medium text-zinc-300">Add device</p>
            </div>
            <form action={createDevice} className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.1fr)_auto] sm:items-end">
              <label className="min-w-0">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  Brand
                </span>
                <Select name="brand" defaultValue="APPLE" className={addControl}>
                  <option value="APPLE">Apple</option>
                  <option value="SAMSUNG">Samsung</option>
                </Select>
              </label>
              <label className="min-w-0">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  Series
                </span>
                <Input name="series" placeholder="iPhone 17" required className={addControl} />
              </label>
              <label className="min-w-0">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  Model
                </span>
                <Input name="model" placeholder="iPhone 17 Pro Max" required className={addControl} />
              </label>
              <Button type="submit" size="sm" className="h-11">
                <Plus size={14} /> Add
              </Button>
            </form>
          </div>
          <div className="min-h-0 overflow-y-auto xl:max-h-[calc(100dvh-22rem)]">
            <DeviceEditor
              canDelete={isOwner}
              devices={devices.map((d) => ({
                id: d.id,
                brand: d.brand,
                series: d.series,
                model: d.model,
                slug: d.slug,
                productCount: d._count.products,
              }))}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
