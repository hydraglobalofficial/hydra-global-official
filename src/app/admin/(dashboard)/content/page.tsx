import Link from "next/link";
import { LayoutTemplate, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { SITE_SECTION_META } from "@/content/site-sections";
import { requireAdmin } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { deleteAnnouncement, saveAnnouncement } from "@/server/actions/admin";
import { getAdminContentIndex } from "@/server/queries/admin";

export const metadata = { title: "Content" };

export default async function AdminContentPage() {
  await requireAdmin();
  const { announcements, pages, sections } = await getAdminContentIndex();

  const sectionUpdated = new Map(sections.map((s) => [s.key, s.updatedAt]));
  const liveCount = announcements.filter((a) => a.active).length;

  return (
    <>
      <AdminHeader
        title="Content"
        description="Each card below is named after the block you see on the website. Open the one that matches the page."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {[
          {
            href: "#headlines",
            title: "Top running lines",
            detail: "The scrolling bar above the menu. Edit it on this page.",
          },
          {
            href: "/admin/content/sections/home.showcase",
            title: "Homepage video cards",
            detail: "Poster image and YouTube link for each card.",
          },
          {
            href: "/admin/content/sections/home.clarity",
            title: "Clarity you can feel",
            detail: "The two photos in the homepage compare slider.",
          },
          {
            href: "/admin/content/sections/home.impact",
            title: "20,000+ photos",
            detail: "The pictures around the big 20,000+ number.",
          },
          {
            href: "/admin/content/sections/home.impactLab",
            title: "Impact lab cards",
            detail: "The four blocks under the dropping phone. Two by two on a phone.",
          },
          {
            href: "/admin/about",
            title: "About page text",
            detail: "The long paragraph, plus the rest of the About page.",
          },
          {
            href: "/admin/orders",
            title: "Orders",
            detail: "Tap an order block to open it.",
          },
          {
            href: "/admin/content/sections/home.hero",
            title: "Homepage hero",
            detail: "The big slider at the top of the homepage.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-line bg-surface-2/40 p-4 transition-colors hover:border-accent/40"
          >
            <p className="text-sm font-medium text-fg">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.detail}</p>
          </Link>
        ))}
      </section>

      <section id="headlines" className="mt-10 scroll-mt-24 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-medium">
              <Megaphone size={16} className="text-accent" /> Top running lines
            </h2>
            <p className="mt-1 text-sm text-muted">
              These are the lines that scroll across the top of every page. {liveCount} live
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
              <ConfirmDeleteForm
                action={deleteAnnouncement}
                title="Delete this headline?"
                text={a.message}
                className="lg:pt-6"
              >
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded-full p-2 text-muted hover:text-danger" aria-label="Delete headline">
                  <Trash2 size={14} />
                </button>
              </ConfirmDeleteForm>
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
            <LayoutTemplate size={16} className="text-accent" /> Shop by collection
          </h2>
          <p className="mt-1 text-sm text-muted">
            Homepage bento — five category cards, featured tile, heading and “All products” link.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "home.collections").map((s) => (
          <Link
            key={s.key}
            href="/admin/collections"
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 transition-colors hover:border-accent/35"
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
            href="/admin/about"
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
        <div>
          <h2 className="flex items-center gap-2 font-medium">
            <LayoutTemplate size={16} className="text-accent" /> Installation guide
          </h2>
          <p className="mt-1 text-sm text-muted">
            One shared Apple + Samsung flow — video, kit, animated steps with images, troubleshooting.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "installation").map((s) => (
          <Link
            key={s.key}
            href="/admin/installation"
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 transition-colors hover:border-accent/35"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">Featured · Install</p>
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
            <LayoutTemplate size={16} className="text-accent" /> WhatsApp float
          </h2>
          <p className="mt-1 text-sm text-muted">
            Right-side chat button with rotating staff photos — tap opens WhatsApp.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "site.whatsapp").map((s) => (
          <Link
            key={s.key}
            href={`/admin/content/sections/${encodeURIComponent(s.key)}`}
            className="block rounded-2xl border border-[#25D366]/25 bg-gradient-to-br from-[#25D366]/12 via-white/[0.03] to-transparent p-5 transition-colors hover:border-[#25D366]/45"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#25D366]">Global · Chat</p>
                <p className="mt-1 text-base font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-2 text-xs text-subtle">
                  {sectionUpdated.has(s.key)
                    ? `Updated ${formatDate(sectionUpdated.get(s.key)!)}`
                    : "Add staff photos to show the button"}
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
            <LayoutTemplate size={16} className="text-accent" /> Homepage video cards
          </h2>
          <p className="mt-1 text-sm text-muted">
            The video cards on the homepage. Upload a poster image and paste a YouTube link for each card.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "home.showcase").map((s) => (
          <Link
            key={s.key}
            href={`/admin/content/sections/${encodeURIComponent(s.key)}`}
            className="block rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/15 via-white/[0.03] to-transparent p-5 transition-colors hover:border-accent/45"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">Homepage · poster + YouTube</p>
                <p className="mt-1 text-base font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-2 text-xs text-subtle">
                  {sectionUpdated.has(s.key)
                    ? `Updated ${formatDate(sectionUpdated.get(s.key)!)}`
                    : "Add a poster and a YouTube link, then publish"}
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
            <LayoutTemplate size={16} className="text-accent" /> Clarity you can feel
          </h2>
          <p className="mt-1 text-sm text-muted">
            Homepage compare slider. Upload the left image and the right image here — both show on the live page.
          </p>
        </div>
        {SITE_SECTION_META.filter((s) => s.key === "home.clarity").map((s) => (
          <Link
            key={s.key}
            href={`/admin/content/sections/${encodeURIComponent(s.key)}`}
            className="block rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/15 via-white/[0.03] to-transparent p-5 transition-colors hover:border-accent/45"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent">Featured · Home · 2 images</p>
                <p className="mt-1 text-base font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-2 text-xs text-subtle">
                  {sectionUpdated.has(s.key)
                    ? `Updated ${formatDate(sectionUpdated.get(s.key)!)}`
                    : "Upload both images, then publish"}
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
          {SITE_SECTION_META.filter(
            (s) =>
              s.key !== "home.hero" &&
              s.key !== "home.collections" &&
              s.key !== "about" &&
              s.key !== "installation" &&
              s.key !== "site.whatsapp" &&
              s.key !== "home.clarity" &&
              s.key !== "home.impact" &&
              s.key !== "home.impactLab" &&
              s.key !== "home.showcase",
          ).map((s) => (
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
