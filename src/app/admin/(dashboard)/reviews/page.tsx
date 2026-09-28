import Link from "next/link";
import { Check, X } from "lucide-react";
import { AdminHeader, Card, StatusBadge } from "@/components/admin/admin-ui";
import { Rating } from "@/components/ui/primitives";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { moderateReview } from "@/server/actions/admin";

export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await db.review.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <>
      <AdminHeader title="Reviews" description="Approve reviews before they appear on product pages. Ratings update automatically." />
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-start">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <Rating value={r.rating} size={12} />
                <StatusBadge status={r.status} />
                <span className="text-xs text-subtle">{r.authorName} · {formatDate(r.createdAt)}</span>
              </div>
              {r.title && <p className="font-medium">{r.title}</p>}
              <p className="text-sm text-muted">{r.comment}</p>
              <Link href={`/product/${r.product.slug}`} target="_blank" className="text-xs text-accent hover:underline">{r.product.name}</Link>
            </div>
            <div className="flex gap-2">
              {r.status !== "APPROVED" && (
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="flex items-center gap-1 rounded-full border border-success/30 px-3 py-1.5 text-xs text-success hover:bg-success/10"><Check size={12} /> Approve</button>
                </form>
              )}
              {r.status !== "REJECTED" && (
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="REJECTED" />
                  <button type="submit" className="flex items-center gap-1 rounded-full border border-danger/30 px-3 py-1.5 text-xs text-danger hover:bg-danger/10"><X size={12} /> Reject</button>
                </form>
              )}
            </div>
          </Card>
        ))}
        {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      </div>
    </>
  );
}
