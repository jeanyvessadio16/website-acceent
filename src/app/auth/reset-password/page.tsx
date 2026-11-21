import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = createPageMetadata({
  title: "Réinitialiser le mot de passe",
  description: "Définissez un nouveau mot de passe pour votre compte ACCEENT.",
  path: "/auth/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
