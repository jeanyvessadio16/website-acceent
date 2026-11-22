import { ProfileForm } from "@/components/admin/ProfileForm";
import { MemberNewsletterToggle } from "@/components/dashboard/MemberNewsletterToggle";
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
        age: true,
        sexe: true,
        milieuResidence: true,
        telephone: true,
        sdh: true,
        newsletterOptIn: true,
      },
    });
  }

  const initialProfile = dbUser || {
    firstname: session?.firstname || "Membre",
    lastname: session?.lastname || "ACCEENT",
    email: session?.email || "membre@acceent.org",
    role: session?.role || "USER",
    age: 25,
    sexe: "HOMME" as const,
    milieuResidence: "URBAIN" as const,
    telephone: "",
    sdh: false,
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <ProfileForm initialUser={initialProfile} />
      <MemberNewsletterToggle initialOptIn={dbUser?.newsletterOptIn ?? true} />
    </div>
  );
}
