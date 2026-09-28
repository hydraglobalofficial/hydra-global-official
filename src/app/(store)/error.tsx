"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-24 text-center">
      <div className="space-y-5">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-danger">Something went wrong</p>
        <h1 className="text-3xl font-semibold">We hit an unexpected error.</h1>
        <p className="mx-auto max-w-md text-muted">Please try again. If it keeps happening, contact support{error.digest ? ` and mention code ${error.digest}` : ""}.</p>
        <Button onClick={reset} variant="outline">
          <RotateCcw size={16} /> Try again
        </Button>
      </div>
    </div>
  );
}
