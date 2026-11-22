import { redirect } from "next/navigation";
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

  const displayName = `${session.firstname} ${session.lastname}`.trim();

  if (session.role === "ADMIN") {
    const adminData = await getAdminDashboardData();
    return <AdminDashboardClient adminName={displayName} data={adminData} />;
  }

  const authorData = await getAuthorDashboardData(session.userId);
  return <AuthorDashboardClient authorName={displayName} data={authorData} />;
}
