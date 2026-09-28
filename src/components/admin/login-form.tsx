"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input } from "@/components/ui/form";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Sign in
      </Button>
    </form>
  );
}
