export interface GalerieItem {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

export const wroGalerie: GalerieItem[] = [
  {
    id: 1,
    src: "/images/wro/IMG_7154.jpg",
    alt: "Équipe WRO Sénégal — préparation et conception de robots à Ziguinchor",
    caption: "Atelier de robotique WRO",
  },
  {
    id: 2,
    src: "/images/wro/IMG_7158.jpg",
    alt: "Séance d'assemblage et de mécanique robotique avec les jeunes",
    caption: "Construction et assemblage de robots",
  },
  {
    id: 3,
    src: "/images/wro/IMG_7165.jpg",
    alt: "Test de déplacement et capteurs sur tapis de compétition WRO",
    caption: "Mise à l'épreuve des missions WRO",
  },
  {
    id: 4,
    src: "/images/wro/IMG_7345.jpg",
    alt: "Mentorat technique et encadrement des équipes WRO par ACCEENT",
    caption: "Mentorat & travail en équipe",
  },
  {
    id: 5,
    src: "/images/wro/IMG_7363.jpg",
    alt: "Programmation visuelle et défis algorithmiques pour les jeunes",
    caption: "Programmation et algorithmes",
  },
  {
    id: 6,
    src: "/images/wro/IMG_9323_Original.jpg",
    alt: "Compétition de robotique éducative World Robot Olympiad",
    caption: "Compétitions et challenges locaux",
  },
  {
    id: 7,
    src: "/images/wro/IMG_9325_Original.jpg",
    alt: "Résolution de problèmes et stratégie de match WRO",
    caption: "Résolution de problèmes en équipe",
  },
  {
    id: 8,
    src: "/images/wro/IMG_9365_Original.jpg",
    alt: "Démonstrations de robots autonomes conçus par les participants",
    caption: "Démonstrations de robots autonomes",
  },
  {
    id: 9,
    src: "/images/wro/IMG_9405_Original.jpg",
    alt: "Présentation des prototypes et valorisation des jeunes innovateurs",
    caption: "Innovation & partage",
  },
];

export const galerieWro = wroGalerie;
