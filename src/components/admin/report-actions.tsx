import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportActions({
  htmlHref,
  csvHref,
  className,
  label = "Statement",
}: {
  htmlHref: string;
  csvHref?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <a
        href={htmlHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-3.5 py-2 text-sm text-accent transition-colors hover:border-accent/55 hover:bg-accent/15"
      >
        <FileText size={14} />
        {label}
        <Download size={13} className="opacity-70" />
      </a>
      {csvHref ? (
        <a
          href={csvHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-fg"
        >
          <FileSpreadsheet size={14} />
          CSV
        </a>
      ) : null}
    </div>
  );
}
