"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundContent() {
  const router = useRouter();

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[80px] rounded-full -z-10 pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="text-center max-w-2xl mx-auto flex flex-col items-center z-10 w-full relative">
        <div className="relative mb-6 group">
          <p
            className="text-[140px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-secondary/60 tracking-tighter leading-none select-none drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
            aria-hidden="true"
          >
            404
          </p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-3xl rounded-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        <div className="space-y-4 mb-10">
          <h1 className="text-fluid-h3 text-foreground">
            Oups ! Page introuvable
          </h1>
          <p className="text-fluid-p text-muted-foreground max-w-lg mx-auto">
            La page que vous recherchez semble avoir pris des vacances, a été
            déplacée ou n&apos;a peut-être jamais existé.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground border-2 border-border font-semibold rounded-full hover:bg-muted hover:border-muted-foreground/30 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>Page précédente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
