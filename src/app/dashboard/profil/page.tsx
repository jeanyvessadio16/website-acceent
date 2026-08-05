import { UserShell } from "@/components/dashboard/UserShell";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function UserProfilPage() {
  const session = await getSession();

  let dbUser = null;
  if (session?.userId) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        role: true,
      },
    });
  }

  const currentUser = dbUser
    ? {
        name: `${dbUser.firstname} ${dbUser.lastname}`,
        email: dbUser.email,
        role: dbUser.role,
      }
    : session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  const initialProfile = dbUser || {
    firstname: session?.firstname || "Membre",
    lastname: session?.lastname || "ACCEENT",
    email: session?.email || "membre@acceent.org",
    role: session?.role || "USER",
  };

  return (
    <UserShell
      title="Mon Profil"
      subtitle="Gestion de vos informations personnelles et de votre mot de passe"
      user={currentUser}
    >
      <div className="space-y-6 max-w-3xl">
        <ProfileForm initialUser={initialProfile} />
      </div>
    </UserShell>
  );
}
