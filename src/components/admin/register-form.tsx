"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { register } from "@/server/actions/auth";
import { initialFormState } from "@/lib/validations";
import { FormMessage } from "@/components/ui/form-message";

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
    <div className="admin-auth-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error?.length ? (
        <p className="text-[11px] text-danger" role="alert">
          {error[0]}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialFormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="admin-auth-form">
      <AuthField label="Full name" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" required className="auth-field" />
      </AuthField>
      <AuthField label="Username" htmlFor="username" error={errors.username} hint="Letters, numbers, dots, _ or -">
        <input id="username" name="username" type="text" autoComplete="username" required className="auth-field" />
      </AuthField>
      <AuthField label="Email" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required className="auth-field" />
      </AuthField>
      <AuthField label="Password" htmlFor="password" error={errors.password} hint="12+ chars · upper · lower · number · symbol">
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
      </AuthField>
      <AuthField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
      </AuthField>
      <AuthField label="Master key" htmlFor="masterKey" error={errors.masterKey}>
        <PasswordInput id="masterKey" name="masterKey" autoComplete="off" required />
      </AuthField>

      <FormMessage status={state.status} message={state.message} />

      <button type="submit" disabled={pending} className="admin-auth-submit">
        {pending ? <Loader2 size={16} className="animate-spin" /> : null}
        Create admin
      </button>
    </form>
  );
}
