import { createPageMetadata } from "@/lib/seo";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = createPageMetadata({
  title: "Créer un compte",
  description:
    "Rejoignez la communauté ACCEENT et accédez aux programmes d'éducation, d'entrepreneuriat et de numérique pour les jeunes de Ziguinchor.",
  path: "/auth/register",
  keywords: [
    "inscription ACCEENT",
    "créer un compte",
    "rejoindre ACCEENT",
    "espace membre",
  ],
});

export default function RegisterPage() {
  return <RegisterForm />;
}
