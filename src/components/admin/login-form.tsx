"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { login } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
const fieldLabel = "block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600";
const fieldControl =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initialFormState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="space-y-2">
        <label htmlFor="identifier" className={fieldLabel}>
          Username or email
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          placeholder="owner or admin@hydraglobal.com"
          className={fieldControl}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className={fieldLabel}>
          Password
        </label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </div>

      <FormMessage status={state.status} message={state.message} />

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-blue-600 text-base text-white shadow-[0_10px_28px_-12px_rgba(37,99,235,0.7)] hover:bg-blue-500 hover:opacity-100"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link href="/admin/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
          Register with master key
        </Link>
      </p>
    </form>
  );
}
