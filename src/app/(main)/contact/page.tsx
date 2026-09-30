import Contact from "@/components/shared/contact/Contact";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Contact & Partenariats — Association ACCEENT Ziguinchor",
  description:
    "Contactez l'association ACCEENT à Ziguinchor (quartier Santhiaba) : demandes d'information, adhésion, propositions de partenariats éducatifs ou entrepreneuriaux en Casamance.",
  path: "/contact",
  keywords: [
    "contact ACCEENT",
    "association Ziguinchor contact",
    "adresse ACCEENT Santhiaba",
    "partenariat ONG Ziguinchor",
    "rejoindre ACCEENT Casamance",
    "bénévolat Ziguinchor",
    "téléphone ACCEENT Ziguinchor",
    "nous contacter ACCEENT",
  ],
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Contact", item: "/contact" },
        ]}
      />
      <Contact />
    </>
  );
}
