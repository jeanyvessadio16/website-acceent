import type { Metadata } from "next";
import { redirect } from "next/navigation";
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

  return <ShowcaseManager partners={partners} testimonials={testimonials} />;
}
