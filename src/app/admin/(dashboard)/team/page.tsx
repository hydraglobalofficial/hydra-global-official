import Link from "next/link";
import { Plus, Shield, Users } from "lucide-react";
import { AdminHeader, Card, Panel, StatusBadge, Table } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Team" };

export default async function AdminTeamPage() {
  const session = await requireAdmin();
  const admins = await db.user.findMany({
    where: { role: { in: ["OWNER", "STAFF"] } },
    select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const owners = admins.filter((a) => a.role === "OWNER").length;
  const staff = admins.filter((a) => a.role === "STAFF").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminHeader
        eyebrow="Access"
        title="Admin team"
        description="People who can sign in to the HYDRA control room. New staff register with the master key."
        action={
          <Link
            href="/admin/register"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-sm transition-colors hover:border-accent/40 hover:bg-accent/10"
          >
            <Plus size={14} /> Add admin
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Total admins</p>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{admins.length}</p>
        </Card>
        <Card className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Owners</p>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-accent">{owners}</p>
        </Card>
        <Card className="col-span-2 p-4 sm:col-span-1 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Staff</p>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{staff}</p>
        </Card>
      </div>

      <Panel title="Signed-in capable accounts" icon={<Users size={14} className="text-accent" />}>
        <div className="hidden sm:block">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-medium">
                        {a.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span>
                        {a.name}
                        {a.id === session.userId ? (
                          <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-accent">you</span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-muted">@{a.username}</td>
                  <td className="text-muted">{a.email}</td>
                  <td>
                    <StatusBadge status={a.role} />
                  </td>
                  <td className="text-xs text-subtle">{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <ul className="divide-y divide-white/[0.05] sm:hidden">
          {admins.map((a) => (
            <li key={a.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {a.name}
                    {a.id === session.userId ? <span className="ml-2 text-xs text-accent">you</span> : null}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted">@{a.username}</p>
                  <p className="mt-0.5 text-xs text-subtle">{a.email}</p>
                </div>
                <StatusBadge status={a.role} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Card className="flex items-start gap-3 p-5">
        <Shield size={18} className="mt-0.5 shrink-0 text-accent" />
        <div className="text-sm leading-relaxed text-muted">
          <p className="font-medium text-fg">How access works</p>
          <p className="mt-1">
            First account registered with the master key becomes <span className="text-fg">OWNER</span>. Later accounts
            become <span className="text-fg">STAFF</span>. Only OWNER and STAFF can open <code className="text-accent">/admin</code>.
          </p>
        </div>
      </Card>
    </div>
  );
}
