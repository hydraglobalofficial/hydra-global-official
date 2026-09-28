import { Download } from "lucide-react";
import { AdminHeader, Card, StatCard, StatusBadge, Table } from "@/components/admin/admin-ui";
import { GenerateCodesForm } from "@/components/admin/generate-codes-form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatCode, formatDate } from "@/lib/utils";
import { voidCode } from "@/server/actions/admin";

export const metadata = { title: "Verification" };

export default async function AdminVerificationsPage() {
  await requireAdmin();
  const [products, batches, totals, attempts, suspicious] = await Promise.all([
    db.product.findMany({ where: { status: { not: "ARCHIVED" } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.authenticityCode.groupBy({ by: ["batch", "productId"], _count: true, _sum: { verifyCount: true }, orderBy: { batch: "desc" }, take: 20 }),
    db.verificationAttempt.groupBy({ by: ["result"], _count: true }),
    db.verificationAttempt.findMany({ orderBy: { createdAt: "desc" }, take: 15, include: { code: { select: { product: { select: { name: true } } } } } }),
    db.authenticityCode.findMany({ where: { verifyCount: { gte: 3 } }, orderBy: { verifyCount: "desc" }, take: 10, include: { product: { select: { name: true } } } }),
  ]);
  const productName = new Map(products.map((p) => [p.id, p.name]));
  const count = (r: string) => totals.find((t) => t.result === r)?._count ?? 0;

  return (
    <>
      <AdminHeader title="Verification" description="Generate authenticity codes for packaging and monitor verification activity." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Genuine checks" value={count("GENUINE")} />
        <StatCard label="Repeat checks" value={count("ALREADY_VERIFIED")} />
        <StatCard label="Unknown codes" value={count("NOT_FOUND")} hint="Possible counterfeits" />
        <StatCard label="Voided hits" value={count("VOID")} />
      </div>

      <Card className="mt-8 p-6">
        <h2 className="mb-5 font-medium">Generate codes</h2>
        <GenerateCodesForm products={products} />
      </Card>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <h2 className="mb-4 font-medium">Batches</h2>
          <Table>
            <thead><tr><th>Batch</th><th>Product</th><th className="text-right">Codes</th><th className="text-right">Scans</th><th /></tr></thead>
            <tbody>
              {batches.map((b) => (
                <tr key={`${b.batch}-${b.productId}`}>
                  <td className="font-mono">{b.batch}</td>
                  <td className="text-muted">{productName.get(b.productId) ?? "—"}</td>
                  <td className="text-right font-mono">{b._count}</td>
                  <td className="text-right font-mono">{b._sum.verifyCount ?? 0}</td>
                  <td className="text-right">
                    <a href={`/admin/verifications/export?batch=${encodeURIComponent(b.batch)}&product=${b.productId}`} className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                      <Download size={12} /> CSV
                    </a>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No codes generated yet.</td></tr>}
            </tbody>
          </Table>
        </section>

        <section>
          <h2 className="mb-4 font-medium">Suspicious codes <span className="text-xs text-subtle">(3+ scans)</span></h2>
          <Table>
            <thead><tr><th>Code</th><th>Product</th><th className="text-right">Scans</th><th /></tr></thead>
            <tbody>
              {suspicious.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono text-xs">{formatCode(c.code)} {c.status === "VOID" && <StatusBadge status="VOID" />}</td>
                  <td className="text-muted">{c.product.name}</td>
                  <td className="text-right font-mono text-warning">{c.verifyCount}</td>
                  <td className="text-right">
                    {c.status === "ACTIVE" && (
                      <form action={voidCode}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-xs text-danger hover:underline">Void</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {suspicious.length === 0 && <tr><td colSpan={4} className="text-center text-muted">Nothing suspicious.</td></tr>}
            </tbody>
          </Table>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-medium">Recent verification attempts</h2>
        <Table>
          <thead><tr><th>When</th><th>Input</th><th>Product</th><th>Result</th></tr></thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.id}>
                <td className="text-xs text-muted">{formatDate(a.createdAt)} {a.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</td>
                <td className="font-mono text-xs">{formatCode(a.input)}</td>
                <td className="text-muted">{a.code?.product.name ?? "—"}</td>
                <td><StatusBadge status={a.result} /></td>
              </tr>
            ))}
            {attempts.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No attempts yet.</td></tr>}
          </tbody>
        </Table>
      </section>
    </>
  );
}
