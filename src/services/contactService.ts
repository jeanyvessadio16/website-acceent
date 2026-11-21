import { ZodError } from "zod";
import { contactSchema, type ContactFormData } from "../validation/contact";

export interface ContactServiceResult {
  success: boolean;
  message: string;
  data?: ContactFormData;
}

interface ApiContactResponse {
  success: boolean;
  message?: string;
}

class ContactDeliveryError extends Error {}

export class ContactService {
  private static getAccessKey(): string {
    const key =
      process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
    if (!key) {
      throw new ContactDeliveryError(
        "Le service de messagerie n'est pas configuré. Veuillez contacter directement l'association par téléphone ou e-mail."
      );
    }
    return key;
  }

  /**
   * Valide et envoie le formulaire de contact via l'API Web3Forms (côté serveur uniquement).
   */
  static async submitContactForm(
    data: ContactFormData
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
      if (error instanceof ZodError) {
        const firstError =
          error.issues[0]?.message || "Erreur de validation des données";
        return {
          success: false,
          message: firstError,
        };
      }

      if (error instanceof ContactDeliveryError) {
        return {
          success: false,
          message: error.message,
        };
      }

      console.error("Erreur lors de l'envoi du formulaire de contact :", error);
      return {
        success: false,
        message:
          "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
      };
    }
  }

  private static async sendContactEmail(data: ContactFormData): Promise<void> {
    const { botcheck: _botcheck, ...fields } = data;
    void _botcheck;

    const payload = {
      ...fields,
      botcheck: false,
      access_key: this.getAccessKey(),
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    let result: ApiContactResponse;
    try {
      result = (await response.json()) as ApiContactResponse;
    } catch {
      throw new ContactDeliveryError(
        "Impossible de traiter la réponse du service de messagerie. Veuillez réessayer."
      );
    }

    if (!response.ok || !result.success) {
      console.error("[ContactService] Réponse Web3Forms en échec:", {
        status: response.status,
        message: result.message,
      });
      throw new ContactDeliveryError(
        "L'envoi du message a échoué. Veuillez réessayer plus tard."
      );
    }
  }
}
