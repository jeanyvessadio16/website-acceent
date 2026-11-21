import prisma from "@/lib/prisma";
import { formatDateFr, logger } from "@/lib/core";
import type {
  ApplicationStatusKey,
  ProgramPoleKey,
} from "@/lib/constants/platform";

export interface PoleBreakdownItem {
  pole: ProgramPoleKey;
  articlesCount: number;
  applicationsCount: number;
  resourcesCount: number;
}

export interface AdminDashboardData {
  dbError: boolean;
  usersCount: number;
  publishedArticlesCount: number;
  totalArticlesCount: number;
  adminCount: number;
  authorCount: number;
  pendingAppsCount: number;
  totalApplicationsCount: number;
  upcomingEventsCount: number;
  totalRegistrationsCount: number;
  resourcesCount: number;
  subscribersCount: number;
  recentArticles: Array<{
    id: string;
    title: string;
    imageUrl: string | null;
    status: "published" | "draft";
    category: string;
    date: string;
    author: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    initials: string;
    date: string;
  }>;
  recentApplications: Array<{
    id: string;
    applicantName: string;
    applicantEmail: string;
    programName: string;
    pole: ProgramPoleKey;
    status: ApplicationStatusKey;
    city: string;
    date: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    location: string;
    isOnline: boolean;
    pole: ProgramPoleKey | null;
    date: string;
    capacity: number | null;
    registrationsCount: number;
  }>;
  poleBreakdown: PoleBreakdownItem[];
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const now = new Date();
    const [
      usersCount,
      publishedArticlesCount,
      totalArticlesCount,
      adminCount,
      authorCount,
      pendingAppsCount,
      totalApplicationsCount,
      upcomingEventsCount,
      totalRegistrationsCount,
      resourcesCount,
      subscribersCount,
      recArticles,
      recUsers,
      recApplications,
      upEvents,
      eduArticles,
      entArticles,
      numArticles,
      eduApps,
      entApps,
      numApps,
      eduRes,
      entRes,
      numRes,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "AUTHOR" } }),
      prisma.programApplication.count({ where: { status: { in: ["PENDING", "REVIEWING"] } } }),
      prisma.programApplication.count(),
      prisma.event.count({ where: { published: true, startDate: { gte: now } } }),
      prisma.eventRegistration.count(),
      prisma.resource.count({ where: { published: true } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.post.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          category: true,
          published: true,
          createdAt: true,
          author: { select: { firstname: true, lastname: true } },
        },
      }),
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.programApplication.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          programName: true,
          pole: true,
          status: true,
          city: true,
          createdAt: true,
          user: { select: { firstname: true, lastname: true, email: true } },
        },
      }),
      prisma.event.findMany({
        where: { published: true, startDate: { gte: now } },
        take: 5,
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          title: true,
          location: true,
          isOnline: true,
          pole: true,
          startDate: true,
          capacity: true,
          _count: { select: { registrations: true } },
        },
      }),
      prisma.post.count({ where: { category: "EDUCATION" } }),
      prisma.post.count({ where: { category: "ENTREPRENEURIAT" } }),
      prisma.post.count({ where: { category: "NUMERIQUE" } }),
      prisma.programApplication.count({ where: { pole: "EDUCATION" } }),
      prisma.programApplication.count({ where: { pole: "ENTREPRENEURIAT" } }),
      prisma.programApplication.count({ where: { pole: "NUMERIQUE" } }),
      prisma.resource.count({ where: { pole: "EDUCATION" } }),
      prisma.resource.count({ where: { pole: "ENTREPRENEURIAT" } }),
      prisma.resource.count({ where: { pole: "NUMERIQUE" } }),
    ]);

    return {
      dbError: false,
      usersCount,
      publishedArticlesCount,
      totalArticlesCount,
      adminCount,
      authorCount,
      pendingAppsCount,
      totalApplicationsCount,
      upcomingEventsCount,
      totalRegistrationsCount,
      resourcesCount,
      subscribersCount,
      recentArticles: recArticles.map((article) => ({
        id: article.id,
        title: article.title,
        imageUrl: article.imageUrl,
        category: article.category,
        status: article.published ? "published" : "draft",
        date: formatDateFr(article.createdAt, { day: "numeric", month: "short" }),
        author: article.author
          ? `${article.author.firstname} ${article.author.lastname}`
          : "Équipe ACCEENT",
      })),
      recentUsers: recUsers.map((u) => {
        const name = `${u.firstname} ${u.lastname}`.trim() || "Utilisateur";
        const initials =
          name
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "UT";
        return {
          id: u.id,
          name,
          email: u.email,
          role: u.role,
          initials,
          date: formatDateFr(u.createdAt, { day: "numeric", month: "short" }),
        };
      }),
      recentApplications: recApplications.map((a) => ({
        id: a.id,
        applicantName: `${a.user.firstname} ${a.user.lastname}`.trim(),
        applicantEmail: a.user.email,
        programName: a.programName,
        pole: a.pole as ProgramPoleKey,
        status: a.status as ApplicationStatusKey,
        city: a.city,
        date: formatDateFr(a.createdAt, { day: "numeric", month: "short" }),
      })),
      upcomingEvents: upEvents.map((ev) => ({
        id: ev.id,
        title: ev.title,
        location: ev.location,
        isOnline: ev.isOnline,
        pole: (ev.pole as ProgramPoleKey) || null,
        date: formatDateFr(ev.startDate, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        capacity: ev.capacity,
        registrationsCount: ev._count.registrations,
      })),
      poleBreakdown: [
        {
          pole: "EDUCATION",
          articlesCount: eduArticles,
          applicationsCount: eduApps,
          resourcesCount: eduRes,
        },
        {
          pole: "ENTREPRENEURIAT",
          articlesCount: entArticles,
          applicationsCount: entApps,
          resourcesCount: entRes,
        },
        {
          pole: "NUMERIQUE",
          articlesCount: numArticles,
          applicationsCount: numApps,
          resourcesCount: numRes,
        },
      ],
    };
  } catch (error) {
    logger.error("dashboard.repository", "Erreur lors du chargement du tableau de bord admin", error);
    return {
      dbError: true,
      usersCount: 0,
      publishedArticlesCount: 0,
      totalArticlesCount: 0,
      adminCount: 0,
      authorCount: 0,
      pendingAppsCount: 0,
      totalApplicationsCount: 0,
      upcomingEventsCount: 0,
      totalRegistrationsCount: 0,
      resourcesCount: 0,
      subscribersCount: 0,
      recentArticles: [],
      recentUsers: [],
      recentApplications: [],
      upcomingEvents: [],
      poleBreakdown: [
        { pole: "EDUCATION", articlesCount: 0, applicationsCount: 0, resourcesCount: 0 },
        { pole: "ENTREPRENEURIAT", articlesCount: 0, applicationsCount: 0, resourcesCount: 0 },
        { pole: "NUMERIQUE", articlesCount: 0, applicationsCount: 0, resourcesCount: 0 },
      ],
    };
  }
}

