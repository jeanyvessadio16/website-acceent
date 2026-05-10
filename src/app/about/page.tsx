import HeaderLayout from "@/components/shared/HeaderLayout";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function About() {
  const title = "Une association engagée pour transformer les territoires";
  const description =
    "Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires. Une association engagée pour transformer les territoires par l'éducation, l'entrepreneuriat et le numérique.";

  const stats = [
    { number: "15+", label: "Partenaires engagés" },
    { number: "1000+", label: "Bénéficiaires" },
    { number: "17", label: "Années d'expérience" },
  ];

  return (
    <>
      <HeaderLayout
        text="A propos de ACCEENT"
        title={title}
        description={description}
      >
        {/* Image + Details Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/20 to-slate-950/5 rounded-2xl" />
                <Image
                  src="/images/aboutImage.jpg"
                  alt="ACCEENT Team"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl shadow-slate-900/20 w-full h-auto object-cover"
                />
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-3">
                    Qui sommes-nous
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    ACCEENT est une association basée à Ziguinchor, au Sénégal,
                    dont la mission est de transformer les territoires par
                    l&apos;éducation, l&apos;entrepreneuriat et le numérique.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-3">
                    Nos domaines d&apos;action
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Éducation et formation",
                      "Entrepreneuriat et emploi",
                      "Transformation numérique",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-slate-950 font-bold">✓</span>
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="relative py-20 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Mission Card */}
              <Card className="border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition duration-300 overflow-hidden group">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-950/10 flex items-center justify-center mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-950 mb-2">
                      Notre mission
                    </h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed flex-1">
                    Mettre en mouvement les énergies locales pour que chaque
                    territoire dispose des moyens d&apos;apprendre,
                    d&apos;entreprendre et d&apos;innover. Nous concevons et
                    déployons des programmes concrets, ancrés dans le réel et
                    co-construits avec les acteurs de terrain.
                  </p>
                </div>
              </Card>

              {/* Vision Card */}
              <Card className="border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition duration-300 overflow-hidden group">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-950/10 flex items-center justify-center mb-4">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-950 mb-2">
                      Notre vision
                    </h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed flex-1">
                    Des territoires vivants, équitables et créatifs où chacun
                    peut trouver sa place et révéler son potentiel grâce à
                    l&apos;éducation, à l&apos;entrepreneuriat et au numérique.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Notre impact
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Des chiffres qui reflètent notre engagement auprès des
                territoires
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 transition"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <p className="text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-12 bg-gradient-to-r from-slate-950 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez notre mission
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Ensemble, transformons les territoires par l&apos;éducation,
              l&apos;entrepreneuriat et le numérique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-3 bg-white text-slate-950 font-semibold rounded-full hover:bg-slate-100 transition inline-block"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </HeaderLayout>
    </>
  );
}
