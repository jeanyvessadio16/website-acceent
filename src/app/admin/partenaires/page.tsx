import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ShowcaseManager } from "@/components/admin/ShowcaseManager";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Partenaires & Témoignages",
};

export default async function AdminPartenairesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const [partners, testimonials] = await Promise.all([
    prisma.partner.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.testimonial.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <AdminShell
      title="Partenaires & Témoignages"
      subtitle="Gérez les logos partenaires et les témoignages affichés sur le site ACCEENT"
      user={{
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }}
    >
      <ShowcaseManager partners={partners} testimonials={testimonials} />
    </AdminShell>
  );
}
