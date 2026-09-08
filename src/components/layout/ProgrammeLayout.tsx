import { FadeIn } from "@/components/shared/Animations";
import Image from "next/image";

export default function ProgrammeLayout({
  className,
  image,
  titre,
  description,
  children,
}: {
  className?: string;
  image?: string;
  titre: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section
        className={`relative w-full min-h-[calc(100svh-5rem)] flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-20 ${!image ? className || "" : ""}`}
      >
        {image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={titre}
              fill
              priority
              className="object-cover object-center opacity-40"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950" />
          </div>
        )}
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center text-white px-6 md:px-10 py-16">
          <FadeIn delay={0.1} direction="down">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-md">
              Découvrir le programme
            </span>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-tight">
              {titre}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="mt-2 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
              {description}
            </p>
          </FadeIn>
        </div>
      </section>
      <section className="section-padding bg-white relative">
        <FadeIn delay={0.4} direction="up" className="section-container">
          {children}
        </FadeIn>
      </section>
    </>
  );
}
