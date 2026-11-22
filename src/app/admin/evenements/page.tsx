import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EventAdminList } from "@/components/admin/EventAdminList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ProgramPoleKey } from "@/lib/constants/platform";

export const metadata: Metadata = {
  title: "Événements",
};

function toDateTimeLocal(d: Date | null): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function AdminEvenementsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; action?: string }>;
}) {
  const [session, sp] = await Promise.all([getSession(), searchParams]);
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    redirect("/auth/login");
  }

  const initialOpenCreate = sp.new === "true" || sp.action === "new";
  const isAuthorOnly = session.role === "AUTHOR";

  const dbEvents = await prisma.event.findMany({
    where: isAuthorOnly ? { createdById: session.userId } : undefined,
    orderBy: { startDate: "desc" },
    include: {
      registrations: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { firstname: true, lastname: true, email: true } },
        },
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
    startDateInput: toDateTimeLocal(ev.startDate),
    endDateInput: toDateTimeLocal(ev.endDate),
    startDateFormatted: ev.startDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    capacity: ev.capacity,
    published: ev.published,
    createdById: ev.createdById,
    registrations: ev.registrations.map((r) => ({
      id: r.id,
      ticketCode: r.ticketCode,
      name: `${r.user.firstname} ${r.user.lastname}`,
      email: r.user.email,
      phone: r.phone,
      attended: r.attended,
      createdAt: r.createdAt.toLocaleDateString("fr-FR"),
    })),
  }));

  return (
    <EventAdminList
      events={formatted}
      currentUserId={session.userId}
      currentUserRole={session.role}
      initialOpenCreate={initialOpenCreate}
    />
  );
}
