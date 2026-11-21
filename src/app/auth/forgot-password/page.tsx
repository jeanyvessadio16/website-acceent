import { createPageMetadata } from "@/lib/seo";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = createPageMetadata({
  title: "Mot de passe oublié",
  description: "Demandez un lien de réinitialisation de mot de passe pour votre compte ACCEENT.",
  path: "/auth/forgot-password",
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
