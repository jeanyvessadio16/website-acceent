import { SOCIAL_SAME_AS } from "@/data/social-profiles";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["NGO", "EducationalOrganization", "NonprofitOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName:
      "Association ACCEENT - Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires",
    alternateName: [
      "ACCEENT",
      "Association ACCEENT",
      "ACCEENT Ziguinchor",
      "ACCEENT Santhiaba",
      "ACCEENT Sénégal",
      "ACCEENT Casamance",
      "ONG ACCEENT",
      "ACCEENT NGO",
      "A.C.C.E.E.N.T.",
      "Association ACCEENT Ziguinchor",
    ],
    url: SITE_URL,
    slogan:
      "Éducation, Entrepreneuriat et Numérique au service des jeunes et des femmes à Ziguinchor",
    disambiguatingDescription:
      "ACCEENT est le nom officiel et principal de l'Association pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires, basée à Ziguinchor (quartier Santhiaba, Sénégal).",
    brand: {
      "@type": "Brand",
      name: "ACCEENT",
      alternateName: "Association ACCEENT",
      logo: `${SITE_URL}/logo/logoACCEENT.png`,
      url: SITE_URL,
    },
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/logo/logoACCEENT.png`,
      width: 512,
      height: 512,
      contentUrl: `${SITE_URL}/logo/logoACCEENT.png`,
      caption: "Logo officiel de l'Association ACCEENT",
    },
    image: `${SITE_URL}/logo/logoACCEENT.png`,
    description: DEFAULT_DESCRIPTION,
    email: "info@acceent.org",
    telephone: "+221761417070",
    foundingDate: "2019",
    knowsLanguage: ["fr", "fr-SN"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Quartier Santhiaba",
      addressLocality: "Ziguinchor",
      addressRegion: "Ziguinchor",
      postalCode: "22000",
      addressCountry: "SN",
    },
    location: {
      "@type": "Place",
      name: "Association ACCEENT — Siège de Ziguinchor",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Quartier Santhiaba",
        addressLocality: "Ziguinchor",
        addressRegion: "Ziguinchor",
        postalCode: "22000",
        addressCountry: "SN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "12.5683",
        longitude: "-16.2733",
      },
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.5683",
      longitude: "-16.2733",
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Ziguinchor",
      },
      {
        "@type": "AdministrativeArea",
        name: "Casamance",
      },
      {
        "@type": "Country",
        name: "Sénégal",
      },
    ],
    knowsAbout: [
      "ACCEENT",
      "Association ACCEENT",
      "ACCEENT Ziguinchor",
      "ACCEENT Casamance",
      "Éducation",
      "Entrepreneuriat",
      "Inclusion Numérique",
      "Autonomisation des femmes",
      "Formation de la jeunesse",
      "Robotique WRO",
      "Intelligence Artificielle AI4Good",
      "Incubation de projets ACCEENT Incub",
      "Mentorat ACCEENT Elles",
      "Développement territorial",
    ],
    // Membres / bénéficiaires cibles
    member: [
      {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          name: "Jeunes et Femmes de la Casamance",
        },
        startDate: "2019",
      },
    ],
    sameAs: SOCIAL_SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Programmes d'ACCEENT",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Programme Éducation",
            description:
              "Accompagnement scolaire, mentorat et renforcement de capacités des jeunes et des femmes à Ziguinchor.",
            url: `${SITE_URL}/education`,
            hasPart: [
              {
                "@type": "Course",
                name: "ACCEENT-Elles",
                description:
                  "Programme d'autonomisation et de mentorat des jeunes filles.",
                url: `${SITE_URL}/acceent-elles`,
              },
              {
                "@type": "Course",
                name: "Tut-Tank",
                description:
                  "Soutien scolaire et accompagnement pédagogique des élèves à Ziguinchor.",
                url: `${SITE_URL}/tut-tank`,
              },
            ],
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Programme Entrepreneuriat",
            description:
              "Incubation, ateliers pratiques et accompagnement des porteurs de projet en Casamance.",
            url: `${SITE_URL}/entreprenariat`,
            hasPart: [
              {
                "@type": "Course",
                name: "ACCEENT Incub",
                description:
                  "Incubateur de projets entrepreneuriaux pour les jeunes de Ziguinchor.",
                url: `${SITE_URL}/acceent-incub`,
              },
              {
                "@type": "Course",
                name: "Atelier Entrepreneuriat",
                description:
                  "Ateliers pratiques de formation à l'entrepreneuriat.",
                url: `${SITE_URL}/atelier-entreprenariat`,
              },
              {
                "@type": "Course",
                name: "Forum Entrepreneur",
                description:
                  "Forum annuel de mise en réseau des entrepreneurs de Casamance.",
                url: `${SITE_URL}/forum-entrepreneur`,
              },
            ],
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Programme Numérique",
            description:
              "Formations au numérique, initiation aux outils digitaux, IA et compétitions de robotique.",
            url: `${SITE_URL}/numerique`,
            hasPart: [
              {
                "@type": "Course",
                name: "AI4Good",
                description:
                  "Initiation à l'intelligence artificielle au service du bien commun.",
                url: `${SITE_URL}/ai4good`,
              },
              {
                "@type": "Course",
                name: "WRO Sénégal",
                description:
                  "Participation à la World Robot Olympiad — compétition internationale de robotique.",
                url: `${SITE_URL}/wro`,
              },
            ],
          },
        },
      ],
    },
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "fr-SN",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    // SearchAction — permet aux moteurs de proposer la recherche sur le site
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/actualites?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; item: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : `${SITE_URL}${it.item}`,
    })),
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  keywords,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}) {
  const canonicalUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;
  const imageUrlFull = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${SITE_URL}${imageUrl}`
    : `${SITE_URL}/logo/logoACCEENT.png`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    headline: title,
    description,
    keywords: keywords?.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: [imageUrlFull],
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    inLanguage: "fr-SN",
    author: {
      "@type": "Person",
      name: authorName || "Équipe ACCEENT",
      affiliation: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  return <JsonLd data={data} />;
}

/** JSON-LD pour une page programme / service spécifique */
export function ProgrammeJsonLd({
  name,
  description,
  url,
  domaine,
}: {
  name: string;
  description: string;
  url: string;
  domaine: "Éducation" | "Entrepreneuriat" | "Numérique";
}) {
  const canonicalUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "@id": canonicalUrl,
    name,
    description,
    url: canonicalUrl,
    inLanguage: "fr-SN",
    educationalProgramMode: "in-person",
    occupationalCategory: domaine,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
    },
    locationCreated: {
      "@type": "Place",
      name: "Ziguinchor, Sénégal",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ziguinchor",
        addressCountry: "SN",
      },
    },
  };

  return <JsonLd data={data} />;
}
