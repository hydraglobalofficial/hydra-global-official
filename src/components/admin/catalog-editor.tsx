"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Plus, Search, Smartphone, Tags, Trash2 } from "lucide-react";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { ImageUrlField } from "@/components/admin/media-uploader";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  createBrand,
  createCategory,
  createDevice,
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

const control =
  "admin-field h-11 text-[13.5px] placeholder:text-subtle focus:border-accent/50";

const deleteBtn =
  "inline-flex items-center gap-1.5 rounded-full border border-danger/35 bg-danger/5 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/15";

const deleteBtnLg =
  "inline-flex h-11 items-center gap-1.5 rounded-full border border-danger/40 bg-danger/10 px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/20";

function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
      {icon}
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="text-xs text-zinc-600">{hint}</p>
    </div>
  );
}

function AddToggle({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-accent/[0.05]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-accent/[0.08] sm:px-5"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full border border-accent/30 bg-accent/15 text-accent">
            <Plus size={16} />
          </span>
          <span>
            <span className="block text-sm font-medium text-fg">{label}</span>
            <span className="block text-[11px] text-subtle">
              {open ? "Fill the form below, then save" : "Tap to open the form"}
            </span>
          </span>
        </span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="border-t border-line/80 px-4 pb-4 pt-3 sm:px-5">{children}</div> : null}
    </div>
  );
}

function ListRow({
  open,
  onToggle,
  title,
  subtitle,
  badges,
  thumb,
  deleteSlot,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  thumb?: ReactNode;
  deleteSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-b border-line last:border-b-0",
        open ? "bg-surface-2/40" : "hover:bg-surface-2/50",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {thumb}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-fg">{title}</span>
            {subtitle ? <span className="mt-0.5 block truncate text-xs text-subtle">{subtitle}</span> : null}
            {badges ? <span className="mt-1.5 flex flex-wrap gap-1.5">{badges}</span> : null}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "shrink-0 text-muted transition-transform",
              open && "rotate-180 text-accent",
            )}
          />
        </button>
        {deleteSlot}
      </div>
      {open ? (
        <div className="space-y-4 border-t border-line/70 px-4 pb-5 pt-4 sm:px-5">{children}</div>
      ) : null}
    </div>
  );
}

function Chip({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 font-mono text-[10px] tabular-nums",
        tone === "accent" ? "bg-accent/20 text-blue-100" : "bg-white/[0.05] text-zinc-400",
      )}
    >
      {children}
    </span>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative border-b border-line px-4 py-3 sm:px-5">
      <Search size={14} className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-subtle sm:left-8" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-field h-10 w-full rounded-xl py-2 pl-9 pr-3 text-sm focus:border-accent/50 focus:outline-none"
      />
    </div>
  );
}

