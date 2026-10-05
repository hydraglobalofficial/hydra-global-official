import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export { FormMessage } from "@/components/ui/form-message";

const control =
  "w-full rounded-xl border border-line bg-surface-2 px-4 text-sm text-fg placeholder:text-subtle transition-colors focus:border-accent/60 focus:bg-surface-3 focus:outline-none aria-[invalid=true]:border-danger/60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-32 py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "h-12 appearance-none bg-no-repeat pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">
        <span>{label}</span>
        {required ? <span className="text-accent" aria-hidden>*</span> : null}
      </label>
      {children}
      {error?.length ? (
        <p className="text-xs text-danger" role="alert">
          {error[0]}
        </p>
      ) : hint ? (
        <p className="text-xs text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
