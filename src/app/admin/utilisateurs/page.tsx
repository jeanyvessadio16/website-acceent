import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserList } from "@/components/admin/UserList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

export default async function UtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; action?: string }>;
}) {
  const [session, sp] = await Promise.all([getSession(), searchParams]);

  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const initialOpenCreate = sp.new === "true" || sp.action === "new";

  const currentUser = {
    name: `${session.firstname} ${session.lastname}`,
    email: session.email,
    role: session.role,
  };

  const dbUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      age: true,
      sexe: true,
      milieuResidence: true,
      telephone: true,
      sdh: true,
      createdAt: true,
    },
  });

  const formattedUsers = dbUsers.map((u) => ({
    id: u.id,
    firstname: u.firstname,
    lastname: u.lastname,
    email: u.email,
    role: u.role,
    age: u.age,
    sexe: u.sexe,
    milieuResidence: u.milieuResidence,
    telephone: u.telephone,
    sdh: u.sdh,
    createdAt: u.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <AdminShell
      title="Utilisateurs"
      subtitle="Gestion des membres inscrits et profils démographiques dans la base de données"
      user={currentUser}
    >
      <UserList
        users={formattedUsers}
        currentUserEmail={session?.email}
        initialOpenCreate={initialOpenCreate}
      />
    </AdminShell>
  );
}
