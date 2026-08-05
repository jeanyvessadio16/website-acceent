import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = createPageMetadata({
  title: "Connexion",
  description:
    "Connectez-vous à votre espace ACCEENT pour accéder à vos programmes et ressources.",
  path: "/auth/login",
  keywords: ["connexion ACCEENT", "se connecter", "espace membre ACCEENT"],
});

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
