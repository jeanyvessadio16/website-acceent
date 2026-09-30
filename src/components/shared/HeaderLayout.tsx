import Image from "next/image";
import { cn } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export default function HeaderLayout({
  className,
  text,
  title,
  description,
  bgImage,
  highlights = [],
  children,
}: {
  className?: string;
  text?: string;
  title: string;
  description: string;
  bgImage?: string;
  highlights?: Array<{ label: string; value: string }>;
  children: React.ReactNode;
}) {
  return (
    <>
      <section
        className={cn(
          "relative w-full h-[calc(100dvh-5rem)] flex flex-col justify-center items-start overflow-hidden bg-slate-900 text-white",
          className,
        )}
      >
        {bgImage ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
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
              {title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="max-w-2xl text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </FadeIn>
          {highlights.length > 0 ? (
            <StaggerContainer delay={0.4} className="grid w-full max-w-3xl grid-cols-1 gap-2.5 sm:gap-4 sm:grid-cols-3 pt-1 sm:pt-2">
              {highlights.map((item) => (
                <StaggerItem key={item.label}>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-3 sm:p-4 shadow-xs backdrop-blur-md h-full">
                    <p className="text-lg sm:text-xl font-bold text-white">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-200 font-medium">{item.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : null}
        </div>
      </section>
      {children}
    </>
  );
}
