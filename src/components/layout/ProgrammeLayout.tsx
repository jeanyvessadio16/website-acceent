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
          "relative w-full min-h-[calc(100dvh-5rem)] flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-20 text-white",
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
              className="object-cover object-center opacity-35"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950" />
          </div>
        )}

        <div className="section-container relative z-10 flex min-h-[calc(100dvh-5rem)] flex-col justify-center items-center gap-4 text-center px-4 sm:px-6 md:px-10 py-12 md:py-20">
          {text ? (
            <FadeIn delay={0.1} direction="down">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-md">
                {text}
              </span>
            </FadeIn>
          ) : null}
          <FadeIn delay={0.2} direction="up">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white max-w-4xl leading-tight">
              {titre}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="mt-1 sm:mt-2 text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
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
