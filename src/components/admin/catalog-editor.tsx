import { Check, Smartphone, Tags, Trash2 } from "lucide-react";
import { ImageUrlField } from "@/components/admin/media-uploader";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  deleteBrand,
  deleteCategory,
  deleteDevice,
  updateBrand,
  updateCategory,
  updateDevice,
} from "@/server/actions/admin";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

type BrandRow = {
  id: string;
  slug: string;
  code: string;
  label: string;
  shortLabel: string | null;
  blurb: string;
  image: string | null;
  deviceCount: number;
};

type DeviceRow = {
  id: string;
  brand: string;
  series: string;
  model: string;
  slug: string;
  productCount: number;
};

type BrandOpt = { code: string; label: string; shortLabel: string | null };

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
      {children}
    </span>
  );
}

function MetaChip({
  slug,
  count,
  tone = "default",
}: {
  slug: string;
  count: number;
  tone?: "default" | "accent";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-md border border-white/[0.07] bg-black/25 px-2 py-1 font-mono text-[11px] text-blue-200/90">
        /{slug}
      </span>
      <span
        className={cn(
          "rounded-md px-2 py-1 font-mono text-[11px] tabular-nums",
          tone === "accent"
            ? "bg-accent/20 text-blue-100"
            : count === 0
              ? "bg-white/[0.04] text-zinc-500"
              : "bg-white/[0.06] text-zinc-300",
        )}
      >
        {count} {count === 1 ? "product" : "products"}
      </span>
    </div>
  );
}

const rowShell =
  "group relative space-y-4 border-b border-line px-4 py-6 transition-colors last:border-b-0 hover:bg-surface-2/70 sm:px-5";

const control =
  "admin-field h-11 text-[13.5px] placeholder:text-subtle focus:border-accent/50";

export function CategoryEditor({
  categories,
  canDelete,
}: {
  categories: CategoryRow[];
  canDelete: boolean;
}) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
        <Tags size={22} className="text-zinc-600" />
        <p className="text-sm text-zinc-400">No categories yet</p>
        <p className="text-xs text-zinc-600">Add the first one above.</p>
      </div>
    );
  }

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id} className={rowShell}>
          <form action={updateCategory} className="space-y-4">
            <input type="hidden" name="id" value={category.id} />
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_auto] sm:items-end">
              <label className="min-w-0">
                <FieldLabel>Name</FieldLabel>
                <Input name="name" defaultValue={category.name} placeholder="Category name" required className={control} />
              </label>
              <label className="min-w-0">
                <FieldLabel>Description</FieldLabel>
                <Input
                  name="description"
                  defaultValue={category.description ?? ""}
                  placeholder="Short description"
                  className={control}
                />
              </label>
              <Button type="submit" size="sm" className="h-11 shrink-0 px-4">
                <Check size={14} /> Save
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <MetaChip slug={category.slug} count={category.productCount} />
              {category.productCount > 0 ? (
                <span className="text-[11px] text-zinc-600">Linked to products</span>
              ) : null}
            </div>
          </form>
          {canDelete && category.productCount === 0 ? (
            <form action={deleteCategory} className="-mt-1">
              <input type="hidden" name="id" value={category.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={13} /> Delete
              </button>
            </form>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function BrandEditor({
  brands,
  canDelete,
}: {
  brands: BrandRow[];
  canDelete: boolean;
}) {
  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
        <Tags size={22} className="text-zinc-600" />
        <p className="text-sm text-zinc-400">No brands yet</p>
        <p className="text-xs text-zinc-600">Add iPhone, Samsung, Google — whatever you sell.</p>
      </div>
    );
  }

  return (
    <div>
      {brands.map((brand) => (
        <div key={brand.id} className={rowShell}>
          <form action={updateBrand} className="space-y-4">
            <input type="hidden" name="id" value={brand.id} />
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:items-end">
              <label className="min-w-0">
                <FieldLabel>Label</FieldLabel>
                <Input name="label" defaultValue={brand.label} placeholder="Samsung Galaxy" required className={control} />
              </label>
              <label className="min-w-0">
                <FieldLabel>Short label</FieldLabel>
                <Input name="shortLabel" defaultValue={brand.shortLabel ?? ""} placeholder="Samsung" className={control} />
              </label>
              <Button type="submit" size="sm" className="h-11 shrink-0 px-4">
                <Check size={14} /> Save
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="min-w-0">
                <FieldLabel>URL slug</FieldLabel>
                <Input name="slug" defaultValue={brand.slug} placeholder="samsung" required className={cn(control, "font-mono")} />
              </label>
              <label className="min-w-0">
                <FieldLabel>Code</FieldLabel>
                <Input name="code" defaultValue={brand.code} placeholder="SAMSUNG" required className={cn(control, "font-mono")} />
              </label>
            </div>
            <label className="block min-w-0">
              <FieldLabel>Blurb</FieldLabel>
              <Input name="blurb" defaultValue={brand.blurb} placeholder="Shown on shop brand pages" className={control} />
            </label>
            <div className="min-w-0">
              <FieldLabel>Shop-by-Device image</FieldLabel>
              <ImageUrlField
                key={`brand-image-${brand.id}-${brand.image ?? ""}`}
                name="image"
                defaultValue={brand.image ?? ""}
                folder="brands"
                placeholder="Upload from device (Cloudflare R2)"
              />
              <p className="mt-1.5 text-[11px] text-zinc-500">
                Upload a camera-crop phone-back photo — publishes to Cloudflare R2. Leave empty for the illustrated fallback.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <MetaChip slug={`shop/${brand.slug}`} count={brand.deviceCount} tone="accent" />
              <span className="font-mono text-[11px] text-zinc-500">{brand.code}</span>
            </div>
          </form>
          {canDelete && brand.deviceCount === 0 ? (
            <form action={deleteBrand} className="-mt-1">
              <input type="hidden" name="id" value={brand.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={13} /> Delete
              </button>
            </form>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function DeviceEditor({
  devices,
  brands,
  canDelete,
}: {
  devices: DeviceRow[];
  brands: BrandOpt[];
  canDelete: boolean;
}) {
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
        <Smartphone size={22} className="text-zinc-600" />
        <p className="text-sm text-zinc-400">No devices yet</p>
        <p className="text-xs text-zinc-600">Add the first one above.</p>
      </div>
    );
  }

  return (
    <div>
      {devices.map((device) => (
        <div key={device.id} className={rowShell}>
          <form action={updateDevice} className="space-y-4">
            <input type="hidden" name="id" value={device.id} />
            <div className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.1fr)_auto] sm:items-end">
              <label className="min-w-0">
                <FieldLabel>Brand</FieldLabel>
                <Select name="brand" defaultValue={device.brand} className={control}>
                  {brands.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.shortLabel || b.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="min-w-0">
                <FieldLabel>Series</FieldLabel>
                <Input name="series" defaultValue={device.series} placeholder="Series" required className={control} />
              </label>
              <label className="min-w-0">
                <FieldLabel>Model</FieldLabel>
                <Input name="model" defaultValue={device.model} placeholder="Model" required className={control} />
              </label>
              <Button type="submit" size="sm" className="h-11 shrink-0 px-4">
                <Check size={14} /> Save
              </Button>
            </div>
            <MetaChip slug={device.slug} count={device.productCount} tone="accent" />
          </form>
          {canDelete ? (
            <form action={deleteDevice} className="-mt-1">
              <input type="hidden" name="id" value={device.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={13} /> Delete
              </button>
            </form>
          ) : null}
        </div>
      ))}
    </div>
  );
}
