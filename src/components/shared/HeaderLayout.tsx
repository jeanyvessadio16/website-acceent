export default function HeaderLayout({
  text,
  title,
  description,
  highlights = [],
  children,
}: {
  text?: string;
  title: string;
  description: string;
  highlights?: Array<{ label: string; value: string }>;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[linear-gradient(120deg,rgba(131,97,130,0.14),rgba(185,147,158,0.1),rgba(255,255,255,1))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(131,97,130,0.23),transparent_45%)]" />
        <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
        <div className="section-container relative flex min-h-[calc(100svh-5rem)] flex-col justify-center py-12 md:py-16">
          {text ? (
            <span className="mb-4 inline-block w-fit rounded-full border border-primary/20 bg-primary/90 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-sm">
              {text}
            </span>
          ) : null}
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
            {description}
          </p>
          {highlights.length > 0 ? (
            <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      {children}
    </>
  );
}
