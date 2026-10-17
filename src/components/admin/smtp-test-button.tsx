"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { testSmtpConnection } from "@/server/actions/admin";
import { initialFormState } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { alertError, alertSuccess } from "@/lib/swal";

export function SmtpTestButton() {
  const [state, action, pending] = useActionState(testSmtpConnection, initialFormState);
  const last = useRef("");

  useEffect(() => {
    if (state.status === "idle" || !state.message) return;
    const key = `${state.status}:${state.message}`;
    if (last.current === key) return;
    last.current = key;

    if (state.status === "success") void alertSuccess("Invoice email ready", state.message);
    else void alertError("SMTP login failed", state.message);
  }, [state]);

  return (
    <form action={action}>
      <Button type="submit" variant="outline" size="sm" disabled={pending} className="min-h-9">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <MailCheck size={14} />}
        Test SMTP login
      </Button>
    </form>
  );
}
