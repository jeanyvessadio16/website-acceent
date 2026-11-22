// Service d'envoi d'e-mails transactionnels et newsletter via l'API HTTP Resend (zéro dépendance externe)

export interface EmailSendResult {
  sent: boolean;
  configured: boolean;
  error?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
}

function getEmailFrom(): string {
  return process.env.EMAIL_FROM || "ACCEENT <no-reply@acceent.org>";
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.acceent.org").replace(/\/$/, "");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapEmailLayout(title: string, bodyHtml: string, footerNote?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head><meta charset="utf-8" /></head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(135deg,#836182,#6d4c6c);padding:24px 32px;color:#ffffff;">
                    <div style="font-size:20px;font-weight:900;letter-spacing:0.06em;">ACCEENT</div>
                    <div style="font-size:12px;opacity:0.88;margin-top:4px;">Éducation • Entrepreneuriat • Numérique — Ziguinchor</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <h1 style="margin:0 0 16px 0;font-size:20px;color:#0f172a;">${escapeHtml(title)}</h1>
                    ${bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 32px;background:#f1f5f9;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;">
                    <p style="margin:0;">Association ACCEENT — Quartier Santhiaba, Ziguinchor, Sénégal</p>
                    ${footerNote ? `<p style="margin:8px 0 0 0;">${footerNote}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info(`[EmailService] RESEND_API_KEY non configurée — envoi ignoré vers ${params.to} (${params.subject})`);
    return { sent: false, configured: false };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getEmailFrom(),
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      console.error(`[EmailService] Erreur Resend (${response.status}):`, errBody);
      return { sent: false, configured: true, error: `HTTP ${response.status}` };
    }

    return { sent: true, configured: true };
  } catch (error) {
    console.error("[EmailService] Échec réseau Resend:", error);
    return {
      sent: false,
      configured: true,
      error: error instanceof Error ? error.message : "Erreur réseau",
    };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  firstname: string,
  resetUrl: string
): Promise<EmailSendResult> {
  if (!isEmailConfigured() && process.env.NODE_ENV !== "production") {
    console.info(`[EmailService DEV] Lien de réinitialisation pour ${to} : ${resetUrl}`);
  }

  const body = `
    <p style="font-size:15px;line-height:1.6;color:#334155;">Bonjour ${escapeHtml(firstname)},</p>
    <p style="font-size:15px;line-height:1.6;color:#334155;">
      Vous avez demandé la réinitialisation du mot de passe de votre compte ACCEENT.
      Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe (valable 60 minutes) :
    </p>
    <p style="margin:24px 0;">
      <a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:12px 24px;background:#836182;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;">
        Réinitialiser mon mot de passe
      </a>
    </p>
    <p style="font-size:13px;line-height:1.5;color:#64748b;">
      Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
    </p>
  `;

  return sendEmail({
    to,
    subject: "Réinitialisation de votre mot de passe — ACCEENT",
    html: wrapEmailLayout("Réinitialisation du mot de passe", body),
    text: `Bonjour ${firstname},\n\nRéinitialisez votre mot de passe ici (valable 60 min) : ${resetUrl}\n`,
  });
}

export async function sendEmailVerificationEmail(
  to: string,
  firstname: string,
  verifyUrl: string
): Promise<EmailSendResult> {
  if (!isEmailConfigured() && process.env.NODE_ENV !== "production") {
    console.info(`[EmailService DEV] Lien de confirmation d'e-mail pour ${to} : ${verifyUrl}`);
  }

  const body = `
    <p style="font-size:15px;line-height:1.6;color:#334155;">Bonjour ${escapeHtml(firstname)},</p>
    <p style="font-size:15px;line-height:1.6;color:#334155;">
      Merci pour votre inscription sur la plateforme ACCEENT !
      Pour activer votre compte et pouvoir vous connecter, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous (lien valable 24 heures) :
    </p>
    <p style="margin:24px 0;">
      <a href="${escapeHtml(verifyUrl)}" style="display:inline-block;padding:12px 24px;background:#836182;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;">
        Confirmer mon adresse e-mail
      </a>
    </p>
    <p style="font-size:13px;line-height:1.5;color:#64748b;">
      Une fois confirmé, vous serez automatiquement redirigé·e vers la page de connexion.
    </p>
  `;

  return sendEmail({
    to,
    subject: "Confirmez votre adresse e-mail — ACCEENT",
    html: wrapEmailLayout("Confirmation de votre inscription", body),
    text: `Bonjour ${firstname},\n\nConfirmez votre adresse e-mail pour activer votre compte ACCEENT (valable 24 h) :\n${verifyUrl}\n`,
  });
}

export async function sendApplicationStatusEmail(params: {
  to: string;
  firstname: string;
  programName: string;
  statusLabel: string;
  adminNotes?: string | null;
}): Promise<EmailSendResult> {
  const dashboardUrl = `${getSiteUrl()}/dashboard/candidatures`;
  const notesBlock = params.adminNotes
    ? `<div style="margin:16px 0;padding:14px 16px;background:#f8fafc;border-left:4px solid #836182;border-radius:8px;font-size:14px;color:#334155;"><strong>Note de l'équipe :</strong><br/>${escapeHtml(params.adminNotes).replace(/\n/g, "<br/>")}</div>`
    : "";

  const body = `
    <p style="font-size:15px;line-height:1.6;color:#334155;">Bonjour ${escapeHtml(params.firstname)},</p>
    <p style="font-size:15px;line-height:1.6;color:#334155;">
      Le statut de votre candidature au programme <strong>${escapeHtml(params.programName)}</strong> a été mis à jour :
    </p>
    <p style="margin:16px 0;">
      <span style="display:inline-block;padding:8px 16px;background:#836182;color:#ffffff;border-radius:999px;font-weight:700;font-size:13px;">
        ${escapeHtml(params.statusLabel)}
      </span>
    </p>
    ${notesBlock}
    <p style="margin:24px 0 0 0;">
      <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">
        Consulter mon dossier
      </a>
    </p>
  `;

  return sendEmail({
    to: params.to,
    subject: `Mise à jour de votre candidature (${params.programName}) — ACCEENT`,
    html: wrapEmailLayout("Suivi de votre candidature", body),
  });
}

export async function sendEventRegistrationEmail(params: {
  to: string;
  firstname: string;
  eventTitle: string;
  startDateFormatted: string;
  location: string;
  ticketCode: string;
}): Promise<EmailSendResult> {
  const body = `
    <p style="font-size:15px;line-height:1.6;color:#334155;">Bonjour ${escapeHtml(params.firstname)},</p>
    <p style="font-size:15px;line-height:1.6;color:#334155;">
      Votre inscription à l'événement <strong>${escapeHtml(params.eventTitle)}</strong> est confirmée !
    </p>
    <div style="margin:20px 0;padding:18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
      <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Votre code billet</div>
      <div style="font-size:22px;font-weight:900;color:#836182;margin:4px 0 12px 0;font-family:monospace;">${escapeHtml(params.ticketCode)}</div>
      <div style="font-size:14px;color:#334155;"><strong>Date :</strong> ${escapeHtml(params.startDateFormatted)}</div>
      <div style="font-size:14px;color:#334155;margin-top:4px;"><strong>Lieu :</strong> ${escapeHtml(params.location)}</div>
    </div>
    <p style="font-size:13px;color:#64748b;">
      Retrouvez vos billets à tout moment depuis votre <a href="${escapeHtml(getSiteUrl())}/dashboard/evenements" style="color:#836182;">Espace Membre ACCEENT</a>.
    </p>
  `;

  return sendEmail({
    to: params.to,
    subject: `Confirmation d'inscription : ${params.eventTitle} (${params.ticketCode})`,
    html: wrapEmailLayout("Billet confirmé", body),
  });
}

export interface CampaignRecipient {
  email: string;
  name?: string | null;
  unsubscribeToken?: string | null;
}

export async function sendNewsletterCampaignEmails(params: {
  subject: string;
  previewText?: string | null;
  content: string;
  recipients: CampaignRecipient[];
}): Promise<{ configured: boolean; sentCount: number; failedCount: number }> {
  if (!isEmailConfigured()) {
    return { configured: false, sentCount: 0, failedCount: 0 };
  }

  let sentCount = 0;
  let failedCount = 0;
  const siteUrl = getSiteUrl();

  for (const recipient of params.recipients) {
    const greeting = recipient.name ? `Bonjour ${escapeHtml(recipient.name)},` : "Bonjour,";
    const unsubscribeFooter = recipient.unsubscribeToken
      ? `Vous recevez cet e-mail car vous êtes abonné·e aux actualités d'ACCEENT. <a href="${escapeHtml(
          `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(recipient.unsubscribeToken)}`
        )}" style="color:#836182;">Se désinscrire</a>.`
      : `Vous recevez cet e-mail en tant que membre de la communauté ACCEENT. Gérez vos préférences depuis votre <a href="${escapeHtml(
          `${siteUrl}/dashboard/profil`
        )}" style="color:#836182;">profil</a>.`;

    const paragraphs = escapeHtml(params.content)
      .split(/\n{2,}/)
      .map((p) => `<p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 14px 0;">${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    const body = `
      ${params.previewText ? `<p style="font-size:13px;color:#836182;font-weight:600;margin:0 0 16px 0;">${escapeHtml(params.previewText)}</p>` : ""}
      <p style="font-size:15px;line-height:1.6;color:#0f172a;font-weight:600;">${greeting}</p>
      ${paragraphs}
      <p style="margin:24px 0 0 0;">
        <a href="${escapeHtml(`${siteUrl}/actualites`)}" style="display:inline-block;padding:12px 24px;background:#836182;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;">
          Découvrir le site ACCEENT
        </a>
      </p>
    `;

    const res = await sendEmail({
      to: recipient.email,
      subject: params.subject,
      html: wrapEmailLayout(params.subject, body, unsubscribeFooter),
      text: params.content,
    });

    if (res.sent) {
      sentCount += 1;
    } else {
      failedCount += 1;
    }
  }

  return { configured: true, sentCount, failedCount };
}
