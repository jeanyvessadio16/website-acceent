import { redirect } from "next/navigation";
import { MemberDashboardClient } from "@/components/dashboard/MemberDashboardClient";
import { getSession } from "@/lib/session";
import { getMemberDashboardData } from "@/repositories/dashboard.repository";
import { formatDateFr } from "@/lib/core";

export default async function UserDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  const data = await getMemberDashboardData(session.userId);
  const joinDate = data.dbUser ? formatDateFr(data.dbUser.createdAt) : "Récemment";

  return (
    <MemberDashboardClient
      firstname={data.dbUser?.firstname || session.firstname || "Membre"}
      joinDate={joinDate}
      data={data}
    />
  );
}
