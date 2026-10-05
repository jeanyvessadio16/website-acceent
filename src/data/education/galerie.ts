/** Images de galerie pour le programme ACCEENT4ELLES */
export interface GalerieItem {
  id: number;
  src: string;
  alt: string;
  /** Optionnel : légende affichée au survol */
  caption?: string;
}

export const galerieAcceent4Elles: GalerieItem[] = [
  {
    id: 1,
    src: "/images/acceent4elles/acceent4elles.jpeg",
    alt: "Atelier ACCEENT4ELLES — participantes en formation",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 2,
    src: "/images/acceent4elles/acceent4ellesNumerique.jpeg",
    alt: "Initiation au numérique — jeunes filles ACCEENT4ELLES",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 3,
    src: "/images/acceent4elles/WhatsApp Image 2026-10-01 at 16.13.04l.jpeg",
    alt: "Activité collective ACCEENT4ELLES",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 4,
    src: "/images/acceent4elles/WhatsApp Image 2026-10-01 at 16.13.04r.jpeg",
    alt: "Participantes ACCEENT4ELLES en atelier",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 5,
    src: "/images/acceent4elles/WhatsApp Image 2026-10-01 at 16.13.05.jpeg",
    alt: "Séance de travail ACCEENT4ELLES",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 6,
    src: "/images/acceent4elles/WhatsApp Image 2026-10-01 at 16.13.05g.jpeg",
    alt: "Formation et développement personnel — ACCEENT4ELLES",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 7,
    src: "/images/acceent4elles/WhatsApp Image 2026-10-01 at 16.13.05jk.jpeg",
    alt: "Jeunes filles ACCEENT4ELLES en apprentissage",
    caption: "ACCEENT4ELLES",
  },
  {
    id: 8,
    src: "/images/acceent4elles/WhatsApp Image 2026-10-01 at 16.13.u05.jpeg",
    alt: "Remise de certificats ACCEENT4ELLES",
    caption: "ACCEENT4ELLES",
  },
];
