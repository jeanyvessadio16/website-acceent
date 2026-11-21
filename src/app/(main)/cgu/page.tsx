import { createPageMetadata } from "@/lib/seo";
import { LegalPageLayout, type LegalSection } from "@/components/shared/LegalPageLayout";

export const metadata = createPageMetadata({
  title: "Conditions Générales d'Utilisation (CGU)",
  description:
    "Conditions Générales d'Utilisation du site et de la plateforme membre de l'association ACCEENT à Ziguinchor, Sénégal.",
  path: "/cgu",
});

const cguSections: LegalSection[] = [
  {
    id: "objet-editeur",
    title: "Objet et éditeur de la plateforme",
    paragraphs: [
      "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») encadrent l'accès et l'utilisation du site web et de l'espace membre de l'association ACCEENT (Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires).",
      "La plateforme est éditée par l'association ACCEENT, organisation basée au quartier Santhiaba à Ziguinchor (Casamance, Sénégal), joignable par courrier électronique à info@acceent.org et par téléphone au +221 76 141 70 70.",
    ],
  },
  {
    id: "acces-inscription",
    title: "Accès au site et création de compte membre",
    paragraphs: [
      "La consultation des pages publiques du site est libre et gratuite. L'accès à l'espace membre, au dépôt de candidatures aux programmes et à la gestion des inscriptions aux événements nécessite la création d'un compte personnel.",
      "Lors de l'inscription, l'utilisateur s'engage à accepter sans réserve les présentes CGU et à fournir des informations exactes, complètes et à jour (prénom, nom, âge, sexe, milieu de résidence, numéro de téléphone, situation de handicap déclarée SDH et adresse e-mail).",
    ],
    bullets: [
      "L'utilisateur est personnellement responsable de la confidentialité de son mot de passe et de toute activité effectuée depuis son compte.",
      "Toute suspicion d'accès non autorisé doit être signalée sans délai à info@acceent.org.",
      "ACCEENT se réserve le droit de suspendre ou clôturer tout compte comportant des informations manifestement erronées ou utilisé à des fins frauduleuses.",
    ],
  },
  {
    id: "services-proposes",
    title: "Services et programmes proposés",
    paragraphs: [
      "La plateforme permet aux visiteurs et membres de découvrir et de participer aux initiatives d'ACCEENT dans ses trois pôles d'action : Éducation (ACCEENT-Elles, Tut-Tank), Entrepreneuriat (ACCEENT Incub, Ateliers et Forum Entrepreneur) et Numérique (AI4Good, WRO).",
    ],
    bullets: [
      "Consultation des actualités, ressources pédagogiques et agendas d'événements.",
      "Inscription aux ateliers, formations et compétitions, avec génération de billets.",
      "Soumission et suivi des dossiers de candidature aux programmes d'accompagnement.",
      "Abonnement facultatif à la lettre d'information d'ACCEENT.",
    ],
  },
  {
    id: "engagements-utilisateur",
    title: "Comportement et obligations de l'utilisateur",
    paragraphs: [
      "L'utilisateur s'engage à utiliser la plateforme de manière loyale, respectueuse et conforme aux lois en vigueur en République du Sénégal ainsi qu'aux valeurs d'inclusion et d'entraide portées par ACCEENT.",
    ],
    bullets: [
      "Ne pas publier, transmettre ou soumettre via les formulaires de contenus illicites, diffamatoires, discriminatoires ou contenant du code malveillant (balises ou scripts injectés).",
      "Ne pas tenter de contourner les mécanismes d'authentification, de limitation de requêtes ou de contrôle d'accès aux données.",
      "Ne pas usurper l'identité d'un tiers ni collecter de manière automatisée les données présentes sur le site.",
    ],
  },
  {
    id: "propriete-intellectuelle",
    title: "Propriété intellectuelle",
    paragraphs: [
      "L'ensemble des textes, visuels, photographies, logos, supports pédagogiques, marques et éléments graphiques présents sur le site sont la propriété exclusive d'ACCEENT ou font l'objet d'autorisations d'utilisation dédiées.",
      "Toute reproduction, représentation, diffusion ou exploitation commerciale sans autorisation écrite préalable d'ACCEENT est strictement interdite, à l'exception des usages strictement personnels ou pédagogiques citant explicitement la source.",
    ],
  },
  {
    id: "donnees-personnelles",
    title: "Protection des données personnelles",
    paragraphs: [
      "Les données collectées lors de l'inscription, des candidatures et de la navigation sont traitées dans le respect de la vie privée des utilisateurs et des exigences légales applicables au Sénégal.",
      "Les modalités détaillées de collecte, de finalité, de conservation et d'exercice des droits sont présentées dans notre Politique de confidentialité accessible à l'adresse /politique-de-confidentialite.",
    ],
  },
  {
    id: "responsabilite-disponibilite",
    title: "Responsabilité et disponibilité du service",
    paragraphs: [
      "ACCEENT met tout en œuvre pour assurer un accès fiable et continu à sa plateforme. Toutefois, l'association ne saurait être tenue responsable des interruptions temporaires liées à des opérations de maintenance, de mise à jour technique ou à des contraintes de réseau indépendantes de sa volonté.",
      "Les liens hypertextes pointant vers des sites partenaires ou externes sont fournis à titre informatif et n'engagent pas la responsabilité d'ACCEENT quant à leur contenu.",
    ],
  },
  {
    id: "modification-droit",
    title: "Modification des CGU et droit applicable",
    paragraphs: [
      "ACCEENT peut adapter les présentes CGU à tout moment afin de refléter l'évolution de ses programmes, de ses outils techniques ou du cadre réglementaire. La version en vigueur est celle publiée sur cette page à la date de consultation.",
      "Les présentes CGU sont régies par le droit sénégalais. En cas de différend, les parties privilégieront une résolution amiable préalable avant toute action devant les juridictions compétentes de Ziguinchor (Sénégal).",
    ],
  },
];

export default function CguPage() {
  return (
    <LegalPageLayout
      badgeLabel="Cadre réglementaire ACCEENT"
      icon="cgu"
      title="Conditions Générales d'Utilisation"
      subtitle="Règles d'accès, d'inscription et d'utilisation de la plateforme web et de l'espace membre de l'association ACCEENT à Ziguinchor."
      updatedAt="21 novembre 2026"
      crossLink={{
        href: "/politique-de-confidentialite",
        label: "Consulter la Politique de confidentialité",
      }}
      sections={cguSections}
    />
  );
}
