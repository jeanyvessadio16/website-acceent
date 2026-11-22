import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { UserShell } from "@/components/dashboard/UserShell";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // ── Protection : L'accès au tableau de bord exige un utilisateur connecté ──
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  // Le compte ADMIN opère exclusivement dans sa console de direction /admin
  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <UserShell
      user={{
        name: `${session.firstname} ${session.lastname}`.trim(),
        email: session.email,
        role: session.role,
      }}
    >
      {children}
    </UserShell>
  );
}
