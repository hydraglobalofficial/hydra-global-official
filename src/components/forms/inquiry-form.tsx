"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitInquiry } from "@/server/actions/engagement";
import { TrackEvent } from "@/components/analytics/track-event";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";

type InquiryType = "CONTACT" | "SUPPORT" | "WARRANTY" | "RETURN";

export function InquiryForm({
  defaultType = "CONTACT",
  showType = false,
  defaultMessage,
}: {
  defaultType?: InquiryType;
  showType?: boolean;
  defaultMessage?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initialFormState);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-3xl p-10 text-center animate-fade-up">
        <TrackEvent event="generate_lead" payload={{ label: defaultType }} />
        <CheckCircle2 size={40} className="text-success" />
        <h3 className="text-xl font-semibold">Message sent</h3>
        <p className="max-w-sm text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="glass space-y-5 rounded-3xl p-6 md:p-8" noValidate>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {!showType && <input type="hidden" name="type" value={defaultType} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input id="name" name="name" required autoComplete="name" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" name="email" type="email" required autoComplete="email" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />
        </Field>
        {showType ? (
          <Field label="Topic" htmlFor="type">
            <Select id="type" name="type" defaultValue={defaultType}>
              <option value="SUPPORT">General support</option>
              <option value="WARRANTY">Warranty claim</option>
              <option value="RETURN">Return / replacement</option>
              <option value="CONTACT">Other</option>
            </Select>
          </Field>
        ) : (
          <Field label="Subject (optional)" htmlFor="subject" error={errors.subject}>
            <Input id="subject" name="subject" />
          </Field>
        )}
      </div>
      {showType && (
        <Field label="Order number (optional)" htmlFor="orderNumber" hint="Found in your confirmation email, e.g. HYD-260928-A1B2C3">
          <Input id="orderNumber" name="orderNumber" className="font-mono uppercase" />
        </Field>
      )}
      <Field label="Message" htmlFor="message" error={errors.message}>
        <Textarea id="message" name="message" required defaultValue={defaultMessage} aria-invalid={!!errors.message} placeholder="How can we help?" />
      </Field>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send message
      </Button>
    </form>
  );
}
