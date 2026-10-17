import Link from "next/link";
import { Mail, Phone, Trash2 } from "lucide-react";
import { AdminHeader, Card, StatusBadge } from "@/components/admin/admin-ui";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cn, formatDate } from "@/lib/utils";
import { deleteInquiry, setInquiryStatus } from "@/server/actions/admin";
import type { InquiryStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Inquiries" };

const filters: (InquiryStatus | "ALL")[] = ["NEW", "IN_PROGRESS", "RESOLVED", "ALL"];

export default async function AdminInquiriesPage({ searchParams }: PageProps<"/admin/inquiries">) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = filters.includes(status as InquiryStatus) ? (status as InquiryStatus | "ALL") : "NEW";
  const inquiries = await db.inquiry.findMany({
    where: active === "ALL" ? undefined : { status: active },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <AdminHeader title="Inquiries" description="Contact, support and return requests." />
      <div className="no-scrollbar mb-5 flex gap-1 overflow-x-auto pb-0.5 sm:mb-6">
        {filters.map((f) => (
          <Link
            key={f}
            href={`/admin/inquiries?status=${f}`}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs",
              f === active ? "bg-white/10 text-fg" : "text-muted hover:text-fg",
            )}
          >
            {f.replace("_", " ").toLowerCase()}
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {inquiries.map((i) => (
          <Card key={i.id} className="space-y-3.5 p-4 sm:space-y-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">{i.name}</p>
                <StatusBadge status={i.type} />
                <StatusBadge status={i.status} />
              </div>
              <span className="text-xs text-subtle">{formatDate(i.createdAt)}</span>
            </div>
            {i.subject && <p className="text-sm font-medium">{i.subject}</p>}
            <p className="whitespace-pre-line text-sm text-muted">{i.message}</p>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <a href={`mailto:${i.email}`} className="flex items-center gap-1 hover:text-fg"><Mail size={12} /> {i.email}</a>
                {i.phone && <a href={`tel:${i.phone}`} className="flex items-center gap-1 hover:text-fg"><Phone size={12} /> {i.phone}</a>}
                {i.orderNumber && <span className="font-mono">Order {i.orderNumber}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {(["IN_PROGRESS", "RESOLVED"] as const).filter((s) => s !== i.status).map((s) => (
                  <form key={s} action={setInquiryStatus}>
                    <input type="hidden" name="id" value={i.id} />
                    <input type="hidden" name="status" value={s} />
                    <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-fg">
                      Mark {s.replace("_", " ").toLowerCase()}
                    </button>
                  </form>
                ))}
                <ConfirmDeleteForm
                  action={deleteInquiry}
                  title="Delete this inquiry?"
                  text={`From ${i.name} (${i.email}). This cannot be undone.`}
                >
                  <input type="hidden" name="id" value={i.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-full border border-danger/30 px-3 py-1.5 text-xs text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </ConfirmDeleteForm>
              </div>
            </div>
          </Card>
        ))}
        {inquiries.length === 0 && <p className="text-muted">Nothing here.</p>}
      </div>
    </>
  );
}
