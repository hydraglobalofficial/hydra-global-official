"use client";

import type { ReactNode } from "react";
import { confirmDelete } from "@/lib/swal";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
  text?: string;
  confirmText?: string;
  className?: string;
  children: ReactNode;
};

/** Server-action form that asks for a SweetAlert confirm before running. */
export function ConfirmDeleteForm({
  action,
  title,
  text,
  confirmText = "Yes, delete",
  className,
  children,
}: Props) {
  return (
    <form
      className={className}
      action={async (formData) => {
        const result = await confirmDelete({ title, text, confirmText });
        if (!result.isConfirmed) return;
        await action(formData);
      }}
    >
      {children}
    </form>
  );
}
