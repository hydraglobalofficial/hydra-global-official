"use client";

import { useActionState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { generateCodes } from "@/server/actions/admin";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Select } from "@/components/ui/form";

export function GenerateCodesForm({ products }: { products: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(generateCodes, initialFormState);
  const e = state.fieldErrors ?? {};
  const defaultBatch = `B${new Date().toISOString().slice(2, 10).replace(/-/g, "")}`;

  return (
    <form action={action} className="grid gap-4 md:grid-cols-[1fr_10rem_8rem_auto] md:items-end">
      <Field label="Product" htmlFor="productId" error={e.productId}>
        <Select id="productId" name="productId" required defaultValue="">
          <option value="">Select product…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </Field>
      <Field label="Batch" htmlFor="batch" error={e.batch}>
        <Input id="batch" name="batch" defaultValue={defaultBatch} required className="font-mono" />
      </Field>
      <Field label="Quantity" htmlFor="quantity" error={e.quantity}>
        <Input id="quantity" name="quantity" type="number" min={1} max={5000} defaultValue={100} required />
      </Field>
      <Button type="submit" className="h-12" disabled={pending}>
        {pending ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />} Generate
      </Button>
      <div className="md:col-span-4">
        <FormMessage status={state.status} message={state.message} />
      </div>
    </form>
  );
}
