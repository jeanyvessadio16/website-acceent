import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

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

  return <>{children}</>;
}
