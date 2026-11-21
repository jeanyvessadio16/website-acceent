import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { SessionPayload } from "@/lib/session";
import { logger } from "./logger";
import { getClientIp } from "./request";

export interface RecordAuditParams {
  session?: SessionPayload | null;
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
}

/**
 * Enregistre une trace d'audit de manière non bloquante.
 * Ne lève jamais d'exception afin de ne pas interrompre la transaction métier appelante.
 */
export async function recordAuditLog(params: RecordAuditParams): Promise<void> {
  try {
    const ipAddress = await getClientIp();
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId ?? params.session?.userId ?? null,
        actorEmail: params.actorEmail ?? params.session?.email ?? null,
        actorRole: params.actorRole ?? params.session?.role ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        ipAddress,
        metadata: params.metadata,
      },
    });
  } catch (error) {
    logger.warn("audit.record", `Échec d'enregistrement de l'audit ${params.action}`, {
      entity: params.entity,
      entityId: params.entityId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
