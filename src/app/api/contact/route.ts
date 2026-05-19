import { NextResponse } from "next/server";
import { contactSchema } from "@/zodSchema/contact";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function getAccessKey(): string | undefined {
  return (
    process.env.WEB3FORMS_ACCESS_KEY ??
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
  );
}

export async function POST(request: Request) {
  const accessKey = getAccessKey();

  if (!accessKey) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Le formulaire n'est pas configuré. Contactez l'administrateur du site.",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Données du formulaire invalides." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Données invalides.";
    return NextResponse.json(
      { success: false, message: firstError },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: data.nomComplet,
        email: data.email,
        phone: data.telephone,
        message: data.message,
        subject: `Contact site ACCEENT - ${data.nomComplet}`,
        from_name: "ACCEENT - Site web",
        replyto: data.email,
        botcheck: data.botcheck ?? false,
      }),
    });

    const result = (await response.json()) as {
      success: boolean;
      message?: string;
    };

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.message ||
            "L'envoi du message a échoué. Veuillez réessayer plus tard.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur Web3Forms :", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible d'envoyer le message pour le moment. Veuillez réessayer.",
      },
      { status: 502 },
    );
  }
}
