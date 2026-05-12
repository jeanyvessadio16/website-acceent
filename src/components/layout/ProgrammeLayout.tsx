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
        className={`w-full relative min-h-screen flex flex-col items-center justify-center p-8 ${className || ""}`}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-center z-10 text-white lg:max-w-3xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            {titre}
          </h1>
          <p className="mt-4 text-lg">{description}</p>
        </div>
      </section>
      <section className="px-12 py-16">{children}</section>
    </>
  );
}
