"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form-message";
import { initialFormState } from "@/lib/validations";
import { changeOwnPassword } from "@/server/actions/auth";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changeOwnPassword, initialFormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-3">
      <Field label="Current password" htmlFor="currentPassword" error={errors.currentPassword}>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="New password" htmlFor="password" error={errors.password} hint="12+ chars, upper, lower, number, symbol">
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>
      <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Update password"}
        </Button>
        <FormMessage status={state.status} message={state.message} toast />
      </div>
    </form>
  );
}
