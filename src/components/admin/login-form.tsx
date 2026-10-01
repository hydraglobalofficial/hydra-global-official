"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { login } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input } from "@/components/ui/form";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Username or email" htmlFor="identifier">
        <Input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          placeholder="owner or admin@hydra.com.bd"
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </Field>
      <FormMessage status={state.status} message={state.message} />
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />} Sign in
      </Button>
      <p className="text-center text-sm text-muted">
        Need an account?{" "}
        <Link href="/admin/register" className="text-accent hover:underline">
          Register with master key
        </Link>
      </p>
    </form>
  );
}
