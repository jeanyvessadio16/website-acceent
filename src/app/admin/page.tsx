import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { AuthorDashboardClient } from "@/components/admin/AuthorDashboardClient";
import { getSession } from "@/lib/session";
import {
  getAdminDashboardData,
  getAuthorDashboardData,
} from "@/repositories/dashboard.repository";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const currentUser = {
    name: `${session.firstname} ${session.lastname}`.trim(),
    email: session.email,
    role: session.role,
  };

  if (session.role === "ADMIN") {
    const adminData = await getAdminDashboardData();
    return (
      <AdminShell
        title="Tableau de bord Administration"
        subtitle="Cockpit de gestion et supervision de la plateforme ACCEENT"
        user={currentUser}
        action={
          <Link
            href="/admin/articles?new=true"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Nouvel article</span>
          </Link>
        }
      >
        <AdminDashboardClient adminName={currentUser.name} data={adminData} />
      </AdminShell>
    );
  }

  const authorData = await getAuthorDashboardData(session.userId);
  return (
    <AdminShell
      title="Mon Espace Rédacteur"
      subtitle="Tableau de bord personnel de vos publications, ateliers et ressources"
      user={currentUser}
      action={
        <Link
          href="/admin/articles?new=true"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Nouvel article</span>
        </Link>
      }
    >
      <AuthorDashboardClient authorName={currentUser.name} data={authorData} />
    </AdminShell>
  );
}
