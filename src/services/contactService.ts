import { contactSchema, ContactFormData } from "../zodSchema/contact";

export interface ContactServiceResult {
  success: boolean;
  message: string;
  data?: ContactFormData;
}

interface ApiContactResponse {
  success: boolean;
  message?: string;
}

export class ContactService {
  /**
   * Valide et envoie le formulaire de contact via l'API /api/contact (Web3Forms)
   */
  static async submitContactForm(
    data: ContactFormData,
  ): Promise<ContactServiceResult> {
    try {
      const validatedData = contactSchema.parse(data);
      await this.sendContactEmail(validatedData);

      return {
        success: true,
        message:
          "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as { errors?: { message: string }[] };
        const firstError =
          zodError.errors?.[0]?.message || "Erreur de validation des données";
        return {
          success: false,
          message: firstError,
        };
      }

      console.error("Erreur lors de l'envoi du formulaire de contact :", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
      };
    }
  }

  private static async sendContactEmail(data: ContactFormData): Promise<void> {
    const payload = {
      ...data,
      access_key: "941aa959-ba42-41ad-be9c-3cada9118e77",
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    let result: ApiContactResponse;
    try {
      result = (await response.json()) as ApiContactResponse;
    } catch {
      throw new Error(
        "Impossible de traiter la réponse de Web3Forms. Veuillez réessayer.",
      );
    }

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "L'envoi du message a échoué. Veuillez réessayer plus tard.",
      );
    }
  }
}
