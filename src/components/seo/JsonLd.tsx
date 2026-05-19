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
    "@type": "NGO",
    name: SITE_NAME,
    alternateName:
      "Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/logoACCEENT.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ziguinchor",
      addressRegion: "Casamance",
      addressCountry: "SN",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Ziguinchor",
    },
    knowsAbout: [
      "Éducation",
      "Entrepreneuriat",
      "Numérique",
      "Inclusion des femmes",
      "Formation des jeunes",
    ],
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
