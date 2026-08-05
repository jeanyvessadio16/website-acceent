import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin ACCEENT",
    default: "Tableau de bord | Admin ACCEENT",
  },
  description: "Espace d'administration ACCEENT.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Protection serveur : seuls les utilisateurs avec une session valide accèdent à /admin ──
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.role !== "ADMIN" && session.role !== "AUTHOR") {
    redirect("/dashboard");
  }

  return children;
}
