/** Clés d’icônes Lucide utilisées sur la page ACCEENT4ELLES */
export type AcceentEllesItemIcon =
  | "bookOpen"
  | "heart"
  | "laptop"
  | "briefcase"
  | "messages"
  | "userRound"
  | "graduationCap"
  | "handshake"
  | "clipboardList";

export const acceentEllesData = [
  {
    id: 1,

    libelle:
      "Renforcement scolaire à travers des séances régulières adaptées au niveau de chaque participante ;",
  },
  {
    id: 2,
    libelle:
      "Développement personnel pour favoriser l'estime de soi et encourager des choix de vie positifs ;",
  },
  {
    id: 3,
    libelle:
      "Initiation à l'informatique et au numérique, afin de réduire la fracture digitale et leur ouvrir de nouvelles perspectives ;",
  },
  {
    id: 4,
    libelle:
      "Découverte de métiers pour élargir leur horizon et susciter des vocations ;",
  },
  {
    id: 5,
    libelle:
      "Et un espace de dialogue et d'écoute pour échanger, se soutenir et grandir ensemble.",
  },
];

export const acceentEllesApproche = [
  {
    id: 1,
    icon: "userRound" as const,
    libelle: "Accompagnement personnalisé",
    detail:
      "Un suivi adapté au profil et aux objectifs de chaque participante, pour avancer étape par étape.",
  },
  {
    id: 2,
    icon: "graduationCap" as const,
    libelle: "Formation continue",
    detail:
      "Des apprentissages qui se poursuivent dans la durée, pour consolider les compétences et la confiance.",
  },
  {
    id: 3,
    icon: "handshake" as const,
    libelle: "Mentorat",
    detail:
      "Rencontres et échanges avec des personnes ressources pour inspirer, guider et ouvrir le champ des possibles.",
  },
  {
    id: 4,
    icon: "clipboardList" as const,
    libelle: "Suivi post-formation",
    detail:
      "Un appui après les temps forts du programme pour sécuriser la transition et l’autonomie.",
  },
];

export const acceent4ellesComposants = [
  {
    id: 1,
    libelle: "Accompagnement des jeunes filles",
    taches: [
      "Soutien scolaire",
      "Développement personnel",
      "Ateliers créatifs",
      "Acculturation digitale",
      "Jeux educatifs",
    ]
  },
  {
    id: 2,
    libelle: "Soutien aux jeunes filles",
    taches: [
      "Orientation professionnelle",
      "Développement de l'employabilité",
      "Formation entrepreneuriale",
      "Intégration digitale",
      "Developpement des soft skills",
      "Decouverte de metiers"
    ]
  },
  {
    id: 3,
    libelle: "Renforcement des capacités",
    taches: [
      "Leadership féminin",
      "Santé et bien-être",
      "Développement communautaire",
      "Plaidoyer"
    ]
  },

];

export const temoignages = [
  {
    id: 1,
    image: "/images/acceentImage.jpg",
    name: "Aissatou",
    quote: "Les ateliers m'ont permis de découvrir de nouveaux talents et de m'ouvrir à d'autres horizons.",
  },
  {
    id: 2,
    image: "/images/acceentImage.jpg",
    name: "Mariama",
    quote: "Grâce à ACCEENT4ELLES, j'ai pu reprendre confiance en moi et trouver un emploi stable.",
  },
];

export const questions = [
  {
    id: 1,
    question: "Comment participer ?",
    reponse: "Pour participer au programme, vous devez être une jeune fille âgée de 15 à 25 ans, résidant à Ziguinchor. Les inscriptions se font en ligne ou dans nos locaux.",
  },
  {
    id: 2,
    question: "Comment nous soutenir ?",
    reponse: "Vous pouvez nous soutenir en faisant un don, en devenant mentor, en partageant nos actions ou en proposant des opportunités de stage.",
  },
  {
    id: 3,
    question: "Quelles sont les formations proposées ?",
    reponse: "Nous proposons des formations en entrepreneuriat, en développement personnel, en compétences numériques et en leadership.",
  },
  {
    id: 4,
    question: "Quels sont les résultats ?",
    reponse: "Nos bénéficiaires ont un taux d'insertion professionnelle de 85% et développent des compétences essentielles pour leur avenir.",
  },
];