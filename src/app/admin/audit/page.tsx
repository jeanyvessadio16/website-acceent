import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AuditLogList } from "@/components/admin/AuditLogList";
import { getSession } from "@/lib/session";
import { findRecentAuditLogs } from "@/repositories/audit.repository";

export const metadata: Metadata = {
  title: "Journal d'audit",
};

export default async function AdminAuditPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const logs = await findRecentAuditLogs(150);

  return (
    <AdminShell
      title="Journal d'audit & Sécurité"
      subtitle="Traçabilité des actions critiques d'administration et d'authentification"
      user={{
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }}
    >
      <AuditLogList logs={logs} />
    </AdminShell>
  );
}