export function BrandSection({ brands }: { brands: BrandRow[] }) {
  const [adding, setAdding] = useState(brands.length === 0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (b) =>
        b.label.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.shortLabel ?? "").toLowerCase().includes(q),
    );
  }, [brands, query]);

  return (
    <div>
      <AddToggle label="Add new brand" open={adding} onToggle={() => setAdding((v) => !v)}>
        <form action={createBrand} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="min-w-0 sm:col-span-1">
            <FieldLabel>Label</FieldLabel>
            <Input name="label" placeholder="Google Pixel" required className={control} />
          </label>
          <label className="min-w-0">
            <FieldLabel>Short label</FieldLabel>
            <Input name="shortLabel" placeholder="Pixel" className={control} />
          </label>
          <label className="min-w-0">
            <FieldLabel>Slug</FieldLabel>
            <Input name="slug" placeholder="pixel" className={cn(control, "font-mono")} />
          </label>
          <label className="min-w-0 sm:col-span-2">
            <FieldLabel>Blurb</FieldLabel>
            <Input name="blurb" placeholder="Shop page description" className={control} />
          </label>
          <div className="min-w-0 sm:col-span-2 lg:col-span-3">
            <FieldLabel>Shop-by-Device image</FieldLabel>
            <ImageUrlField name="image" folder="brands" placeholder="Upload phone-back photo" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" size="sm" className="h-11 px-5">
              <Plus size={14} /> Add brand
            </Button>
          </div>
        </form>
      </AddToggle>

      {brands.length > 3 ? (
        <SearchBar value={query} onChange={setQuery} placeholder="Search brands…" />
      ) : null}

      {brands.length === 0 ? (
        <EmptyState
          icon={<Tags size={22} className="text-zinc-600" />}
          title="No brands yet"
          hint="Open Add new brand above to create the first one."
        />
      ) : filtered.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">No brands match “{query}”.</p>
      ) : (
        filtered.map((brand) => {
          const open = openId === brand.id;
          return (
            <ListRow
              key={brand.id}
              open={open}
              onToggle={() => setOpenId(open ? null : brand.id)}
              title={brand.label}
              subtitle={`${brand.shortLabel || brand.code} · /shop/${brand.slug}`}
              thumb={
                <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
                  {brand.image ? (
                    <img src={brand.image} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-subtle">
                      <Tags size={16} />
                    </span>
                  )}
                </span>
              }
              badges={
                <>
                  <Chip tone="accent">{brand.deviceCount} devices</Chip>
                  <Chip>{brand.code}</Chip>
                </>
              }
              deleteSlot={
                <ConfirmDeleteForm
                  action={deleteBrand}
                  title={`Delete “${brand.label}”?`}
                  text={
                    brand.deviceCount > 0
                      ? `Removes this brand and all ${brand.deviceCount} device(s). Products stay.`
                      : "This brand will be permanently deleted."
                  }
                >
                  <input type="hidden" name="id" value={brand.id} />
                  <button type="submit" className={deleteBtn}>
                    <Trash2 size={13} /> Delete
                  </button>
                </ConfirmDeleteForm>
              }
            >
              <form action={updateBrand} className="space-y-4">
                <input type="hidden" name="id" value={brand.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="min-w-0">
                    <FieldLabel>Label</FieldLabel>
                    <Input name="label" defaultValue={brand.label} required className={control} />
                  </label>
                  <label className="min-w-0">
                    <FieldLabel>Short label</FieldLabel>
                    <Input name="shortLabel" defaultValue={brand.shortLabel ?? ""} className={control} />
                  </label>
                  <label className="min-w-0">
                    <FieldLabel>URL slug</FieldLabel>
                    <Input name="slug" defaultValue={brand.slug} required className={cn(control, "font-mono")} />
                  </label>
                  <label className="min-w-0">
                    <FieldLabel>Code</FieldLabel>
                    <Input name="code" defaultValue={brand.code} required className={cn(control, "font-mono")} />
                  </label>
                </div>
                <label className="block min-w-0">
                  <FieldLabel>Blurb</FieldLabel>
                  <Input name="blurb" defaultValue={brand.blurb} className={control} />
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
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" size="sm" className="h-11 px-5">
                    <Check size={14} /> Save brand
                  </Button>
                  <ConfirmDeleteForm
                    action={deleteBrand}
                    title={`Delete “${brand.label}”?`}
                    text={
                      brand.deviceCount > 0
                        ? `Removes this brand and all ${brand.deviceCount} device(s). Products stay.`
                        : "This brand will be permanently deleted."
                    }
                  >
                    <input type="hidden" name="id" value={brand.id} />
                    <button type="submit" className={deleteBtnLg}>
                      <Trash2 size={14} /> Delete brand
                    </button>
                  </ConfirmDeleteForm>
                </div>
              </form>
            </ListRow>
          );
        })
      )}
    </div>
  );
}

export function CategorySection({ categories }: { categories: CategoryRow[] }) {
  const [adding, setAdding] = useState(categories.length === 0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q),
    );
  }, [categories, query]);

  return (
    <div>
      <AddToggle label="Add new category" open={adding} onToggle={() => setAdding((v) => !v)}>
        <form action={createCategory} className="grid gap-3 sm:grid-cols-[1fr_1.2fr_auto] sm:items-end">
          <label className="min-w-0">
            <FieldLabel>Name</FieldLabel>
            <Input name="name" placeholder="e.g. Privacy Glass" required className={control} />
          </label>
          <label className="min-w-0">
            <FieldLabel>Description</FieldLabel>
            <Input name="description" placeholder="Short line for menus" className={control} />
          </label>
          <Button type="submit" size="sm" className="h-11">
            <Plus size={14} /> Add
          </Button>
        </form>
      </AddToggle>

      {categories.length > 5 ? (
        <SearchBar value={query} onChange={setQuery} placeholder="Search categories…" />
      ) : null}

      {categories.length === 0 ? (
        <EmptyState
          icon={<Tags size={22} className="text-zinc-600" />}
          title="No categories yet"
          hint="Open Add new category above."
        />
      ) : filtered.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">No categories match “{query}”.</p>
      ) : (
        filtered.map((category) => {
          const open = openId === category.id;
          return (
            <ListRow
              key={category.id}
              open={open}
              onToggle={() => setOpenId(open ? null : category.id)}
              title={category.name}
              subtitle={category.description || `/${category.slug}`}
              badges={
                <>
                  <Chip tone="accent">{category.productCount} products</Chip>
                  <Chip>/{category.slug}</Chip>
                </>
              }
              deleteSlot={
                <ConfirmDeleteForm
                  action={deleteCategory}
                  title={`Delete “${category.name}”?`}
                  text={
                    category.productCount > 0
                      ? `${category.productCount} product(s) move to another category, then this is removed.`
                      : "This category will be permanently deleted."
                  }
                >
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" className={deleteBtn}>
                    <Trash2 size={13} /> Delete
                  </button>
                </ConfirmDeleteForm>
              }
            >
              <form action={updateCategory} className="space-y-4">
                <input type="hidden" name="id" value={category.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="min-w-0">
                    <FieldLabel>Name</FieldLabel>
                    <Input name="name" defaultValue={category.name} required className={control} />
                  </label>
                  <label className="min-w-0">
                    <FieldLabel>Description</FieldLabel>
                    <Input name="description" defaultValue={category.description ?? ""} className={control} />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" size="sm" className="h-11 px-5">
                    <Check size={14} /> Save category
                  </Button>
                  <ConfirmDeleteForm
                    action={deleteCategory}
                    title={`Delete “${category.name}”?`}
                    text={
                      category.productCount > 0
                        ? `${category.productCount} product(s) move to another category, then this is removed.`
                        : "This category will be permanently deleted."
                    }
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <button type="submit" className={deleteBtnLg}>
                      <Trash2 size={14} /> Delete category
                    </button>
                  </ConfirmDeleteForm>
                </div>
              </form>
            </ListRow>
          );
        })
      )}
    </div>
  );
}

