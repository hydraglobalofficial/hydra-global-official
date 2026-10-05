import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { CollectionsSectionEditor } from "@/components/admin/section-editors";
import { requireAdmin } from "@/lib/auth/session";
import { normalizeCollectionsContent } from "@/lib/normalize-sections";
import { getSiteSectionRow } from "@/server/queries/content";

export const metadata = { title: "Home · Collections" };

export default async function AdminCollectionsPage() {
  await requireAdmin();
  const row = await getSiteSectionRow("home.collections");

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Site"
        title="Shop by collection"
        description="Edit the homepage bento — heading, “All products” link, and five category cards (first card is the large featured tile). Images upload to Cloudflare R2."
        action={
          <Link
            href="/#explore"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg"
          >
            <ExternalLink size={14} /> View homepage
          </Link>
        }
      />
      <CollectionsSectionEditor content={normalizeCollectionsContent(row?.data)} />
    </div>
  );
}
