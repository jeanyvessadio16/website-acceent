import Link from "next/link";
import { CheckCircle2, AlertCircle, Mail, ArrowLeft, MailX } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "Désinscription Newsletter",
  description: "Gestion de votre abonnement à la newsletter ACCEENT.",
  path: "/newsletter/unsubscribe",
  noIndex: true,
});

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; token?: string }>;
}) {
  const { status, token } = await searchParams;
  const trimmedToken = token?.trim() || "";
  const isSuccess = status === "success";
  const isConfirmStep = Boolean(trimmedToken) && !isSuccess && status !== "invalid";

  return (
    <main className="min-h-[70vh] bg-slate-50/70 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm space-y-5">
        <div
          className={`size-14 rounded-2xl mx-auto flex items-center justify-center ${
            isSuccess
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : isConfirmStep
              ? "bg-[#836182]/10 text-[#836182] border border-[#836182]/25"
              : "bg-amber-50 text-amber-600 border border-amber-200"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="size-7" />
          ) : isConfirmStep ? (
            <MailX className="size-7" />
          ) : (
            <AlertCircle className="size-7" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {isSuccess
              ? "Désinscription confirmée"
              : isConfirmStep
              ? "Confirmer votre désinscription"
              : "Lien de désinscription invalide"}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isSuccess
              ? "Votre adresse e-mail a bien été retirée de la liste de diffusion d'ACCEENT. Vous pourrez vous réabonner à tout moment depuis notre site."
              : isConfirmStep
              ? "Cliquez sur le bouton ci-dessous pour confirmer le retrait de votre adresse e-mail de la newsletter ACCEENT."
              : "Ce lien est invalide ou a déjà été utilisé. Pour toute question, contactez-nous à info@acceent.org."}
          </p>
        </div>

        {isConfirmStep ? (
          <form method="POST" action="/api/newsletter/unsubscribe" className="space-y-3 pt-2">
            <input type="hidden" name="token" value={trimmedToken} />
            <Button
              type="submit"
              className="w-full rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white cursor-pointer"
            >
              Confirmer ma désinscription
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full border-slate-300">
              <Link href="/">Annuler et retourner à l&apos;accueil</Link>
            </Button>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            <Button asChild className="rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white">
              <Link href="/">
                <ArrowLeft className="size-4 mr-1.5" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-slate-300">
              <Link href="/actualites">
                <Mail className="size-4 mr-1.5" />
                Voir les actualités
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
