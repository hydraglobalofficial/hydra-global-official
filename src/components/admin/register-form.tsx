"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { register } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { cn } from "@/lib/utils";

const fieldLabel = "block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600";
const fieldHint = "text-xs text-slate-500";
const fieldError = "text-xs text-red-600";
const fieldControl =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15";

function AuthField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className={fieldLabel}>
        {label}
      </label>
      {children}
      {error?.length ? (
        <p className={fieldError} role="alert">
          {error[0]}
        </p>
      ) : hint ? (
        <p className={fieldHint}>{hint}</p>
      ) : null}
    </div>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialFormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <AuthField label="Full name" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" required className={fieldControl} />
      </AuthField>
      <AuthField label="Username" htmlFor="username" error={errors.username} hint="Letters, numbers, dots, _ or -">
        <input id="username" name="username" type="text" autoComplete="username" required className={fieldControl} />
      </AuthField>
      <AuthField label="Email" htmlFor="email" error={errors.email} hint="Also works as a login identifier">
        <input id="email" name="email" type="email" autoComplete="email" required className={fieldControl} />
      </AuthField>
      <AuthField label="Password" htmlFor="password" error={errors.password} hint="12+ chars · upper · lower · number · symbol">
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
      </AuthField>
      <AuthField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
      </AuthField>
      <AuthField label="Master key" htmlFor="masterKey" error={errors.masterKey} hint="Required to create admin accounts">
        <PasswordInput id="masterKey" name="masterKey" autoComplete="off" required />
      </AuthField>

      <FormMessage status={state.status} message={state.message} />

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className={cn(
          "h-12 w-full rounded-xl bg-blue-600 text-base text-white shadow-[0_10px_28px_-12px_rgba(37,99,235,0.7)] hover:bg-blue-500 hover:opacity-100",
        )}
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        Create admin account
      </Button>
    </form>
  );
}
