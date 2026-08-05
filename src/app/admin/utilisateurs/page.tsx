import { AdminShell } from "@/components/admin/AdminShell";
import { UserList } from "@/components/admin/UserList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function UtilisateursPage() {
  const session = await getSession();
  const currentUser = session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  // Récupération de tous les utilisateurs depuis PostgreSQL via Prisma
  const dbUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const formattedUsers = dbUsers.map((u) => ({
    id: u.id,
    firstname: u.firstname,
    lastname: u.lastname,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <AdminShell
      title="Utilisateurs"
      subtitle="Gestion des membres inscrits dans la base de données"
      user={currentUser}
    >
      <UserList users={formattedUsers} currentUserEmail={session?.email} />
    </AdminShell>
  );
}
