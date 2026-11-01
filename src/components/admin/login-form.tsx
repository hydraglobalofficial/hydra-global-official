"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { login } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { FormMessage } from "@/components/ui/form-message";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initialFormState);
  return (
    <form action={action} className="admin-auth-form">
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="admin-auth-field">
        <label htmlFor="identifier">Username or email</label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          placeholder="owner or admin@hydraglobal.com"
          className="auth-field"
        />
      </div>

      <div className="admin-auth-field">
        <label htmlFor="password">Password</label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </div>

      <FormMessage status={state.status} message={state.message} />

      <button type="submit" disabled={pending} className="admin-auth-submit">
        {pending ? <Loader2 size={16} className="animate-spin" /> : null}
        Sign in
      </button>

      <p className="admin-auth-alt">
        Need an account? <Link href="/admin/register">Register with master key</Link>
      </p>
    </form>
  );
}
