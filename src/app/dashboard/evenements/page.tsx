import { redirect } from "next/navigation";
import { MemberEventsList } from "@/components/dashboard/MemberEventsList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ProgramPoleKey } from "@/lib/constants/platform";

export default async function MemberEvenementsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/evenements");
  }

  const dbEvents = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
    include: {
      _count: { select: { registrations: true } },
      registrations: {
        where: { userId: session.userId },
        select: { id: true, ticketCode: true },
      },
    },
  });

  const formatted = dbEvents.map((ev) => ({
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
    myTicketCode: ev.registrations[0]?.ticketCode || null,
    myRegistrationId: ev.registrations[0]?.id || null,
  }));

  return <MemberEventsList events={formatted} />;
}
