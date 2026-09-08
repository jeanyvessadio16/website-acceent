export interface ActionTerrain {
  id: string | number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export const list_actions: ActionTerrain[] = [
  {
    id: 1,
    src: "/images/batik.jpeg",
    alt: "Formation batik et teinture",
    title: "Batik et Teinture",
    description:
      "Initiation aux techniques artisanales de création textile et valorisation des savoir-faire.",
  },
  {
    id: 2,
    src: "/images/femmes.jpeg",
    alt: "Renforcement de capacité des femmes",
    title: "Renforcement de Capacité",
    description:
      "Accompagnement structuré des femmes vers l'autonomie et la gestion d'activités.",
  },
  {
    id: 3,
    src: "/images/designthinkig.jpeg",
    alt: "Formation en design thinking",
    title: "Design Thinking",
    description:
      "Ateliers pratiques d'innovation et de résolution créative de problèmes du territoire.",
  },
  {
    id: 4,
    src: "/images/leadership.jpeg",
    alt: "Formation leadership",
    title: "Leadership & Gestion",
    description:
      "Développement des compétences d'organisation, de prise d'initiative et de projet.",
  },
  {
    id: 5,
    src: "/images/sensibilisation.jpeg",
    alt: "Sensibilisation citoyenne",
    title: "Sensibilisation Citoyenne",
    description:
      "Actions d'information et d'échanges de proximité auprès des communautés.",
  },
  {
    id: 6,
    src: "/images/formation-outil-digital.jpeg",
    alt: "Outils digitaux",
    title: "Compétences Digitales",
    description:
      "Formations pratiques aux outils numériques essentiels de communication et gestion.",
  },
];
