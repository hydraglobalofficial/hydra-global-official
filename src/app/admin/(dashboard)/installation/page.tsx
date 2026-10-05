import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { InstallationSectionEditor } from "@/components/admin/section-editors";
import { requireAdmin } from "@/lib/auth/session";
import { normalizeInstallationContent } from "@/lib/normalize-sections";
import { db } from "@/lib/db";

export const metadata = { title: "Installation guide" };

export default async function AdminInstallationPage() {
  await requireAdmin();
  const row = await db.siteSection.findUnique({ where: { key: "installation" } });

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Site"
        title="Installation guide"
        description="One shared Apple + Samsung flow. Edit hero copy, kit list, steps (image + YouTube video per step), and troubleshooting — then publish to /installation."
        action={
          <Link
            href="/installation"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg"
          >
            <ExternalLink size={14} /> View guide
          </Link>
        }
      />
      <InstallationSectionEditor content={normalizeInstallationContent(row?.data)} />
    </div>
  );
}
