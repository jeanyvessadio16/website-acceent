import { createPageMetadata } from "@/lib/seo";
import { LegalPageLayout, type LegalSection } from "@/components/shared/LegalPageLayout";

export const metadata = createPageMetadata({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et de protection des données personnelles de l'association ACCEENT à Ziguinchor (Sénégal).",
  path: "/politique-de-confidentialite",
});

const privacySections: LegalSection[] = [
  {
    id: "responsable-traitement",
    title: "Responsable du traitement",
    paragraphs: [
      "La présente Politique de confidentialité décrit la manière dont l'association ACCEENT (Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires), sise au quartier Santhiaba à Ziguinchor (Sénégal), collecte, utilise et protège vos données à caractère personnel.",
      "Ces traitements sont effectués conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 portant sur la protection des données à caractère personnel et aux bonnes pratiques internationales de confidentialité (notamment les principes du RGPD).",
    ],
  },
  {
    id: "donnees-collectees",
    title: "Données personnelles collectées",
    paragraphs: [
      "Selon les services utilisés sur la plateforme ACCEENT, nous collectons uniquement les données nécessaires à nos missions éducatives, entrepreneuriales et d'inclusion numérique :",
    ],
    bullets: [
      "Compte membre & profil : prénom, nom, adresse e-mail, numéro de téléphone, âge, sexe (Homme/Femme), milieu de résidence (Rural/Urbain), déclaration de situation de handicap (SDH : Oui/Non) et mot de passe chiffré.",
      "Candidatures aux programmes : projet présenté, motivation, niveau d'avancement et échanges liés à l'accompagnement.",
      "Événements & ressources : inscriptions aux ateliers/formations et suivi administratif de participation.",
      "Contact & Newsletter : coordonnées transmises via le formulaire de contact et préférences d'abonnement aux communications.",
      "Journaux techniques de sécurité : adresse IP anonymisée/horodatée pour la prévention des abus (limitation de requêtes) et la traçabilité d'audit.",
    ],
  },
  {
    id: "finalites-traitement",
    title: "Finalités de l'utilisation des données",
    paragraphs: [
      "Vos données personnelles sont traitées exclusivement pour les objectifs suivants :",
    ],
    bullets: [
      "Créer et gérer votre compte personnel sécurisé et permettre la connexion à votre tableau de bord.",
      "Instruire vos candidatures aux programmes (ACCEENT-Elles, Tut-Tank, ACCEENT Incub, AI4Good, WRO) et organiser les événements.",
      "Produire des statistiques d'impact territorial et d'inclusion sociale agrégées (âge, genre, milieu rural/urbain, accessibilité SDH) afin d'adapter nos actions aux besoins réels en Casamance.",
      "Répondre à vos demandes envoyées via le formulaire de contact et adresser nos actualités aux personnes abonnées.",
      "Assurer la sécurité technique du site et prévenir les inscriptions ou soumissions automatisées abusives.",
    ],
  },
  {
    id: "base-legale-consentement",
    title: "Base légale et consentement",
    paragraphs: [
      "La création d'un compte et l'accès aux services reposent sur votre acceptation préalable des Conditions Générales d'Utilisation (CGU) ainsi que sur votre consentement libre et éclairé lors du remplissage des formulaires.",
      "Les informations relatives à la situation de handicap (SDH) sont collectées avec votre déclaration explicite dans le seul but de favoriser l'accessibilité, l'inclusion et le suivi statistique non nominatif de nos programmes.",
      "L'abonnement à la newsletter et l'activation des cookies de mesure d'audience reposent exclusivement sur votre consentement, révocable à tout moment.",
    ],
  },
  {
    id: "securite-conservation",
    title: "Sécurité et durée de conservation",
    paragraphs: [
      "ACCEENT applique des mesures techniques et organisationnelles strictes pour protéger vos informations contre la perte, l'altération ou l'accès non autorisé :",
    ],
    bullets: [
      "Les mots de passe ne sont jamais stockés en clair : ils sont hachés de façon irréversible via bcrypt.",
      "Les échanges sont chiffrés via HTTPS et les sessions reposent sur des jetons signés.",
      "L'accès aux données des membres dans l'interface d'administration est strictement restreint aux administrateurs habilités d'ACCEENT.",
      "Les données du compte sont conservées pendant toute la durée active de votre adhésion sur la plateforme, puis archivées ou supprimées sur demande ou après une inactivité prolongée.",
    ],
  },
  {
    id: "destinataires-partage",
    title: "Destinataires et absence de cession commerciale",
    paragraphs: [
      "ACCEENT ne vend, ne loue et ne cède jamais vos données personnelles à des tiers à des fins commerciales ou publicitaires.",
      "Seuls les membres habilités de l'équipe ACCEENT et nos sous-traitants techniques strictement nécessaires à l'hébergement, à la base de données ou à l'acheminement des e-mails accèdent aux données dans le cadre sécurisé de leurs prestations.",
    ],
  },
  {
    id: "cookies-traceurs",
    title: "Gestion des cookies",
    paragraphs: [
      "Le site utilise des cookies techniques essentiels indispensables au maintien de votre session authentifiée et à la mémorisation de vos choix de confidentialité.",
      "Les traceurs optionnels de mesure d'audience ne sont activés qu'avec votre accord via le bandeau de consentement. Vous pouvez modifier vos préférences à tout instant via le bouton « Gérer mes cookies » en pied de page.",
    ],
  },
  {
    id: "exercice-droits",
    title: "Vos droits sur vos données",
    paragraphs: [
      "Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification, de mise à jour, d'opposition et de suppression de vos données personnelles.",
    ],
    bullets: [
      "Vous pouvez consulter et mettre à jour directement vos informations personnelles depuis votre espace membre (/dashboard/profil).",
      "Vous pouvez vous désinscrire de la newsletter à tout moment depuis votre profil ou via le lien de désabonnement présent dans chaque e-mail.",
      "Pour toute demande d'accès complet, de portabilité ou de suppression de compte, contactez notre équipe à l'adresse info@acceent.org.",
    ],
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      badgeLabel="Données personnelles & Vie privée"
      icon="privacy"
      title="Politique de confidentialité"
      subtitle="Comment l'association ACCEENT collecte, sécurise et traite vos données personnelles en toute transparence."
      updatedAt="21 novembre 2026"
      crossLink={{
        href: "/cgu",
        label: "Consulter les Conditions Générales d'Utilisation (CGU)",
      }}
      sections={privacySections}
    />
  );
}
