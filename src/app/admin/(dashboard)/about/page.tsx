import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { AboutSectionEditor } from "@/components/admin/section-editors";
import { requireAdmin } from "@/lib/auth/session";
import { normalizeAboutContent } from "@/lib/normalize-sections";
import { getSiteSectionRow } from "@/server/queries/content";

export const metadata = { title: "About page" };

export default async function AdminAboutPage() {
  await requireAdmin();
  const row = await getSiteSectionRow("about");

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Site"
        title="About page"
        description="The long paragraph is under “About page paragraph”. The rest of this page edits the hero, stats, mission, values and journey on /about."
        action={
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg"
          >
            <ExternalLink size={14} /> View About
          </Link>
        }
      />
      <div key={JSON.stringify(row?.data ?? null)}>
        <AboutSectionEditor content={normalizeAboutContent(row?.data)} />
      </div>
    </div>
  );
}
