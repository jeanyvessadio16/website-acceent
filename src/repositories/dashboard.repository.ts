import prisma from "@/lib/prisma";
import { formatDateFr, logger } from "@/lib/core";
import {
  APPLICATION_STATUSES,
  type ApplicationStatusKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";

export interface PoleBreakdownItem {
  pole: ProgramPoleKey;
  articlesCount: number;
  applicationsCount: number;
  resourcesCount: number;
}

export interface MonthlyTrendPoint {
  month: string;
  membres: number;
  candidatures: number;
  publications: number;
  inscriptions: number;
}

export interface ApplicationStatusItem {
  status: ApplicationStatusKey;
  label: string;
  count: number;
  color: string;
}

export interface AdminDemographics {
  bySexe: Array<{ name: string; value: number; color: string }>;
  byMilieu: Array<{ name: string; value: number; color: string }>;
  byAgeGroup: Array<{ group: string; count: number }>;
  byRole: Array<{ role: string; label: string; count: number; color: string }>;
  sdhCount: number;
  verifiedUsersCount: number;
}

export interface RecentAuditItem {
  id: string;
  action: string;
  entity: string;
  actorEmail: string | null;
  actorRole: string | null;
  date: string;
}

const STATUS_CHART_COLORS: Record<ApplicationStatusKey, string> = {
  PENDING: "#f59e0b",
  REVIEWING: "#0ea5e9",
  INTERVIEW: "#836182",
  ACCEPTED: "#10b981",
  REJECTED: "#f43f5e",
};

const ORDERED_STATUSES: ApplicationStatusKey[] = [
  "PENDING",
  "REVIEWING",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
];

function createEmptySixMonthBuckets(now: Date) {
  const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  const buckets: Array<MonthlyTrendPoint & { key: string }> = [];
  const map = new Map<string, MonthlyTrendPoint & { key: string }>();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const rawLabel = monthFormatter.format(d).replace(/\.$/, "");
    const month = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
    const item = {
      key,
      month,
      membres: 0,
      candidatures: 0,
      publications: 0,
      inscriptions: 0,
    };
    buckets.push(item);
    map.set(key, item);
  }

  return { buckets, map };
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
  monthlyTrend: MonthlyTrendPoint[];
  applicationStatusBreakdown: ApplicationStatusItem[];
  demographics: AdminDemographics;
  recentAuditLogs: RecentAuditItem[];
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
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
      trendUsers,
      trendApps,
      trendPosts,
      trendRegs,
      appStatusGroups,
      allUsersDemo,
      recAuditLogs,
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
      prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.programApplication.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.post.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.eventRegistration.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.programApplication.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.user.findMany({
        select: {
          age: true,
          sexe: true,
          milieuResidence: true,
          sdh: true,
          role: true,
          emailVerifiedAt: true,
        },
      }),
      prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          entity: true,
          actorEmail: true,
          actorRole: true,
          createdAt: true,
        },
      }),
    ]);

    const { buckets, map: bucketMap } = createEmptySixMonthBuckets(now);
    const bumpMonth = (
      date: Date,
      field: "membres" | "candidatures" | "publications" | "inscriptions"
    ) => {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket[field] += 1;
      }
    };

    for (const row of trendUsers) bumpMonth(row.createdAt, "membres");
    for (const row of trendApps) bumpMonth(row.createdAt, "candidatures");
    for (const row of trendPosts) bumpMonth(row.createdAt, "publications");
    for (const row of trendRegs) bumpMonth(row.createdAt, "inscriptions");

    const monthlyTrend: MonthlyTrendPoint[] = buckets.map(
      ({ month, membres, candidatures, publications, inscriptions }) => ({
        month,
        membres,
        candidatures,
        publications,
        inscriptions,
      })
    );

    const statusCountMap = new Map<ApplicationStatusKey, number>();
    for (const g of appStatusGroups) {
      statusCountMap.set(g.status as ApplicationStatusKey, g._count._all);
    }
    const applicationStatusBreakdown: ApplicationStatusItem[] = ORDERED_STATUSES.map(
      (status) => ({
        status,
        label: APPLICATION_STATUSES[status].label,
        count: statusCountMap.get(status) ?? 0,
        color: STATUS_CHART_COLORS[status],
      })
    );

    let hommes = 0;
    let femmes = 0;
    let urbain = 0;
    let rural = 0;
    let age10_17 = 0;
    let age18_24 = 0;
    let age25_34 = 0;
    let age35Plus = 0;
    let roleUser = 0;
    let roleAuthor = 0;
    let roleAdmin = 0;
    let sdhCount = 0;
    let verifiedUsersCount = 0;

    for (const u of allUsersDemo) {
      if (u.sexe === "HOMME") hommes += 1;
      else if (u.sexe === "FEMME") femmes += 1;

      if (u.milieuResidence === "URBAIN") urbain += 1;
      else if (u.milieuResidence === "RURAL") rural += 1;

      if (u.age <= 17) age10_17 += 1;
      else if (u.age <= 24) age18_24 += 1;
      else if (u.age <= 34) age25_34 += 1;
      else age35Plus += 1;

      if (u.role === "ADMIN") roleAdmin += 1;
      else if (u.role === "AUTHOR") roleAuthor += 1;
      else roleUser += 1;

      if (u.sdh) sdhCount += 1;
      if (u.emailVerifiedAt) verifiedUsersCount += 1;
    }

    const demographics: AdminDemographics = {
      bySexe: [
        { name: "Hommes", value: hommes, color: "#0ea5e9" },
        { name: "Femmes", value: femmes, color: "#836182" },
      ],
      byMilieu: [
        { name: "Urbain", value: urbain, color: "#10b981" },
        { name: "Rural", value: rural, color: "#f59e0b" },
      ],
      byAgeGroup: [
        { group: "10-17", count: age10_17 },
        { group: "18-24", count: age18_24 },
        { group: "25-34", count: age25_34 },
        { group: "35+", count: age35Plus },
      ],
      byRole: [
        { role: "USER", label: "Membres", count: roleUser, color: "#0ea5e9" },
        { role: "AUTHOR", label: "Auteurs", count: roleAuthor, color: "#e08637" },
        { role: "ADMIN", label: "Admins", count: roleAdmin, color: "#836182" },
      ],
      sdhCount,
      verifiedUsersCount,
    };

    const recentAuditLogs: RecentAuditItem[] = recAuditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      actorEmail: log.actorEmail,
      actorRole: log.actorRole,
      date: formatDateFr(log.createdAt, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

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
      monthlyTrend,
      applicationStatusBreakdown,
      demographics,
      recentAuditLogs,
    };
  } catch (error) {
    logger.error("dashboard.repository", "Erreur lors du chargement du tableau de bord admin", error);
    const { buckets } = createEmptySixMonthBuckets(now);
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
      monthlyTrend: buckets.map(
        ({ month, membres, candidatures, publications, inscriptions }) => ({
          month,
          membres,
          candidatures,
          publications,
          inscriptions,
        })
      ),
      applicationStatusBreakdown: ORDERED_STATUSES.map((status) => ({
        status,
        label: APPLICATION_STATUSES[status].label,
        count: 0,
        color: STATUS_CHART_COLORS[status],
      })),
      demographics: {
        bySexe: [
          { name: "Hommes", value: 0, color: "#0ea5e9" },
          { name: "Femmes", value: 0, color: "#836182" },
        ],
        byMilieu: [
          { name: "Urbain", value: 0, color: "#10b981" },
          { name: "Rural", value: 0, color: "#f59e0b" },
        ],
        byAgeGroup: [
          { group: "10-17", count: 0 },
          { group: "18-24", count: 0 },
          { group: "25-34", count: 0 },
          { group: "35+", count: 0 },
        ],
        byRole: [
          { role: "USER", label: "Membres", count: 0, color: "#0ea5e9" },
          { role: "AUTHOR", label: "Auteurs", count: 0, color: "#e08637" },
          { role: "ADMIN", label: "Admins", count: 0, color: "#836182" },
        ],
        sdhCount: 0,
        verifiedUsersCount: 0,
      },
      recentAuditLogs: [],
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
