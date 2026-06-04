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
  // If an image prop is provided, we use next/image for optimization
  // Otherwise, we fallback to className for existing pages
  return (
    <>
      <section
        className={`relative w-full min-h-[80svh] flex flex-col items-center justify-center overflow-hidden ${!image ? className || "" : ""}`}
      >
        {image && (
          <div className="absolute inset-0 -z-20">
            <Image
              src={image}
              alt={titre}
              fill
              priority
              className="object-cover object-center lg:object-top"
              sizes="100vw"
              quality={80}
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 -z-10"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center text-white px-6 md:px-10">
          <FadeIn delay={0.1} direction="down">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-slate-100 backdrop-blur-md">
              Découvrir le programme
            </span>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <h1 className="text-fluid-h1 text-white max-w-4xl drop-shadow-lg">
              {titre}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="mt-2 text-fluid-p-large text-slate-200 max-w-2xl drop-shadow-md">
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
