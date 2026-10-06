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
    title: "Leadership",
    description:
      "Développement des compétences des jeunes pour devenir des leaders de demain, capables de prendre des initiatives et de gérer des projets.",
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
  {
    id: 7,
    src: "/images/gestionAdministrativeFinanciere.jpeg",
    alt: "Gestion administrative et financière",
    title: "Gestion Administrative & Financière",
    description:
      "Formations et accompagnement en organisation administrative, gestion budgétaire et suivi financier.",
  },
  {
    id: 8,
    src: "/images/preincubation.jpeg",
    alt: "Programme de préincubation",
    title: "Préincubation",
    description:
      "Accompagnement à la structuration d'idées, modélisation de projets et formalisation des initiatives.",
  },
];
