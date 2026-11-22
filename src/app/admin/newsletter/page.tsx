import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewsletterManager } from "@/components/admin/NewsletterManager";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isEmailConfigured } from "@/services/emailService";

export const metadata: Metadata = {
  title: "Newsletter",
};

export default async function AdminNewsletterPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const [subscribers, campaigns, recentPosts, optedInMembersCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    }),
    prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: { id: true, title: true, content: true },
    }),
    prisma.user.count({ where: { newsletterOptIn: true } }),
  ]);

  return (
    <NewsletterManager
      subscribers={subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        name: s.name,
        active: s.active,
        subscribedAt: s.subscribedAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      }))}
      campaigns={campaigns.map((c) => ({
        id: c.id,
        subject: c.subject,
        recipientCount: c.recipientCount,
        sentCount: c.sentCount,
        status: c.status,
        createdAt: c.createdAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      }))}
      recentPosts={recentPosts}
      optedInMembersCount={optedInMembersCount}
      emailConfigured={isEmailConfigured()}
    />
  );
}
