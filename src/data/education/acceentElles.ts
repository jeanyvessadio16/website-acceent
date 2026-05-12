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
    icon: "bookOpen" as const,
    libelle: "Renforcement scolaire",
    detail:
      "Renforcement scolaire à travers des séances régulières adaptées au niveau de chaque participante.",
  },
  {
    id: 2,
    icon: "heart" as const,
    libelle: "Développement personnel",
    detail:
      "Développement personnel pour favoriser l'estime de soi et encourager des choix de vie positifs.",
  },
  {
    id: 3,
    icon: "laptop" as const,
    libelle: "Initiation informatique & numérique",
    detail:
      "Initiation à l'informatique et au numérique, afin de réduire la fracture digitale et leur ouvrir de nouvelles perspectives.",
  },
  {
    id: 4,
    icon: "briefcase" as const,
    libelle: "Découverte de métiers",
    detail:
      "Découverte de métiers pour élargir leur horizon et susciter des vocations.",
  },
  {
    id: 5,
    icon: "messages" as const,
    libelle: "Dialogue & écoute",
    detail:
      "Un espace de dialogue et d'écoute pour échanger, se soutenir et grandir ensemble.",
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
