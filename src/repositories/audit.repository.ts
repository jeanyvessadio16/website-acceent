import prisma from "@/lib/prisma";
import { formatDateFr } from "@/lib/core";

export interface AuditLogDTO {
  id: string;
  actorEmail: string | null;
  actorRole: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  ipAddress: string | null;
  metadataText: string | null;
  createdAt: string;
}

export async function findRecentAuditLogs(limit = 100): Promise<AuditLogDTO[]> {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      actorEmail: true,
      actorRole: true,
      action: true,
      entity: true,
      entityId: true,
      ipAddress: true,
      metadata: true,
      createdAt: true,
    },
  });

  return rows.map((r) => ({
    id: r.id,
    actorEmail: r.actorEmail,
    actorRole: r.actorRole,
    action: r.action,
    entity: r.entity,
    entityId: r.entityId,
    ipAddress: r.ipAddress,
    metadataText: r.metadata ? JSON.stringify(r.metadata) : null,
    createdAt: formatDateFr(r.createdAt, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
}
