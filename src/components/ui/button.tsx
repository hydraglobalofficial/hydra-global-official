import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:opacity-90 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_30px_-8px_rgba(0,0,0,0.55)] light:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_24px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-6px_rgba(0,0,0,0.65)]",
  secondary: "bg-surface-3 text-fg hover:brightness-95 border border-line",
  ghost: "text-muted hover:text-fg hover:bg-white/5 light:hover:bg-black/5",
  outline: "border border-line-strong text-fg hover:border-accent/60 hover:bg-accent/5",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
  icon: "size-10",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
