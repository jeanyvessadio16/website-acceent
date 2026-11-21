import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { getSession } from "@/lib/session";
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

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(
      session.role === "ADMIN" || session.role === "AUTHOR"
        ? "/admin"
        : "/dashboard"
    );
  }

  return <RegisterForm />;
}
