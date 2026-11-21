import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDateFr, recordAuditLog } from "@/lib/core";
import {
  APPLICATION_STATUSES,
  POST_CATEGORIES,
  PROGRAM_POLES,
  type ApplicationStatusKey,
  type PostCategoryKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";
import {
  buildAdminOverviewWorkbook,
  buildApplicationsWorkbook,
  buildEventAttendanceWorkbook,
  buildUsersWorkbook,
} from "@/lib/export/excel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "overview";

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

    const bytes = await buildEventAttendanceWorkbook({
      title: event.title,
      dateFormatted: formatDateFr(event.startDate, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: event.location,
      registrations: event.registrations.map((r) => ({
        ticketCode: r.ticketCode,
        fullName: `${r.user.firstname} ${r.user.lastname}`.trim(),
        email: r.user.email,
        phone: r.phone || "",
        attended: r.attended,
        registeredAt: formatDateFr(r.createdAt, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      })),
    });

    await recordAuditLog({
      session,
      action: "EXPORT_EXCEL",
      entity: "event",
      entityId: event.id,
      metadata: { title: event.title, rows: event.registrations.length },
    });

    const safeSlug = (event.slug || "evenement").replace(/[^a-z0-9-_]/gi, "-");
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="emargement-${safeSlug}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // Les exports globaux (overview, users, applications) sont strictement réservés aux ADMIN
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Action réservée aux administrateurs" }, { status: 403 });
  }

  const nowLabel = formatDateFr(new Date(), {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (type === "users") {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
        createdAt: true,
      },
    });

    const bytes = await buildUsersWorkbook(
      users.map((u) => ({
        fullName: `${u.firstname} ${u.lastname}`.trim(),
        email: u.email,
        role: u.role,
        age: u.age,
        sexe: u.sexe === "HOMME" ? "Homme" : "Femme",
        milieuResidence: u.milieuResidence === "RURAL" ? "Rural" : "Urbain",
        telephone: u.telephone,
        sdh: u.sdh,
        newsletterOptIn: u.newsletterOptIn,
        date: formatDateFr(u.createdAt, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      })),
      nowLabel
    );

    await recordAuditLog({
      session,
      action: "EXPORT_EXCEL",
      entity: "users",
      metadata: { count: users.length },
    });

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="acceent-utilisateurs.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  }

  if (type === "applications") {
    const apps = await prisma.programApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstname: true, lastname: true, email: true } },
      },
    });

    const bytes = await buildApplicationsWorkbook(
      apps.map((a) => ({
        applicantName: `${a.user.firstname} ${a.user.lastname}`.trim(),
        applicantEmail: a.user.email,
        programName: a.programName,
        pole: PROGRAM_POLES[a.pole as ProgramPoleKey]?.label || a.pole,
        phone: a.phone,
        city: a.city,
        projectTitle: a.projectTitle || "",
        statusLabel:
          APPLICATION_STATUSES[a.status as ApplicationStatusKey]?.label || a.status,
        date: formatDateFr(a.createdAt, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      })),
      nowLabel
    );

    await recordAuditLog({
      session,
      action: "EXPORT_EXCEL",
      entity: "applications",
      metadata: { count: apps.length },
    });

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="acceent-candidatures.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  }

  // Par défaut : overview complet multi-onglets
  const [posts, apps, events, users, resourcesCount, subscribersCount] =
    await Promise.all([
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          title: true,
          category: true,
          published: true,
          createdAt: true,
          author: { select: { firstname: true, lastname: true } },
        },
      }),
      prisma.programApplication.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstname: true, lastname: true, email: true } },
        },
      }),
      prisma.event.findMany({
        orderBy: { startDate: "desc" },
        include: { _count: { select: { registrations: true } } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
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
          createdAt: true,
        },
      }),
      prisma.resource.count({ where: { published: true } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
    ]);

  const now = new Date();
  const bytes = await buildAdminOverviewWorkbook({
    generatedAt: nowLabel,
    generatedBy: `${session.firstname} ${session.lastname}`.trim(),
    kpis: {
      usersCount: users.length,
      publishedArticlesCount: posts.filter((p) => p.published).length,
      totalArticlesCount: posts.length,
      pendingAppsCount: apps.filter(
        (a) => a.status === "PENDING" || a.status === "REVIEWING"
      ).length,
      totalAppsCount: apps.length,
      upcomingEventsCount: events.filter((e) => e.published && e.startDate >= now).length,
      resourcesCount,
      subscribersCount,
    },
    articles: posts.map((p) => ({
      title: p.title,
      category:
        POST_CATEGORIES[p.category as PostCategoryKey]?.label || p.category,
      author: `${p.author.firstname} ${p.author.lastname}`.trim(),
      published: p.published,
      date: formatDateFr(p.createdAt, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    })),
    applications: apps.map((a) => ({
      applicantName: `${a.user.firstname} ${a.user.lastname}`.trim(),
      applicantEmail: a.user.email,
      programName: a.programName,
      pole: PROGRAM_POLES[a.pole as ProgramPoleKey]?.label || a.pole,
      city: a.city,
      statusLabel:
        APPLICATION_STATUSES[a.status as ApplicationStatusKey]?.label || a.status,
      date: formatDateFr(a.createdAt, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    })),
    events: events.map((e) => ({
      title: e.title,
      pole: e.pole
        ? PROGRAM_POLES[e.pole as ProgramPoleKey]?.label || e.pole
        : "Général",
      location: e.location,
      isOnline: e.isOnline,
      date: formatDateFr(e.startDate, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      registrationsCount: e._count.registrations,
      capacity: e.capacity,
    })),
    users: users.map((u) => ({
      fullName: `${u.firstname} ${u.lastname}`.trim(),
      email: u.email,
      role: u.role,
      age: u.age,
      sexe: u.sexe === "HOMME" ? "Homme" : "Femme",
      milieuResidence: u.milieuResidence === "RURAL" ? "Rural" : "Urbain",
      telephone: u.telephone,
      sdh: u.sdh,
      newsletterOptIn: u.newsletterOptIn,
      date: formatDateFr(u.createdAt, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    })),
  });

  await recordAuditLog({
    session,
    action: "EXPORT_EXCEL",
    entity: "overview",
  });

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="acceent-rapport-synthese.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
