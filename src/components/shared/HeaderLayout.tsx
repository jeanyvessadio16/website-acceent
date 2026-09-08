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
          "relative min-h-[calc(100dvh-5rem)] flex flex-col justify-center overflow-hidden bg-slate-950 text-white pt-20",
          className,
        )}
      >
        {bgImage ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(131,97,130,0.25),transparent_60%)]" />
        )}

        <div className="section-container relative z-10 flex min-h-[calc(100dvh-5rem)] flex-col justify-center py-10 md:py-24">
          {text ? (
            <FadeIn delay={0.1} direction="down">
              <span className="mb-3 sm:mb-4 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-md">
                {text}
              </span>
            </FadeIn>
          ) : null}
          <FadeIn delay={0.2} direction="up">
            <h1 className="max-w-4xl text-2xl sm:text-5xl lg:text-6xl font-bold text-white mt-1 sm:mt-2 mb-3 sm:mb-4 leading-tight">
              {title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="max-w-3xl text-sm sm:text-lg md:text-xl text-slate-200 leading-relaxed">
              {description}
            </p>
          </FadeIn>
          {highlights.length > 0 ? (
            <StaggerContainer delay={0.4} className="mt-6 sm:mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <StaggerItem key={item.label}>
                  <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 sm:p-5 shadow-md backdrop-blur-md h-full">
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-300 font-medium">{item.label}</p>
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
