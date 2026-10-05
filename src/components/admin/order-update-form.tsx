"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateOrder } from "@/server/actions/admin";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Select, Textarea } from "@/components/ui/form";

type Props = { id: string; status: string; paymentStatus: string; fulfillmentNote: string | null };

export function OrderUpdateForm({ id, status, paymentStatus, fulfillmentNote }: Props) {
  const [state, action, pending] = useActionState(updateOrder, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <Field label="Order status" htmlFor="status">
        <Select id="status" name="status" defaultValue={status}>
          {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((s) => (
            <option key={s} value={s}>{s.toLowerCase()}</option>
          ))}
        </Select>
      </Field>
      <Field label="Payment status" htmlFor="paymentStatus">
        <Select id="paymentStatus" name="paymentStatus" defaultValue={paymentStatus}>
          {["UNPAID", "PAID", "REFUNDED", "FAILED"].map((s) => (
            <option key={s} value={s}>{s.toLowerCase()}</option>
          ))}
        </Select>
      </Field>
      <Field label="Fulfilment note" htmlFor="fulfillmentNote" hint="Courier, tracking number, internal notes.">
        <Textarea id="fulfillmentNote" name="fulfillmentNote" defaultValue={fulfillmentNote ?? ""} className="min-h-24" />
      </Field>
      <FormMessage status={state.status} message={state.message} toast />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Update order
      </Button>
      <p className="text-xs text-subtle">Setting an order to cancelled or returned restocks its items automatically.</p>
    </form>
  );
}
