import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";
import { isOptimizableImageUrl } from "@/lib/constants/platform";

export interface PublicTestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  program: string | null;
  quote: string;
  avatarUrl: string | null;
  rating: number;
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: PublicTestimonialItem[];
}) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-16 md:py-24 bg-white border-t border-slate-200/60"
    >
      <div className="section-container space-y-12">
        <FadeIn delay={0.1} direction="up" className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Témoignages
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight"
          >
            Ils témoignent de l&apos;impact ACCEENT
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Paroles de jeunes entrepreneurs, étudiantes et membres accompagnés dans nos programmes à Ziguinchor.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          delay={0.15}
        >
          {testimonials.map((t) => {
            const initials = t.authorName
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const canOptimize = t.avatarUrl ? isOptimizableImageUrl(t.avatarUrl) : false;

            return (
              <StaggerItem key={t.id}>
                <article className="h-full flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: Math.min(5, Math.max(1, t.rating)) }).map(
                          (_, idx) => (
                            <Star key={idx} className="size-4 fill-amber-400" />
                          )
                        )}
                      </div>
                      <Quote className="size-5 text-primary/30" aria-hidden />
                    </div>

                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                      &laquo;&nbsp;{t.quote}&nbsp;&raquo;
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-200/70 flex items-center gap-3">
                    {t.avatarUrl ? (
                      canOptimize ? (
                        <Image
                          src={t.avatarUrl}
                          alt={t.authorName}
                          width={40}
                          height={40}
                          className="size-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={t.avatarUrl}
                          alt={t.authorName}
                          loading="lazy"
                          decoding="async"
                          className="size-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      )
                    ) : (
                      <div className="size-10 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {t.authorName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{t.authorRole}</p>
                      {t.program && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {t.program}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
