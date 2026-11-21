import prisma from "@/lib/prisma";
import { logger } from "@/lib/core";
import type { PublicPartnerItem } from "@/components/shared/Partenaires";
import type { PublicTestimonialItem } from "@/components/shared/TestimonialsSection";

export async function findActivePartners(): Promise<PublicPartnerItem[]> {
  try {
    const dbPartners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        logoUrl: true,
        description: true,
        website: true,
      },
    });

    return dbPartners.map((p) => ({
      id: p.id,
      name: p.name,
      logo: p.logoUrl,
      description: p.description,
      website: p.website,
    }));
  } catch (error) {
    logger.error("showcase.repository", "Impossible de récupérer les partenaires actifs", error);
    return [];
  }
}

export async function findActiveTestimonials(limit = 6): Promise<PublicTestimonialItem[]> {
  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        authorName: true,
        authorRole: true,
        program: true,
        quote: true,
        avatarUrl: true,
        rating: true,
      },
    });

    return dbTestimonials;
  } catch (error) {
    logger.error("showcase.repository", "Impossible de récupérer les témoignages actifs", error);
    return [];
  }
}
