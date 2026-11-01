import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { TrackingSectionEditor } from "@/components/admin/section-editors";
import { requireAdmin } from "@/lib/auth/session";
import { normalizeTrackingContent } from "@/lib/normalize-sections";
import { getSiteSectionRow } from "@/server/queries/content";

export const metadata = { title: "GTM & Pixel" };

export default async function AdminSeoPage() {
  await requireAdmin();
  const row = await getSiteSectionRow("site.tracking");

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Site"
        title="GTM & Pixel"
        description="Paste Google Tag Manager, Google Analytics, or Meta Pixel here. After publish they load on the live store."
        action={
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg"
          >
            <ExternalLink size={14} /> Open sitemap
          </Link>
        }
      />
      <div key={JSON.stringify(row?.data ?? null)}>
        <TrackingSectionEditor content={normalizeTrackingContent(row?.data)} />
      </div>
    </div>
  );
}
