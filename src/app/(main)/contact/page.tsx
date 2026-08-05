import Contact from "@/components/shared/contact/Contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contactez ACCEENT à Ziguinchor pour rejoindre nos programmes d'éducation, d'entrepreneuriat et de numérique, ou pour proposer un partenariat.",
  path: "/contact",
  keywords: [
    "contact ACCEENT",
    "association Ziguinchor contact",
    "partenariat ACCEENT",
  ],
});

export default function ContactPage() {
  return (
    <>
      <Contact />
    </>
  );
}
