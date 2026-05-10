export default function HeaderLayout({
  text,
  title,
  description,
  children,
}: {
  text?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="min-h-screen flex flex-col justify-center">
        <div className="px-12 space-y-6 lg:max-w-4xl">
          <span className="text-white font-semibold px-5 py-2 bg-primary my-3 rounded-full inline-block">
            {text}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {title}
          </h1>
          <p className="text-lg">{description}</p>
        </div>
      </section>
      {children}
    </>
  );
}