export interface AuthorDashboardData {
  dbError: boolean;
  myTotalArticles: number;
  myPublishedArticles: number;
  myDraftArticles: number;
  myEventsCount: number;
  myUpcomingEventsCount: number;
  myEventsRegistrationsCount: number;
  myResourcesCount: number;
  myResourcesDownloads: number;
  myRecentArticles: Array<{
    id: string;
    title: string;
    imageUrl: string | null;
    category: string;
    status: "published" | "draft";
    date: string;
  }>;
  myUpcomingEvents: Array<{
    id: string;
    title: string;
    location: string;
    isOnline: boolean;
    date: string;
    capacity: number | null;
    registrationsCount: number;
  }>;
  myRecentResources: Array<{
    id: string;
    title: string;
    pole: ProgramPoleKey;
    type: string;
    downloadCount: number;
    published: boolean;
    date: string;
  }>;
}

export async function getAuthorDashboardData(userId: string): Promise<AuthorDashboardData> {
  try {
    const now = new Date();
    const [
      myTotalArticles,
      myPublishedArticles,
      myEventsCount,
      myUpcomingEventsCount,
      myEventsRegistrationsCount,
      myResourcesCount,
      myResourcesAgg,
      recArticles,
      upEvents,
      recResources,
    ] = await Promise.all([
      prisma.post.count({ where: { authorId: userId } }),
      prisma.post.count({ where: { authorId: userId, published: true } }),
      prisma.event.count({ where: { createdById: userId } }),
      prisma.event.count({
        where: { createdById: userId, published: true, startDate: { gte: now } },
      }),
      prisma.eventRegistration.count({
        where: { event: { createdById: userId } },
      }),
      prisma.resource.count({ where: { createdById: userId } }),
      prisma.resource.aggregate({
        where: { createdById: userId },
        _sum: { downloadCount: true },
      }),
      prisma.post.findMany({
        where: { authorId: userId },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          category: true,
          published: true,
          createdAt: true,
        },
      }),
      prisma.event.findMany({
        where: { createdById: userId },
        take: 6,
        orderBy: { startDate: "desc" },
        select: {
          id: true,
          title: true,
          location: true,
          isOnline: true,
          startDate: true,
          capacity: true,
          _count: { select: { registrations: true } },
        },
      }),
      prisma.resource.findMany({
        where: { createdById: userId },
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          pole: true,
          type: true,
          downloadCount: true,
          published: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      dbError: false,
      myTotalArticles,
      myPublishedArticles,
      myDraftArticles: Math.max(0, myTotalArticles - myPublishedArticles),
      myEventsCount,
      myUpcomingEventsCount,
      myEventsRegistrationsCount,
      myResourcesCount,
      myResourcesDownloads: myResourcesAgg._sum.downloadCount ?? 0,
      myRecentArticles: recArticles.map((a) => ({
        id: a.id,
        title: a.title,
        imageUrl: a.imageUrl,
        category: a.category,
        status: a.published ? "published" : "draft",
        date: formatDateFr(a.createdAt, { day: "numeric", month: "short" }),
      })),
      myUpcomingEvents: upEvents.map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        isOnline: e.isOnline,
        date: formatDateFr(e.startDate, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        capacity: e.capacity,
        registrationsCount: e._count.registrations,
      })),
      myRecentResources: recResources.map((r) => ({
        id: r.id,
        title: r.title,
        pole: r.pole as ProgramPoleKey,
        type: r.type,
        downloadCount: r.downloadCount,
        published: r.published,
        date: formatDateFr(r.createdAt, { day: "numeric", month: "short" }),
      })),
    };
  } catch (error) {
    logger.error("dashboard.repository", "Erreur lors du chargement de l'espace auteur", error);
    return {
      dbError: true,
      myTotalArticles: 0,
      myPublishedArticles: 0,
      myDraftArticles: 0,
      myEventsCount: 0,
      myUpcomingEventsCount: 0,
      myEventsRegistrationsCount: 0,
      myResourcesCount: 0,
      myResourcesDownloads: 0,
      myRecentArticles: [],
      myUpcomingEvents: [],
      myRecentResources: [],
    };
  }
}

