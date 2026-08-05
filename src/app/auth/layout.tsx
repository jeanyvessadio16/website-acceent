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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#12080f] px-6 py-12 overflow-hidden">
      {/* Orbes de fond */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#836182]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#b9939e]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] bg-[#836182]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <Link href="/" aria-label="Retour à l'accueil ACCEENT">
          <Image
            src="/logo/logo-acceent.png"
            alt="Logo ACCEENT"
            width={130}
            height={40}
            priority
            className="h-10 w-auto brightness-0 invert"
          />
        </Link>
      </div>

      {/* Carte du formulaire */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
          {children}
        </div>

        {/* Mentions légales */}
        <p className="mt-6 text-center text-xs text-white/30">
          En continuant, vous acceptez nos{" "}
          <Link
            href="/mentions-legales"
            className="underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            Mentions légales
          </Link>{" "}
          et notre{" "}
          <Link
            href="/confidentialite"
            className="underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            Politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
