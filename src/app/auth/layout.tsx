import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    template: "%s | ACCEENT",
    default: "Authentification | ACCEENT",
  },
  description:
    "Connectez-vous ou créez votre compte pour accéder à l'espace ACCEENT.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-4 sm:px-6 py-3 sm:py-4">
      {/* Carte centrée du formulaire */}
      <div className="w-full max-w-[560px] rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white px-5 py-4 sm:px-7 sm:py-5 shadow-xl shadow-slate-900/5">
        {/* Entête logo ACCEENT à l'intérieur du formulaire */}
        <div className="mb-3.5 flex justify-center pb-3 border-b border-slate-100">
          <Link
            href="/"
            aria-label="Retour à l'accueil ACCEENT"
            className="relative block h-14 sm:h-16 w-56 sm:w-64 overflow-hidden transition-opacity hover:opacity-85"
          >
            <Image
              src="/logo/logoACCEENT.png"
              alt="Logo ACCEENT"
              fill
              sizes="(max-width: 640px) 224px, 256px"
              priority
              className="object-contain object-center scale-125"
            />
          </Link>
        </div>

        {children}
      </div>

      {/* Liens légaux */}
      <p className="mt-3 text-center text-[11px] text-slate-500">
        En continuant, vous acceptez nos{" "}
        <Link
          href="/cgu"
          className="font-medium text-slate-700 underline underline-offset-2 hover:text-[#836182] transition-colors"
        >
          CGU
        </Link>{" "}
        et notre{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-slate-700 underline underline-offset-2 hover:text-[#836182] transition-colors"
        >
          Politique de confidentialité
        </Link>
        .
      </p>
    </main>
  );
}
