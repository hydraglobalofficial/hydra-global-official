"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveProduct } from "@/server/actions/admin";
import { initialFormState } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";

type Option = { id: string; name: string };
type DeviceOpt = { id: string; model: string; brand: string };

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
};

export function ProductForm({ initial, categories, devices }: { initial: ProductFormValues; categories: Option[]; devices: DeviceOpt[] }) {
  const [state, action, pending] = useActionState(saveProduct.bind(null, initial.id ?? null), initialFormState);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-8 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-6 rounded-2xl border border-line bg-surface p-6">
        <div className="grid gap-5 md:grid-cols-2">
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
        <Field label="Image URLs" htmlFor="imageUrls" hint="One per line, in display order. Upload to your R2/S3 bucket and paste the public URL.">
          <Textarea id="imageUrls" name="imageUrls" defaultValue={initial.imageUrls} className="min-h-24 font-mono text-xs" />
        </Field>
        <fieldset>
          <legend className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">Compatible devices</legend>
          <div className="grid max-h-72 gap-2 overflow-y-auto rounded-xl border border-line p-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((d) => (
              <label key={d.id} className="flex items-center gap-2 text-sm text-muted has-[:checked]:text-fg">
                <input type="checkbox" name="deviceIds" value={d.id} defaultChecked={initial.deviceIds.includes(d.id)} className="accent-[var(--color-accent)]" />
                {d.model}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
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
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="featured" defaultChecked={initial.featured} className="accent-[var(--color-accent)]" /> Featured on homepage
          </label>
        </div>
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <Field label="SKU" htmlFor="sku" error={e.sku}>
            <Input id="sku" name="sku" defaultValue={initial.sku} required className="font-mono uppercase" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (৳)" htmlFor="price" error={e.price}>
              <Input id="price" name="price" type="number" min={0} defaultValue={initial.price} required />
            </Field>
            <Field label="Compare at (৳)" htmlFor="compareAtPrice" error={e.compareAtPrice}>
              <Input id="compareAtPrice" name="compareAtPrice" type="number" min={0} defaultValue={initial.compareAtPrice} />
            </Field>
          </div>
          <Field label="Stock" htmlFor="stock" error={e.stock}>
            <Input id="stock" name="stock" type="number" min={0} defaultValue={initial.stock} required />
          </Field>
        </div>
        <FormMessage status={state.status} message={state.message} />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save product
        </Button>
      </div>
    </form>
  );
}
