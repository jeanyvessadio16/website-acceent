export default function ProgrammeLayout({
  className,
  titre,
  description,
  children,
}: {
  className?: string;
  titre: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section
        className={`relative w-full min-h-[80svh] flex flex-col items-center justify-center overflow-hidden ${className || ""}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center text-white px-6 md:px-10">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-slate-100 backdrop-blur-md">
            Découvrir le programme
          </span>
          <h1 className="text-fluid-h1 text-white max-w-4xl drop-shadow-lg">
            {titre}
          </h1>
          <p className="mt-2 text-fluid-p-large text-slate-200 max-w-2xl drop-shadow-md">
            {description}
          </p>
        </div>
      </section>
      <section className="section-padding bg-white relative">
        <div className="section-container">
          {children}
        </div>
      </section>
    </>
  );
}
