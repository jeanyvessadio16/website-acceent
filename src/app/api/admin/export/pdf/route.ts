import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDateFr, checkDistributedRateLimit, recordAuditLog } from "@/lib/core";
import {
  APPLICATION_STATUSES,
  PROGRAM_POLES,
  type ApplicationStatusKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";
import {
  renderAdminReportPdf,
  renderEventAttendancePdf,
} from "@/lib/export/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  const rate = await checkDistributedRateLimit(`export:${session.userId}`, {
    limit: 30,
    windowMs: 15 * 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop d'exports récents. Veuillez patienter avant de réessayer." },
      { status: 429 }
    );
  }

  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "overview";

  const nowLabel = formatDateFr(new Date(), {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (type === "event") {
    const eventId = searchParams.get("eventId");
    if (!eventId) {
      return NextResponse.json({ error: "Paramètre eventId manquant" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { firstname: true, lastname: true, email: true } },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }

    if (session.role !== "ADMIN" && event.createdById !== session.userId) {
      return NextResponse.json({ error: "Action interdite" }, { status: 403 });
    }

    const bytes = await renderEventAttendancePdf({
      title: event.title,
      dateFormatted: formatDateFr(event.startDate, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: event.location,
      poleLabel: event.pole
        ? PROGRAM_POLES[event.pole as ProgramPoleKey]?.label || event.pole
        : "Général ACCEENT",
      capacity: event.capacity,
      generatedAt: nowLabel,
      registrations: event.registrations.map((r) => ({
        ticketCode: r.ticketCode,
        fullName: `${r.user.firstname} ${r.user.lastname}`.trim(),
        email: r.user.email,
        phone: r.phone || "",
        attended: r.attended,
      })),
    });

    await recordAuditLog({
      session,
      action: "EXPORT_PDF",
      entity: "event",
      entityId: event.id,
      metadata: { title: event.title, rows: event.registrations.length },
    });

    const safeSlug = (event.slug || "evenement").replace(/[^a-z0-9-_]/gi, "-");
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="emargement-${safeSlug}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  }

  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Action réservée aux administrateurs" }, { status: 403 });
  }

  const now = new Date();
  const [
    usersCount,
    publishedArticlesCount,
    totalArticlesCount,
    pendingAppsCount,
    totalAppsCount,
    upcomingEventsCount,
    resourcesCount,
    subscribersCount,
    recentArticles,
    recentApplications,
    upcomingEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count(),
    prisma.programApplication.count({
      where: { status: { in: ["PENDING", "REVIEWING"] } },
    }),
    prisma.programApplication.count(),
    prisma.event.count({ where: { published: true, startDate: { gte: now } } }),
    prisma.resource.count({ where: { published: true } }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.post.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        published: true,
        createdAt: true,
        author: { select: { firstname: true, lastname: true } },
      },
    }),
    prisma.programApplication.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstname: true, lastname: true } },
      },
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: now } },
      take: 8,
      orderBy: { startDate: "asc" },
      include: { _count: { select: { registrations: true } } },
    }),
  ]);

  const bytes = await renderAdminReportPdf({
    generatedAt: nowLabel,
    generatedBy: `${session.firstname} ${session.lastname}`.trim(),
    kpis: {
      usersCount,
      publishedArticlesCount,
      totalArticlesCount,
      pendingAppsCount,
      totalAppsCount,
      upcomingEventsCount,
      resourcesCount,
      subscribersCount,
    },
    recentArticles: recentArticles.map((a) => ({
      title: a.title,
      author: `${a.author.firstname} ${a.author.lastname}`.trim(),
      status: a.published ? "Publie" : "Brouillon",
      date: formatDateFr(a.createdAt, { day: "2-digit", month: "2-digit", year: "numeric" }),
    })),
    recentApplications: recentApplications.map((a) => ({
      applicantName: `${a.user.firstname} ${a.user.lastname}`.trim(),
      programName: a.programName,
      statusLabel:
        APPLICATION_STATUSES[a.status as ApplicationStatusKey]?.label || a.status,
      city: a.city,
      date: formatDateFr(a.createdAt, { day: "2-digit", month: "2-digit", year: "numeric" }),
    })),
    upcomingEvents: upcomingEvents.map((e) => ({
      title: e.title,
      location: e.location,
      date: formatDateFr(e.startDate, { day: "2-digit", month: "2-digit", year: "numeric" }),
      registrationsCount: e._count.registrations,
      capacity: e.capacity,
    })),
  });

  await recordAuditLog({
    session,
    action: "EXPORT_PDF",
    entity: "overview",
  });

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="acceent-rapport-synthese.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
