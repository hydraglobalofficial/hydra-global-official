import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { PageEditor } from "@/components/admin/page-editor";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "Edit page" };

export default async function EditContentPage({ params }: PageProps<"/admin/content/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const page = await db.page.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft size={14} /> Content</Link>
      <AdminHeader title={page.title} description={`/${slug}`} />
      <PageEditor page={page} />
    </>
  );
}
