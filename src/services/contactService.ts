import { contactSchema, ContactFormData } from "../zodSchema/contact";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface ContactServiceResult {
  success: boolean;
  message: string;
  data?: ContactFormData;
}

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

export class ContactService {
  /**
   * Valide et envoie le formulaire de contact via Web3Forms
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
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      throw new Error(
        "Le formulaire n'est pas configuré. Contactez l'administrateur du site.",
      );
    }

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: data.nomComplet,
        email: data.email,
        phone: data.telephone,
        message: data.message,
        subject: `Contact site ACCEENT - ${data.nomComplet}`,
        from_name: "ACCEENT - Site web",
        replyto: data.email,
        botcheck: data.botcheck ?? false,
      }),
    });

    let result: Web3FormsResponse;
    try {
      result = (await response.json()) as Web3FormsResponse;
    } catch {
      throw new Error(
        "Impossible de traiter la réponse du serveur. Veuillez réessayer.",
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
