import { cn } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export default function HeaderLayout({
  className,
  text,
  title,
  description,
  highlights = [],
  children,
}: {
  className?: string;
  text?: string;
  title: string;
  description: string;
  highlights?: Array<{ label: string; value: string }>;
  children: React.ReactNode;
}) {
  return (
    <>
      <section
        className={cn(
          "relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[linear-gradient(120deg,rgba(131,97,130,0.14),rgba(185,147,158,0.1),rgba(255,255,255,1))]",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(131,97,130,0.23),transparent_45%)]" />
        <div className="section-container relative flex min-h-[calc(100svh-5rem)] flex-col justify-center py-12 md:py-16">
          {text ? (
            <FadeIn delay={0.1} direction="down">
              <span className="mb-4 inline-block w-fit rounded-full border border-primary/20 bg-primary/90 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-sm">
                {text}
              </span>
            </FadeIn>
          ) : null}
          <FadeIn delay={0.2} direction="up">
            <h1 className="max-w-4xl text-fluid-h1 text-slate-950 mt-4 mb-4">
              {title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="max-w-3xl text-fluid-p-large text-slate-700">
              {description}
            </p>
          </FadeIn>
          {highlights.length > 0 ? (
            <StaggerContainer delay={0.4} className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <StaggerItem key={item.label}>
                  <div
                    className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur h-full"
                  >
                    <p className="text-2xl font-bold text-slate-950">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{item.label}</p>
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
