export interface GalerieItem {
    id: number;
    src: string;
    alt: string;
    caption?: string;
}

export const tutTankGalerie: GalerieItem[] = [
    {
        id: 1,
        src: "/images/tut-tank/tut-tank-1.jpg",
        alt: "Séance d'accompagnement scolaire et d'apprentissage — programme TUT-TANK",
        caption: "Accompagnement scolaire bienveillant",
    },
    {
        id: 2,
        src: "/images/tut-tank/tut-tank-2.jpg",
        alt: "Atelier éducatif et développement de la pensée critique avec les jeunes filles",
        caption: "Atelier de pensée critique",
    },
    {
        id: 3,
        src: "/images/tut-tank/tut-tank-3.jpg",
        alt: "Activités de groupe et partage entre participantes TUT-TANK",
        caption: "Apprentissage & complicité",
    },
    {
        id: 4,
        src: "/images/tut-tank/tut-tank-4.jpg",
        alt: "Échanges éducatifs et soutien personnalisé des élèves à Ziguinchor",
        caption: "Suivi individuel des bénéficiaires",
    },
    {
        id: 5,
        src: "/images/tut-tank/tut-tank-5.jpg",
        alt: "Moment de rassemblement et renforcement du dialogue au sein de TUT-TANK",
        caption: "Cohésion & dialogue éducatif",
    },
    {
        id: 6,
        src: "/images/tut-tank/tut-tank-6.jpg",
        alt: "Activités collectives et épanouissement des jeunes filles — TUT-TANK",
        caption: "Épanouissement et réussite scolaire",
    },
    // {
    //     id: 7,
    //     src: "/images/tut-tank/tut-tank-7.jpg",
    //     alt: "Activités collectives et épanouissement des jeunes filles — TUT-TANK",
    //     caption: "Épanouissement et réussite scolaire",
    // },
];

export const galerieTutTank = tutTankGalerie;