export interface MemberDashboardData {
  dbUser: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    createdAt: Date;
  } | null;
  appsCount: number;
  acceptedAppsCount: number;
  ticketsCount: number;
  resourcesCount: number;
  myApplications: Array<{
    id: string;
    programName: string;
    pole: ProgramPoleKey;
    status: ApplicationStatusKey;
    projectTitle: string | null;
    date: string;
  }>;
  myRegistrations: Array<{
    id: string;
    ticketCode: string;
    eventId: string;
    eventTitle: string;
    eventLocation: string;
    eventDate: string;
    isOnline: boolean;
    meetingUrl: string | null;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    location: string;
    isOnline: boolean;
    startDateFormatted: string;
  }>;
  recentArticles: Array<{
    id: string;
    title: string;
    authorName: string;
    date: string;
  }>;
}

export async function getMemberDashboardData(userId: string): Promise<MemberDashboardData> {
  const [
    dbUser,
    recentArticles,
    appsCount,
    acceptedAppsCount,
    ticketsCount,
    resourcesCount,
    upcomingEvents,
    myApps,
    myRegs,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      where: { published: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: { select: { firstname: true, lastname: true } },
      },
    }),
    prisma.programApplication.count({ where: { userId } }),
    prisma.programApplication.count({ where: { userId, status: "ACCEPTED" } }),
    prisma.eventRegistration.count({ where: { userId } }),
    prisma.resource.count({ where: { published: true } }),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: new Date() } },
      take: 4,
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        location: true,
        isOnline: true,
        startDate: true,
      },
    }),
    prisma.programApplication.findMany({
      where: { userId },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        programName: true,
        pole: true,
        status: true,
        projectTitle: true,
        createdAt: true,
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ticketCode: true,
        event: {
          select: {
            id: true,
            title: true,
            location: true,
            isOnline: true,
            meetingUrl: true,
            startDate: true,
          },
        },
      },
    }),
  ]);

  return {
    dbUser,
    appsCount,
    acceptedAppsCount,
    ticketsCount,
    resourcesCount,
    myApplications: myApps.map((a) => ({
      id: a.id,
      programName: a.programName,
      pole: a.pole as ProgramPoleKey,
      status: a.status as ApplicationStatusKey,
      projectTitle: a.projectTitle,
      date: formatDateFr(a.createdAt, { day: "numeric", month: "short", year: "numeric" }),
    })),
    myRegistrations: myRegs.map((r) => ({
      id: r.id,
      ticketCode: r.ticketCode,
      eventId: r.event.id,
      eventTitle: r.event.title,
      eventLocation: r.event.location,
      eventDate: formatDateFr(r.event.startDate, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOnline: r.event.isOnline,
      meetingUrl: r.event.meetingUrl,
    })),
    upcomingEvents: upcomingEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      location: ev.location,
      isOnline: ev.isOnline,
      startDateFormatted: formatDateFr(ev.startDate, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
    recentArticles: recentArticles.map((art) => ({
      id: art.id,
      title: art.title,
      authorName: `${art.author.firstname} ${art.author.lastname}`.trim(),
      date: formatDateFr(art.createdAt, { day: "numeric", month: "short" }),
    })),
  };
}
