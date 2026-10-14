import { Smartphone, Tags } from "lucide-react";
import { AdminHeader, Card, Panel } from "@/components/admin/admin-ui";
import { BrandSection, CategorySection, DeviceSection } from "@/components/admin/catalog-editor";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "Categories, Brands & Devices" };

export default async function AdminCatalogPage() {
  await requireAdmin();
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
        description="Clean list view — tap a row to edit. Add forms stay collapsed until you need them."
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
        <BrandSection
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
          <CategorySection
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
          <div className="min-h-0 overflow-y-auto xl:max-h-[calc(100dvh-18rem)]">
            <DeviceSection
              brands={brandOpts}
              defaultBrand={defaultBrand}
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
