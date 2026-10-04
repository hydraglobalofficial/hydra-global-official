import Link from "next/link";
import { LayoutTemplate, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { SITE_SECTION_META } from "@/content/site-sections";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteAnnouncement, saveAnnouncement } from "@/server/actions/admin";

export const metadata = { title: "Content" };

export default async function AdminContentPage() {
  await requireAdmin();
  const [announcements, pages, sections] = await Promise.all([
    db.announcement.findMany({
      orderBy: { position: "asc" },
      select: { id: true, message: true, href: true, position: true, active: true },
    }),
    db.page.findMany({ orderBy: { slug: "asc" }, select: { slug: true, title: true, updatedAt: true } }),
    db.siteSection.findMany({ select: { key: true, updatedAt: true } }),
  ]);

  const sectionUpdated = new Map(sections.map((s) => [s.key, s.updatedAt]));
  const liveCount = announcements.filter((a) => a.active).length;

  return (
    <>
      <AdminHeader
        title="Content"
        description="Top headline marquee, editable site sections, and policy pages."
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-medium">
              <Megaphone size={16} className="text-accent" /> Headline marquee
            </h2>
            <p className="mt-1 text-sm text-muted">
              These lines scroll across the top of every storefront page. {liveCount} live
              {announcements.length ? ` · ${announcements.length} total` : ""}.
            </p>
          </div>
        </div>

        <Card className="divide-y divide-line">
          {announcements.length === 0 && (
            <p className="p-4 text-sm text-muted">No headlines yet — add the first one below.</p>
          )}

          {announcements.map((a, index) => (
            <div key={a.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-start">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-[10px] text-subtle">
                {String(index + 1).padStart(2, "0")}
              </div>
              <form action={saveAnnouncement} className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_5rem_auto_auto] lg:items-end">
                <input type="hidden" name="id" value={a.id} />
                <label className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">Headline text</span>
                  <Input name="message" defaultValue={a.message} required maxLength={160} />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">Link (optional)</span>
                  <Input name="href" defaultValue={a.href ?? ""} placeholder="/shop" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">Order</span>
                  <Input name="position" type="number" defaultValue={a.position} min={0} />
                </label>
                <label className="flex h-12 items-center gap-2 text-sm text-muted">
                  <input type="checkbox" name="active" defaultChecked={a.active} className="accent-[var(--color-accent)]" />
                  Live
                </label>
                <Button type="submit" size="sm" variant="secondary">
                  Save
                </Button>
              </form>
              <form action={deleteAnnouncement} className="lg:pt-6">
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded-full p-2 text-muted hover:text-danger" aria-label="Delete headline">
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
          ))}

          <form action={saveAnnouncement} className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_5rem_auto_auto] lg:items-end">
            <label className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">New headline</span>
              <Input name="message" placeholder="Free worldwide shipping on orders over $80" required maxLength={160} />
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">Link (optional)</span>
              <Input name="href" placeholder="/shop" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">Order</span>
              <Input name="position" type="number" defaultValue={announcements.length} min={0} />
            </label>
            <label className="flex h-12 items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="active" defaultChecked className="accent-[var(--color-accent)]" />
              Live
            </label>
            <Button type="submit" size="sm">
              <Plus size={14} /> Add
            </Button>
          </form>
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <div>
          <h2 className="flex items-center gap-2 font-medium">
            <LayoutTemplate size={16} className="text-accent" /> Homepage hero
          </h2>
          <p className="mt-1 text-sm text-muted">
            Slides, stage visuals/images, left-side copy, CTAs, quick links and stats — managed separately from other blocks.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "home.hero").map((s) => (
          <Link
            key={s.key}
            href={`/admin/content/sections/${encodeURIComponent(s.key)}`}
            className="block rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/15 via-white/[0.03] to-transparent p-5 transition-colors hover:border-accent/45"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">Featured · Home</p>
                <p className="mt-1 text-base font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-2 text-xs text-subtle">
                  {sectionUpdated.has(s.key)
                    ? `Updated ${formatDate(sectionUpdated.get(s.key)!)}`
                    : "Using defaults until you publish"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted">
                <Pencil size={12} /> Edit
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 space-y-4">
        <div>
          <h2 className="flex items-center gap-2 font-medium">
            <LayoutTemplate size={16} className="text-accent" /> About page
          </h2>
          <p className="mt-1 text-sm text-muted">
            Edit every About block — including company overview show/hide and public facts. Keep licence / TIN / BIN off the public page.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "about").map((s) => (
          <Link
            key={s.key}
            href={`/admin/content/sections/${encodeURIComponent(s.key)}`}
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 transition-colors hover:border-accent/35"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">Featured · About</p>
                <p className="mt-1 text-base font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-2 text-xs text-subtle">
                  {sectionUpdated.has(s.key)
                    ? `Updated ${formatDate(sectionUpdated.get(s.key)!)}`
                    : "Using defaults until you publish"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted">
                <Pencil size={12} /> Edit
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="flex items-center gap-2 font-medium">
          <LayoutTemplate size={16} className="text-accent" /> Other site sections
        </h2>
        <Card className="divide-y divide-line">
          {SITE_SECTION_META.filter((s) => s.key !== "home.hero" && s.key !== "about").map((s) => (
            <Link
              key={s.key}
              href={`/admin/content/sections/${encodeURIComponent(s.key)}`}
              className="flex items-center justify-between gap-3 p-4 text-sm hover:bg-white/[0.02]"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-xs text-subtle">
                  {s.description}
                  {sectionUpdated.has(s.key)
                    ? ` · updated ${formatDate(sectionUpdated.get(s.key)!)}`
                    : " · using defaults until saved"}
                </p>
              </div>
              <Pencil size={14} className="shrink-0 text-muted" />
            </Link>
          ))}
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-medium">Policy pages</h2>
        <Card className="divide-y divide-line">
          {pages.map((p) => (
            <Link key={p.slug} href={`/admin/content/${p.slug}`} className="flex items-center justify-between p-4 text-sm hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-subtle">
                  /{p.slug} · updated {formatDate(p.updatedAt)}
                </p>
              </div>
              <Pencil size={14} className="text-muted" />
            </Link>
          ))}
        </Card>
      </section>
    </>
  );
}
