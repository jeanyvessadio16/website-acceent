import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin));
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      select: { id: true },
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin));
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { active: false, unsubscribedAt: new Date() },
    });

    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=success", origin));
  } catch (error) {
    console.error("[Newsletter Unsubscribe Error]:", error);
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin));
  }
}
