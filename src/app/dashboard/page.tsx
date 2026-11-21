import { redirect } from "next/navigation";
import { UserShell } from "@/components/dashboard/UserShell";
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

  const currentUser = data.dbUser
    ? {
        name: `${data.dbUser.firstname} ${data.dbUser.lastname}`.trim(),
        email: data.dbUser.email,
        role: data.dbUser.role,
      }
    : {
        name: `${session.firstname} ${session.lastname}`.trim(),
        email: session.email,
        role: session.role,
      };

  const joinDate = data.dbUser ? formatDateFr(data.dbUser.createdAt) : "Récemment";

  return (
    <UserShell
      title="Mon Espace Personnel"
      subtitle="Tableau de bord indépendant : candidatures, billets PDF et ressources"
      user={currentUser}
    >
      <MemberDashboardClient
        firstname={data.dbUser?.firstname || session.firstname || "Membre"}
        joinDate={joinDate}
        data={data}
      />
    </UserShell>
  );
}
