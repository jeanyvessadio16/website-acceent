import { contactSchema, ContactFormData } from "../zodSchema/contact";

export interface ContactServiceResult {
  success: boolean;
  message: string;
  data?: ContactFormData;
}

export class ContactService {
  /**
   * Valide et envoie le formulaire de contact
   * @param data Les données du formulaire à valider et envoyer
   * @returns Un résultat avec le statut de l'opération
   */
  static async submitContactForm(
    data: ContactFormData,
  ): Promise<ContactServiceResult> {
    try {
      // Validation des données avec le schéma Zod
      const validatedData = contactSchema.parse(data);

      // Simulation d'un appel API (remplacez par votre vraie logique)
      await this.sendContactEmail(validatedData);

      return {
        success: true,
        message:
          "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
        data: validatedData,
      };
    } catch (error) {
      // Gestion des erreurs de validation Zod
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as { errors?: { message: string }[] };
        const firstError =
          zodError.errors?.[0]?.message || "Erreur de validation des données";
        return {
          success: false,
          message: firstError,
        };
      }

      // Gestion des autres erreurs
      console.error("Erreur lors de l'envoi du formulaire de contact :", error);
      return {
        success: false,
        message:
          "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
      };
    }
  }

  /**
   * Envoie l'email de contact (simulation - remplacez par votre vraie implémentation)
   * @param data Les données validées du formulaire
   */
  private static async sendContactEmail(data: ContactFormData): Promise<void> {
    // Simulation d'un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Ici, vous pouvez implémenter :
    // - Envoi via une API REST (fetch, axios)
    // - Envoi via un service d'email (SendGrid, Mailgun, etc.)
    // - Sauvegarde en base de données
    // - Intégration avec un CRM

    console.log("Email de contact envoyé :", {
      to: "info@acceent.org",
      subject: `Nouveau message de ${data.nomComplet}`,
      body: `
        De: ${data.nomComplet}
        Email: ${data.email}

        Message:
        ${data.message}
      `,
    });

    // Simulation d'une erreur occasionnelle (1% de chance)
    if (Math.random() < 0.01) {
      throw new Error("Erreur de service email");
    }
  }
}
