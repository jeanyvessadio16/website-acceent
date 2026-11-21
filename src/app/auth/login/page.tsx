import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { getSession } from "@/lib/session";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = createPageMetadata({
  title: "Connexion",
  description:
    "Connectez-vous à votre espace ACCEENT pour accéder à vos programmes et ressources.",
  path: "/auth/login",
  keywords: ["connexion ACCEENT", "se connecter", "espace membre ACCEENT"],
});

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(
      session.role === "ADMIN" || session.role === "AUTHOR"
        ? "/admin"
        : "/dashboard"
    );
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
