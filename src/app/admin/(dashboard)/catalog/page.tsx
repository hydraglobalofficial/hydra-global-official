import { FolderTree, Plus, Smartphone, Tags } from "lucide-react";
import { AdminHeader, Card, Panel } from "@/components/admin/admin-ui";
import { BrandEditor, CategoryEditor, DeviceEditor } from "@/components/admin/catalog-editor";
import { ImageUrlField } from "@/components/admin/media-uploader";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { createBrand, createCategory, createDevice } from "@/server/actions/admin";

export const metadata = { title: "Categories, Brands & Devices" };

const addControl =
  "admin-field h-11 text-[13.5px] placeholder:text-subtle focus:border-accent/50";

export default async function AdminCatalogPage() {
  const session = await requireAdmin();
  const isOwner = session.role === "OWNER";
  const [categories, brands, devices] = await Promise.all([
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
    db.brand.findMany({
      orderBy: [{ position: "asc" }, { label: "asc" }],
      select: {
        id: true,
        slug: true,
        code: true,
        label: true,
        shortLabel: true,
        blurb: true,
        image: true,
        position: true,
        _count: { select: { devices: true } },
      },
    }),
    db.device.findMany({
      orderBy: [{ brand: { position: "asc" } }, { position: "asc" }],
      select: {
        id: true,
        series: true,
        model: true,
        slug: true,
        position: true,
        brand: { select: { code: true, label: true, shortLabel: true } },
        _count: { select: { products: true } },
      },
    }),
  ]);

  const categoryProducts = categories.reduce((sum, c) => sum + c._count.products, 0);
  const brandOpts = brands.map((b) => ({
    code: b.code,
    label: b.label,
    shortLabel: b.shortLabel,
  }));
  const defaultBrand = brands[0]?.code ?? "APPLE";

  return (
    <div className="space-y-7">
      <AdminHeader
        eyebrow="Catalog"
        title="Categories, Brands & Devices"
        description="Add brands once — they power the device finder, shop filters, mega menu, and footer everywhere."
      />

      <Card className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 sm:gap-5 sm:p-5" glow>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Categories</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-fg">{categories.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Brands</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-fg">{brands.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Devices</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-fg">{devices.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Linked SKUs</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-blue-200">{categoryProducts}</p>
        </div>
      </Card>

      <Panel
        title="Brands"
        icon={<Tags size={14} className="text-accent" />}
        action={
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            {brands.length} total
          </span>
        }
      >
        <div className="border-b border-white/[0.05] bg-accent/[0.06] px-4 py-4 sm:px-5">
          <div className="mb-3 flex items-center gap-2">
            <Tags size={14} className="text-blue-300" />
            <p className="text-xs font-medium text-zinc-300">Add brand</p>
          </div>
          <form action={createBrand} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto] lg:items-end">
            <label className="min-w-0">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Label
              </span>
              <Input name="label" placeholder="Google Pixel" required className={addControl} />
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Short
              </span>
              <Input name="shortLabel" placeholder="Pixel" className={addControl} />
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Slug
              </span>
              <Input name="slug" placeholder="pixel" className={addControl} />
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Blurb
              </span>
              <Input name="blurb" placeholder="Shop page description" className={addControl} />
            </label>
            <div className="min-w-0">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Image (R2)
              </span>
              <ImageUrlField name="image" folder="brands" placeholder="Upload phone-back photo" />
            </div>
            <Button type="submit" size="sm" className="h-11">
              <Plus size={14} /> Add
            </Button>
          </form>
        </div>
        <BrandEditor
          canDelete={isOwner}
          brands={brands.map((b) => ({
            id: b.id,
            slug: b.slug,
            code: b.code,
            label: b.label,
            shortLabel: b.shortLabel,
            blurb: b.blurb,
            image: b.image,
            deviceCount: b._count.devices,
          }))}
        />
      </Panel>

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
                <Select name="brand" defaultValue={defaultBrand} className={addControl}>
                  {brandOpts.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.shortLabel || b.label}
                    </option>
                  ))}
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
              brands={brandOpts}
              devices={devices.map((d) => ({
                id: d.id,
                brand: d.brand.code,
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
