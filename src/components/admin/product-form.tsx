"use client";

import { useActionState, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { DeviceCompatField, type BrandOpt, type DeviceOpt } from "@/components/admin/device-compat";
import { ImageUrlsField } from "@/components/admin/media-uploader";
import { saveProduct } from "@/server/actions/admin";
import { confirmDelete } from "@/lib/swal";
import { initialFormState } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";

type Option = { id: string; name: string };

export type SpecRow = { key: string; value: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  sku: string;
  price: number | "";
  compareAtPrice: number | "";
  stock: number | "";
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  featured: boolean;
  categoryId: string;
  deviceIds: string[];
  highlights: string;
  imageUrls: string;
  specs: SpecRow[];
};

function rowId() {
  return `spec-${Math.random().toString(36).slice(2, 10)}`;
}

function SpecsEditor({ initial }: { initial: SpecRow[] }) {
  const [rows, setRows] = useState(() =>
    (initial.length > 0 ? initial : [{ key: "", value: "" }]).map((row) => ({
      ...row,
      uid: rowId(),
    })),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Specifications</p>
          <p className="mt-1 text-xs text-subtle">Shown on the product page as a clean key / value table.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={rows.length >= 24}
          onClick={() =>
            setRows((prev) => (prev.length >= 24 ? prev : [...prev, { uid: rowId(), key: "", value: "" }]))
          }
        >
          <Plus size={14} /> Add row
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-subtle">
          No specs yet — click Add row.
        </p>
      ) : (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div
              key={row.uid}
              className="grid gap-2 rounded-xl border border-line bg-surface-2/40 p-2.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_auto] sm:items-center"
            >
              <Input
                name="specKey"
                defaultValue={row.key}
                placeholder="Label (e.g. Hardness)"
                className="text-sm"
                aria-label={`Spec ${i + 1} label`}
              />
              <Input
                name="specValue"
                defaultValue={row.value}
                placeholder="Value (e.g. 9H+)"
                className="text-sm"
                aria-label={`Spec ${i + 1} value`}
              />
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-danger/30 px-3 text-xs text-danger hover:bg-danger/10 sm:h-11"
                aria-label={`Remove spec ${i + 1}`}
                onClick={async () => {
                  const result = await confirmDelete({
                    title: `Remove spec row ${i + 1}?`,
                    text: "Save the product to apply this change.",
                    confirmText: "Yes, remove",
                  });
                  if (!result.isConfirmed) return;
                  setRows((prev) => prev.filter((r) => r.uid !== row.uid));
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductForm({
  initial,
  categories,
  devices,
  brands,
}: {
  initial: ProductFormValues;
  categories: Option[];
  devices: DeviceOpt[];
  brands: BrandOpt[];
}) {
  const [state, action, pending] = useActionState(saveProduct.bind(null, initial.id ?? null), initialFormState);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-5 sm:gap-8 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-4 sm:space-y-6 sm:p-6">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <Field label="Name" htmlFor="name" error={e.name}>
            <Input
              id="name"
              name="name"
              defaultValue={initial.name}
              required
              onBlur={(ev) => {
                const slug = ev.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (slug && !slug.value) slug.value = slugify(ev.currentTarget.value);
              }}
            />
          </Field>
          <Field label="Slug" htmlFor="slug" error={e.slug} hint="URL: /product/your-slug">
            <Input id="slug" name="slug" defaultValue={initial.slug} required className="font-mono" />
          </Field>
        </div>
        <Field label="Tagline" htmlFor="tagline" error={e.tagline}>
          <Input id="tagline" name="tagline" defaultValue={initial.tagline} />
        </Field>
        <Field label="Description" htmlFor="description" error={e.description} hint="Separate paragraphs with a blank line.">
          <Textarea id="description" name="description" defaultValue={initial.description} required className="min-h-48" />
        </Field>
        <Field label="Highlights" htmlFor="highlights" hint="One per line.">
          <Textarea id="highlights" name="highlights" defaultValue={initial.highlights} className="min-h-28" />
        </Field>

        <SpecsEditor initial={initial.specs} />

        <Field
          label="Images"
          htmlFor="imageUrls"
          hint="First image is the cover. Drag to reorder. Upload goes to Cloudflare R2."
        >
          <ImageUrlsField
            id="imageUrls"
            name="imageUrls"
            defaultValue={initial.imageUrls}
            folder="products"
            placeholder={"Upload from device → Cloudflare R2"}
          />
        </Field>
        <fieldset>
          <legend className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Compatible devices
          </legend>
          <DeviceCompatField devices={devices} brands={brands} selectedIds={initial.deviceIds} />
        </fieldset>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:space-y-5 sm:p-6">
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={initial.status}>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Field label="Category" htmlFor="categoryId" error={e.categoryId}>
            <Select id="categoryId" name="categoryId" defaultValue={initial.categoryId} required>
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial.featured} className="accent-[var(--color-accent)]" />{" "}
            Featured on homepage
          </label>
        </div>
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:space-y-5 sm:p-6">
          <Field label="SKU" htmlFor="sku" error={e.sku}>
            <Input id="sku" name="sku" defaultValue={initial.sku} required className="font-mono uppercase" />
          </Field>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Field label="Price ($)" htmlFor="price" error={e.price}>
              <Input id="price" name="price" type="number" min={0} defaultValue={initial.price} required />
            </Field>
            <Field label="Compare at ($)" htmlFor="compareAtPrice" error={e.compareAtPrice}>
              <Input id="compareAtPrice" name="compareAtPrice" type="number" min={0} defaultValue={initial.compareAtPrice} />
            </Field>
          </div>
          <Field label="Stock" htmlFor="stock" error={e.stock}>
            <Input id="stock" name="stock" type="number" min={0} defaultValue={initial.stock} required />
          </Field>
        </div>
        <FormMessage status={state.status} message={state.message} toast />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save product
        </Button>
      </div>
    </form>
  );
}
