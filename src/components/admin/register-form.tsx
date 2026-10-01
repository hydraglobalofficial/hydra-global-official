"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { register } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input } from "@/components/ui/form";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialFormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <Field label="Full name" htmlFor="name" error={errors.name}>
        <Input id="name" name="name" type="text" autoComplete="name" required />
      </Field>
      <Field label="Username" htmlFor="username" error={errors.username} hint="Letters, numbers, dots, _ or -">
        <Input id="username" name="username" type="text" autoComplete="username" required />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email} hint="Also works as a login identifier">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password} hint="12+ chars · upper · lower · number · symbol">
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
      </Field>
      <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
      </Field>
      <Field label="Master key" htmlFor="masterKey" error={errors.masterKey} hint="Required to create admin accounts">
        <PasswordInput id="masterKey" name="masterKey" autoComplete="off" required />
      </Field>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Create admin account
      </Button>
      <p className="text-center text-sm text-muted">
        Already registered?{" "}
        <Link href="/admin/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
