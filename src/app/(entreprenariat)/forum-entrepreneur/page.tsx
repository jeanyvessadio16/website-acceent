import HeaderLayout from "@/components/shared/HeaderLayout";
import { MessagesSquare, Mic } from "lucide-react";

export default function ForumEntrepreneur() {
  const programme = {
    title: "Forum des acteurs locaux",
    description:
      "Rencontres et échanges autour du développement local à Ziguinchor. Un espace unique pour connecter les innovateurs et les décideurs.",
    text: "Événement Annuel",
  };

  const activities = [
    {
      icon: Mic,
      title: "Conférences Inspirantes",
      description:
        "Des leaders locaux partagent leurs visions et expériences sur les enjeux économiques de la région.",
    },
    {
      icon: MessagesSquare,
      title: "Tables Rondes",
      description:
        "Débats interactifs sur les thématiques clés : agriculture, numérique, énergie durable et emploi des jeunes.",
    },
  ];

  return (
    <>
      <HeaderLayout {...programme}>
        <section className="section-padding bg-slate-50/50 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="section-container relative z-10">
            <div className="mb-12 text-center">
              <h2 className="text-fluid-h2 text-primary mb-4">
                Au programme du forum
              </h2>
              <p className="text-fluid-p text-slate-600 max-w-2xl mx-auto">
                Le Forum est conçu pour maximiser les opportunités de
                collaboration et mettre en lumière les solutions locales.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
              {activities.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex gap-5 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-fluid-h3 text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-fluid-p text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-3xl bg-primary/5 p-8 text-center ring-1 ring-primary/10 md:p-12">
              <p className="text-fluid-p-large text-slate-800 font-medium max-w-3xl mx-auto text-balance">
                Ensemble, construisons l&apos;avenir économique de Ziguinchor.
                Rejoignez-nous lors de la prochaine édition pour faire entendre
                votre voix et propulser vos projets.
              </p>
            </div>
          </div>
        </section>
      </HeaderLayout>
    </>
  );
}
