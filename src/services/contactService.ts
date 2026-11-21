import { contactSchema, ContactFormData } from "../validation/contact";

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
  private static getAccessKey(): string {
    const key =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!key) {
      throw new Error(
        "Le service de messagerie n'est pas configuré. Veuillez contacter directement l'association par téléphone ou e-mail."
      );
    }
    return key;
  }

  /**
   * Valide et envoie le formulaire de contact via l'API Web3Forms
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
      access_key: this.getAccessKey(),
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
