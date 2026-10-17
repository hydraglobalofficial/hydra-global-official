"use client";

import { useActionState, useTransition } from "react";
import { Loader2, RefreshCw, Truck, XCircle } from "lucide-react";
import {
  bookCourierForOrder,
  cancelCourierForOrder,
  refreshCourierStatus,
} from "@/server/actions/courier";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

export function RefreshCourierButton({ orderId }: { orderId: string }) {
  const [pending, start] = useTransition();
  return (
    <form
      action={(fd) => {
        start(async () => {
          await refreshCourierStatus(fd);
        });
      }}
    >
      <input type="hidden" name="id" value={orderId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-fg disabled:opacity-60"
      >
        {pending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
        Refresh
      </button>
    </form>
  );
}

export function BookCourierButton({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(bookCourierForOrder, initialFormState);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={orderId} />
      <Button type="submit" size="sm" disabled={pending} className="min-h-9 rounded-full">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
        Book Pathao
      </Button>
      <FormMessage status={state.status} message={state.message} toast />
    </form>
  );
}

export function CancelCourierButton({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(cancelCourierForOrder, initialFormState);
  return (
    <form
      action={action}
      className="space-y-2"
      onSubmit={(e) => {
        if (!window.confirm("Cancel this Pathao shipment? This cannot be undone on Pathao.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={orderId} />
      <Button type="submit" size="sm" variant="danger" disabled={pending} className="min-h-9 rounded-full">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
        Cancel courier
      </Button>
      <FormMessage status={state.status} message={state.message} toast />
    </form>
  );
}
