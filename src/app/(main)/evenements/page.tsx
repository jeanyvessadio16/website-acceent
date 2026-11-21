import { createPageMetadata } from "@/lib/seo";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { PublicEventsList, type PublicEventItem } from "@/components/events/PublicEventsList";
import { FadeIn } from "@/components/shared/Animations";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CalendarDays } from "lucide-react";
import type { ProgramPoleKey } from "@/lib/constants/platform";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = createPageMetadata({
  title: "Événements, Ateliers & Forums — ACCEENT Ziguinchor",
  description:
    "Calendrier des prochains ateliers, conférences, hackathons et forums organisés par l'association ACCEENT à Ziguinchor et en ligne.",
  path: "/evenements",
  keywords: [
    "événements ACCEENT Ziguinchor",
    "ateliers entrepreneuriat Ziguinchor",
    "forum entrepreneur Casamance",
    "robotique WRO Sénégal",
  ],
});

export default async function EvenementsPublicPage() {
  const session = await getSession();
  let items: PublicEventItem[] = [];

  try {
    const dbEvents = await prisma.event.findMany({
      where: { published: true },
      orderBy: { startDate: "asc" },
      include: {
        _count: { select: { registrations: true } },
        ...(session
          ? {
              registrations: {
                where: { userId: session.userId },
                select: { ticketCode: true },
              },
            }
          : {}),
      },
    });

    items = dbEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      slug: ev.slug,
      description: ev.description,
      pole: (ev.pole as ProgramPoleKey) || null,
      location: ev.location,
      isOnline: ev.isOnline,
      meetingUrl: ev.meetingUrl,
      imageUrl: ev.imageUrl,
      startDateIso: ev.startDate.toISOString(),
      startDateFormatted: ev.startDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      endDateFormatted: ev.endDate
        ? ev.endDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      capacity: ev.capacity,
      registrationCount: ev._count.registrations,
      myTicketCode:
        "registrations" in ev && Array.isArray(ev.registrations) && ev.registrations[0]
          ? ev.registrations[0].ticketCode
          : null,
    }));
  } catch (error) {
    console.error("Erreur de chargement des événements:", error);
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Événements", item: "/evenements" },
        ]}
      />
      <main className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-10">
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#836182]/10 border border-[#836182]/20 text-[#836182] text-xs font-bold uppercase tracking-wider">
                <CalendarDays className="size-3.5" />
                <span>Agenda & Rencontres</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Événements & Ateliers <span className="text-[#836182]">ACCEENT</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Participez à nos rencontres, sessions de mentorat, ateliers pratiques et forums entrepreneuriaux à Ziguinchor et en ligne.
              </p>
            </div>
          </FadeIn>

          <PublicEventsList events={items} isAuthenticated={Boolean(session)} />
        </div>
      </main>
    </>
  );
}