export function DeviceSection({
  devices,
  brands,
  defaultBrand,
}: {
  devices: DeviceRow[];
  brands: BrandOpt[];
  defaultBrand: string;
}) {
  const [adding, setAdding] = useState(devices.length === 0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const brandLabel = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of brands) map[b.code] = b.shortLabel || b.label;
    return map;
  }, [brands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter(
      (d) =>
        d.model.toLowerCase().includes(q) ||
        d.series.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        (brandLabel[d.brand] ?? "").toLowerCase().includes(q),
    );
  }, [devices, query, brandLabel]);

  return (
    <div>
      <AddToggle label="Add new device" open={adding} onToggle={() => setAdding((v) => !v)}>
        <form
          action={createDevice}
          className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.1fr)_auto] sm:items-end"
        >
          <label className="min-w-0">
            <FieldLabel>Brand</FieldLabel>
            <Select name="brand" defaultValue={defaultBrand} className={control}>
              {brands.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.shortLabel || b.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="min-w-0">
            <FieldLabel>Series</FieldLabel>
            <Input name="series" placeholder="iPhone 17" required className={control} />
          </label>
          <label className="min-w-0">
            <FieldLabel>Model</FieldLabel>
            <Input name="model" placeholder="iPhone 17 Pro Max" required className={control} />
          </label>
          <Button type="submit" size="sm" className="h-11">
            <Plus size={14} /> Add
          </Button>
        </form>
      </AddToggle>

      {devices.length > 6 ? (
        <SearchBar value={query} onChange={setQuery} placeholder="Search devices…" />
      ) : null}

      {devices.length === 0 ? (
        <EmptyState
          icon={<Smartphone size={22} className="text-zinc-600" />}
          title="No devices yet"
          hint="Open Add new device above."
        />
      ) : filtered.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">No devices match “{query}”.</p>
      ) : (
        filtered.map((device) => {
          const open = openId === device.id;
          return (
            <ListRow
              key={device.id}
              open={open}
              onToggle={() => setOpenId(open ? null : device.id)}
              title={device.model}
              subtitle={`${brandLabel[device.brand] ?? device.brand} · ${device.series}`}
              badges={
                <>
                  <Chip tone="accent">{device.productCount} products</Chip>
                  <Chip>/{device.slug}</Chip>
                </>
              }
              deleteSlot={
                <ConfirmDeleteForm
                  action={deleteDevice}
                  title={`Delete “${device.model}”?`}
                  text={
                    device.productCount > 0
                      ? `Removed from ${device.productCount} product(s), then deleted.`
                      : "This device will be permanently deleted."
                  }
                >
                  <input type="hidden" name="id" value={device.id} />
                  <button type="submit" className={deleteBtn}>
                    <Trash2 size={13} /> Delete
                  </button>
                </ConfirmDeleteForm>
              }
            >
              <form action={updateDevice} className="space-y-4">
                <input type="hidden" name="id" value={device.id} />
                <div className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.1fr)]">
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
                    <Input name="series" defaultValue={device.series} required className={control} />
                  </label>
                  <label className="min-w-0">
                    <FieldLabel>Model</FieldLabel>
                    <Input name="model" defaultValue={device.model} required className={control} />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" size="sm" className="h-11 px-5">
                    <Check size={14} /> Save device
                  </Button>
                  <ConfirmDeleteForm
                    action={deleteDevice}
                    title={`Delete “${device.model}”?`}
                    text={
                      device.productCount > 0
                        ? `Removed from ${device.productCount} product(s), then deleted.`
                        : "This device will be permanently deleted."
                    }
                  >
                    <input type="hidden" name="id" value={device.id} />
                    <button type="submit" className={deleteBtnLg}>
                      <Trash2 size={14} /> Delete device
                    </button>
                  </ConfirmDeleteForm>
                </div>
              </form>
            </ListRow>
          );
        })
      )}
    </div>
  );
}
