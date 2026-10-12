export interface GalerieItem {
    id: number;
    src: string;
    alt: string;
    caption?: string;
}

export const acceentIncubGalerie: GalerieItem[] = [
    {
        id: 1,
        src: "/images/acceent-incub/incub-1.jpg",
        alt: "Séance de travail et incubation de projets — ACCEENT'INCUB",
        caption: "Idéation et structuration de projets",
    },
    {
        id: 2,
        src: "/images/acceent-incub/incub-2.jpg",
        alt: "Accompagnement personnalisé et coaching entrepreneurial à Ziguinchor",
        caption: "Mentorat & coaching personnalisé",
    },
    {
        id: 3,
        src: "/images/acceent-incub/incub-3.jpg",
        alt: "Session collaborative et développement de compétences d'entreprise",
        caption: "Atelier collaboratif entre porteurs de projets",
    },
    {
        id: 4,
        src: "/images/acceent-incub/incub-4.jpg",
        alt: "Échanges avec les mentors et évaluation de business model",
        caption: "Modélisation économique et pitch",
    },
    {
        id: 5,
        src: "/images/acceent-incub/incub-5.jpg",
        alt: "Rencontres entrepreneuriales et dynamiques de groupe ACCEENT'INCUB",
        caption: "Réseautage & synergie entrepreneuriale",
    },
    {
        id: 6,
        src: "/images/acceent-incub/incub-6.jpg",
        alt: "Promotion et valorisation des initiatives des jeunes entrepreneurs",
        caption: "Tremplin vers la réussite",
    },
    // {
    //   id: 7,
    //   src: "/images/acceent-incub/incub-7.jpg",
    //   alt: "Promotion et valorisation des initiatives des jeunes entrepreneurs",
    //   caption: "Tremplin vers la réussite",
    // },
];

export const galerieAcceentIncub = acceentIncubGalerie;
