import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteAnnouncement, saveAnnouncement } from "@/server/actions/admin";

export const metadata = { title: "Content" };

export default async function AdminContentPage() {
  await requireAdmin();
  const [announcements, pages] = await Promise.all([
    db.announcement.findMany({ orderBy: { position: "asc" } }),
    db.page.findMany({ orderBy: { slug: "asc" }, select: { slug: true, title: true, updatedAt: true } }),
  ]);

  return (
    <>
      <AdminHeader title="Content" description="Announcement bar messages and editable policy pages." />

      <section className="space-y-4">
        <h2 className="font-medium">Announcement bar</h2>
        <Card className="divide-y divide-line">
          {announcements.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
              <form action={saveAnnouncement} className="grid flex-1 gap-3 md:grid-cols-[1fr_12rem_5rem_auto_auto] md:items-center">
                <input type="hidden" name="id" value={a.id} />
                <Input name="message" defaultValue={a.message} required />
                <Input name="href" defaultValue={a.href ?? ""} placeholder="/shop (optional)" />
                <Input name="position" type="number" defaultValue={a.position} min={0} aria-label="Position" />
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" name="active" defaultChecked={a.active} className="accent-[var(--color-accent)]" /> Live
                </label>
                <Button type="submit" size="sm" variant="secondary">Save</Button>
              </form>
              <form action={deleteAnnouncement}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded-full p-2 text-muted hover:text-danger" aria-label="Delete announcement"><Trash2 size={14} /></button>
              </form>
            </div>
          ))}
          <form action={saveAnnouncement} className="grid gap-3 p-4 md:grid-cols-[1fr_12rem_5rem_auto_auto] md:items-center">
            <Input name="message" placeholder="New announcement…" required />
            <Input name="href" placeholder="/shop (optional)" />
            <Input name="position" type="number" defaultValue={announcements.length} min={0} aria-label="Position" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="active" defaultChecked className="accent-[var(--color-accent)]" /> Live
            </label>
            <Button type="submit" size="sm"><Plus size={14} /> Add</Button>
          </form>
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-medium">Pages</h2>
        <Card className="divide-y divide-line">
          {pages.map((p) => (
            <Link key={p.slug} href={`/admin/content/${p.slug}`} className="flex items-center justify-between p-4 text-sm hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-subtle">/{p.slug} · updated {formatDate(p.updatedAt)}</p>
              </div>
              <Pencil size={14} className="text-muted" />
            </Link>
          ))}
        </Card>
      </section>
    </>
  );
}
