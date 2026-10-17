"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Mail } from "lucide-react";
import { resendOrderInvoice, updateOrder } from "@/server/actions/admin";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/form";
import { alertError, alertOrderApproved, alertSuccess, alertToast } from "@/lib/swal";

type Props = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentNote: string | null;
};

function parseApprovedMessage(message: string) {
  // ORDER_APPROVED|HYD-…|mail:ok|mailDetail|courierDetail
  const parts = message.split("|");
  if (parts[0] !== "ORDER_APPROVED" || parts.length < 4) return null;
  return {
    orderNumber: parts[1]!,
    mail: parts[2] as "mail:ok" | "mail:skip" | "mail:fail",
    mailDetail: parts[3] ?? "",
    courierDetail: parts[4] ?? "",
  };
}

export function OrderUpdateForm({ id, orderNumber, status, paymentStatus, fulfillmentNote }: Props) {
  const [state, action, pending] = useActionState(updateOrder, initialFormState);
  const [mailState, mailAction, mailPending] = useActionState(resendOrderInvoice, initialFormState);
  const last = useRef("");

  useEffect(() => {
    if (state.status === "idle" || !state.message) return;
    const key = `${state.status}:${state.message}`;
    if (last.current === key) return;
    last.current = key;

    const approved = parseApprovedMessage(state.message);
    if (approved) {
      void alertOrderApproved({
        orderNumber: approved.orderNumber,
        mailOk: approved.mail === "mail:ok",
        mailDetail: approved.mailDetail,
        courierDetail: approved.courierDetail,
      });
      return;
    }

    if (state.status === "success") void alertToast(state.message, "success");
    else void alertError("Update failed", state.message);
  }, [state]);

  useEffect(() => {
    if (mailState.status === "idle" || !mailState.message) return;
    if (mailState.status === "success") void alertSuccess("Invoice sent", mailState.message);
    else void alertError("Email failed", mailState.message);
  }, [mailState]);

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-5">
        <input type="hidden" name="id" value={id} />
        <Field label="Order status" htmlFor="status">
          <Select id="status" name="status" defaultValue={status}>
            {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((s) => (
              <option key={s} value={s}>
                {s.toLowerCase()}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Payment status" htmlFor="paymentStatus">
          <Select id="paymentStatus" name="paymentStatus" defaultValue={paymentStatus}>
            {["UNPAID", "PAID", "REFUNDED", "FAILED"].map((s) => (
              <option key={s} value={s}>
                {s.toLowerCase()}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fulfilment note" htmlFor="fulfillmentNote" hint="Courier, tracking number, internal notes.">
          <Textarea
            id="fulfillmentNote"
            name="fulfillmentNote"
            defaultValue={fulfillmentNote ?? ""}
            className="min-h-24"
          />
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 size={16} className="animate-spin" />} Update order
        </Button>
        <p className="text-xs text-subtle">
          Set status to <strong>confirmed</strong> to email the invoice and book Pathao. Cancelled / returned restocks
          automatically.
        </p>
      </form>

      <form action={mailAction} className="border-t border-line pt-4">
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="outline" className="w-full" disabled={mailPending}>
          {mailPending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          Resend invoice email
        </Button>
        <p className="mt-2 text-xs text-subtle">Uses order {orderNumber} · customer inbox</p>
      </form>
    </div>
  );
}
