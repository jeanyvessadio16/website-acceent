import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { checkDistributedRateLimit, recordAuditLog } from "@/lib/core";
import { escapeCsvCell } from "@/lib/constants/platform";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

  const { id } = await context.params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true,
              email: true,
              telephone: true,
              age: true,
              sexe: true,
            },
          },
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

  const headers = [
    "Code Billet",
    "Prénom",
    "Nom",
    "Email",
    "Téléphone",
    "Âge",
    "Sexe",
    "Présent",
    "Inscrit le",
  ].map(escapeCsvCell);

  const rows = event.registrations.map((reg) =>
    [
      reg.ticketCode,
      reg.user.firstname,
      reg.user.lastname,
      reg.user.email,
      reg.phone?.trim() || reg.user.telephone || "",
      reg.user.age,
      reg.user.sexe === "HOMME" ? "Homme" : "Femme",
      reg.attended ? "Oui" : "Non",
      reg.createdAt.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ]
      .map(escapeCsvCell)
      .join(";")
  );

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
  const safeSlug = (event.slug || "evenement").replace(/[^a-z0-9-_]/gi, "-");

  await recordAuditLog({
    session,
    action: "EXPORT_CSV",
    entity: "event",
    entityId: event.id,
    metadata: { title: event.title, rows: event.registrations.length },
  });

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="emargement-${safeSlug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
