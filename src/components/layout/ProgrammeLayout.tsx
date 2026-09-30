import { FadeIn } from "@/components/shared/Animations";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProgrammeLayout({
  className,
  image,
  text = "Découvrir le programme",
  titre,
  description,
  children,
}: {
  className?: string;
  image?: string;
  text?: string;
  titre: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Section 1 — Hero */}
      <section
        className={cn(
          "relative w-full h-[calc(100dvh-5rem)] flex flex-col justify-center items-start overflow-hidden bg-slate-900 text-white",
          className,
        )}
      >
        {image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={titre}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />

        <div className="relative section-container py-4 sm:py-10 z-10 flex flex-col items-start justify-center text-left text-white space-y-3 sm:space-y-6">
          {text ? (
            <FadeIn delay={0.1} direction="down">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-200">
                {text}
              </span>
            </FadeIn>
          ) : null}
          <FadeIn delay={0.2} direction="up">
            <h1 className="max-w-4xl text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {titre}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="max-w-2xl text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Section 2 — Main Content Body */}
      <section className="relative bg-slate-50 py-16 md:py-24 border-t border-slate-200/60 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(131,97,130,0.06),transparent_50%)]" />
        
        <div className="section-container relative z-10 space-y-12 md:space-y-16">
          {children}
        </div>
      </section>
    </>
  );
}
