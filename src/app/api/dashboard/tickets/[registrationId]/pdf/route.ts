import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDateFr } from "@/lib/core";
import { renderMemberTicketPdf } from "@/lib/export/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ registrationId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const { registrationId } = await context.params;

  const reg = await prisma.eventRegistration.findUnique({
    where: { id: registrationId },
    include: {
      event: true,
      user: { select: { firstname: true, lastname: true, email: true } },
    },
  });

  if (!reg || (reg.userId !== session.userId && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Billet introuvable" }, { status: 404 });
  }

  const bytes = await renderMemberTicketPdf({
    ticketCode: reg.ticketCode,
    holderName: `${reg.user.firstname} ${reg.user.lastname}`.trim(),
    holderEmail: reg.user.email,
    eventTitle: reg.event.title,
    eventDateFormatted: formatDateFr(reg.event.startDate, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    eventLocation: reg.event.location,
    isOnline: reg.event.isOnline,
    meetingUrl: reg.event.meetingUrl,
    registeredAtFormatted: formatDateFr(reg.createdAt, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  });

  const safeCode = reg.ticketCode.replace(/[^a-z0-9-_]/gi, "");
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="billet-acceent-${safeCode}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
