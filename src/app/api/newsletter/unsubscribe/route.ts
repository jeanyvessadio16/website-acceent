import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin));
  }

  const target = new URL("/newsletter/unsubscribe", origin);
  target.searchParams.set("token", token);
  return NextResponse.redirect(target);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  let token = url.searchParams.get("token")?.trim() || "";

  if (!token) {
    try {
      const formData = await request.formData();
      const rawToken = formData.get("token");
      if (typeof rawToken === "string") {
        token = rawToken.trim();
      }
    } catch {
      // Corps absent ou invalide (ex. RFC 8058 One-Click sans FormData)
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin), {
      status: 303,
    });
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      select: { id: true },
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin), {
        status: 303,
      });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { active: false, unsubscribedAt: new Date() },
    });

    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=success", origin), {
      status: 303,
    });
  } catch (error) {
    console.error("[Newsletter Unsubscribe Error]:", error);
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?status=invalid", origin), {
      status: 303,
    });
  }
}
