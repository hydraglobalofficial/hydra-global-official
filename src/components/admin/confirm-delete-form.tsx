"use client";

import { Children, cloneElement, isValidElement, useRef, type MouseEvent, type ReactNode } from "react";
import { confirmDelete } from "@/lib/swal";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
  text?: string;
  confirmText?: string;
  className?: string;
  children: ReactNode;
};

function confirmChildren(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;
    const props = child.props as { type?: string };
    if (child.type === "button" || props.type === "submit") {
      return cloneElement(child, { type: "button" } as { type: "button" });
    }
    return child;
  });
}

/**
 * Confirms, then runs the server action with only the hidden inputs inside this control.
 * A div, not a form, so it can sit inside an edit form without submitting that form or
 * sending every other field along with the delete.
 */
export function ConfirmDeleteForm({
  action,
  title,
  text,
  confirmText = "Yes, delete",
  className,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  async function onClick(event: MouseEvent<HTMLDivElement>) {
    const button = (event.target as HTMLElement | null)?.closest("button");
    if (!button || !ref.current?.contains(button)) return;
    event.preventDefault();
    event.stopPropagation();
    const result = await confirmDelete({ title, text, confirmText });
    if (!result.isConfirmed) return;
    const data = new FormData();
    ref.current.querySelectorAll<HTMLInputElement>("input[name]").forEach((input) => {
      data.append(input.name, input.value);
    });
    await action(data);
  }

  return (
    <div ref={ref} className={className} onClick={onClick}>
      {confirmChildren(children)}
    </div>
  );
}
