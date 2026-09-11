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
    "@type": ["NGO", "EducationalOrganization"],
    name: SITE_NAME,
    legalName:
      "Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires",
    alternateName: ["ACCEENT", "ACCEENT Ziguinchor"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo/logoACCEENT.png`,
    image: `${SITE_URL}/logo/logoACCEENT.png`,
    description: DEFAULT_DESCRIPTION,
    email: "info@acceent.org",
    telephone: "+221761417070",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Quartier Santhiaba",
      addressLocality: "Ziguinchor",
      addressRegion: "Ziguinchor",
      addressCountry: "SN",
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
      "Éducation",
      "Entrepreneuriat",
      "Inclusion Numérique",
      "Autonomisation des femmes",
      "Formation de la jeunesse",
      "Robotique WRO",
      "Incubation de projets",
    ],
    sameAs: SOCIAL_SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Programmes d'ACCEENT",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programme Éducation (Tut-Tank, ACCEENT4ELLES)",
            description: "Accompagnement scolaire, mentorat et renforcement de capacités.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programme Entrepreneuriat (ACCEENT Incub, Ateliers)",
            description: "Incubation, ateliers pratiques et accompagnement des porteurs de projet.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programme Numérique (Initiation au code, Robotique WRO, IA)",
            description: "Formations au numérique, initiation aux outils digitaux et compétitions de robotique.",
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
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "fr-SN",
    publisher: {
      "@type": "NGO",
      name: SITE_NAME,
      url: SITE_URL,
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
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  authorName?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    },
    image: imageUrl ? [imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`] : [`${SITE_URL}/logo/logoACCEENT.png`],
    datePublished: datePublished || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: authorName || "Équipe ACCEENT",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/logoACCEENT.png`,
      },
    },
  };

  return <JsonLd data={data} />;
}
