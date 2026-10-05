import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { AboutSectionEditor } from "@/components/admin/section-editors";
import { requireAdmin } from "@/lib/auth/session";
import { normalizeAboutContent } from "@/lib/normalize-sections";
import { db } from "@/lib/db";

export const metadata = { title: "About page" };

export default async function AdminAboutPage() {
  await requireAdmin();
  const row = await db.siteSection.findUnique({ where: { key: "about" } });

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Site"
        title="About page"
        description="Edit the full About experience — hero, company overview, mission, values, journey and CTAs. Publish updates the live /about page."
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
      <AboutSectionEditor content={normalizeAboutContent(row?.data)} />
    </div>
  );
}
