import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/validation/auth";
import { createPostSchema } from "@/validation/post";
import { submitApplicationSchema } from "@/validation/application";
import { createEventSchema } from "@/validation/event";
import { subscribeNewsletterSchema } from "@/validation/newsletter";
import { contactSchema } from "@/validation/contact";
import { updateProfileSchema } from "@/validation/user";
import { partnerSchema, testimonialSchema } from "@/validation/showcase";

describe("Validation Schemas (Zod v4 + Regex)", () => {
  it("valide l'inscription complète avec âge, sexe, milieu, téléphone et SDH", () => {
    const valid = registerSchema.safeParse({
      firstname: "Awa",
      lastname: "Diatta-Ndiaye",
      email: "  Awa@Acceent.Org ",
      age: 24,
      sexe: "FEMME",
      milieuResidence: "URBAIN",
      telephone: "+221 77 123 45 67",
      sdh: false,
      password: "Password1@",
    });
    assert.equal(valid.success, true);

    // Prénom contenant des chiffres ou balises HTML rejeté
    assert.equal(
      registerSchema.safeParse({
        firstname: "Awa123",
        lastname: "Diatta",
        email: "awa@acceent.org",
        age: 24,
        sexe: "FEMME",
        milieuResidence: "RURAL",
        telephone: "+221 77 123 45 67",
        sdh: true,
        password: "Password1@",
      }).success,
      false
    );

    // Âge hors bornes rejeté
    assert.equal(
      registerSchema.safeParse({
        firstname: "Awa",
        lastname: "Diatta",
        email: "awa@acceent.org",
        age: 5,
        sexe: "FEMME",
        milieuResidence: "RURAL",
        telephone: "+221 77 123 45 67",
        sdh: false,
        password: "Password1@",
      }).success,
      false
    );

    // Téléphone Sénégal invalide rejeté
    assert.equal(
      registerSchema.safeParse({
        firstname: "Awa",
        lastname: "Diatta",
        email: "awa@acceent.org",
        age: 22,
        sexe: "FEMME",
        milieuResidence: "RURAL",
        telephone: "+221 12 345 67 89",
        sdh: false,
        password: "Password1@",
      }).success,
      false
    );
  });

  it("valide la mise à jour du profil et ses champs socio-démographiques", () => {
    assert.equal(
      updateProfileSchema.safeParse({
        firstname: "Moussa",
        lastname: "Sarr",
        email: "moussa@acceent.org",
        age: 28,
        sexe: "HOMME",
        milieuResidence: "RURAL",
        telephone: "781234567",
        sdh: true,
        password: "",
      }).success,
      true
    );

    assert.equal(
      updateProfileSchema.safeParse({
        firstname: "Moussa",
        lastname: "Sarr",
        email: "moussa@acceent.org",
        age: 28,
        sexe: "HOMME",
        milieuResidence: "RURAL",
        telephone: "abc-invalid",
        sdh: false,
      }).success,
      false
    );
  });

  it("valide le formulaire de contact sans balises HTML et téléphone regex", () => {
    assert.equal(
      contactSchema.safeParse({
        nomComplet: "Fatou Binetou Coly",
        email: "fatou@acceent.org",
        telephone: "+221 76 141 70 70",
        message: "Bonjour l'équipe ACCEENT, je souhaite rejoindre l'incubateur.",
      }).success,
      true
    );

    assert.equal(
      contactSchema.safeParse({
        nomComplet: "Fatou Coly",
        email: "fatou@acceent.org",
        telephone: "+221 76 141 70 70",
        message: "<script>alert(1)</script> Bonjour message assez long.",
      }).success,
      false
    );
  });

  it("valide le flux de réinitialisation de mot de passe", () => {
    assert.equal(
      forgotPasswordSchema.safeParse({ email: "USER@Acceent.org " }).success,
      true
    );
    assert.equal(forgotPasswordSchema.safeParse({ email: "pas-un-email" }).success, false);

    const mismatch = resetPasswordSchema.safeParse({
      token: "abcdef123456",
      password: "Password1@",
      confirmPassword: "OtherPassword1@",
    });
    assert.equal(mismatch.success, false);

    const validReset = resetPasswordSchema.safeParse({
      token: "abcdef123456",
      password: "Password1@",
      confirmPassword: "Password1@",
    });
    assert.equal(validReset.success, true);
  });

  it("valide les catégories, tags et URLs d'articles", () => {
    const valid = createPostSchema.safeParse({
      title: "Atelier IA à Ziguinchor",
      content: "Un atelier pratique d'initiation à l'intelligence artificielle.",
      category: "NUMERIQUE",
      tags: ["AI4Good", "Ziguinchor"],
      link: "https://acceent.org/ai4good",
      published: true,
    });
    assert.equal(valid.success, true);

    const invalidUrl = createPostSchema.safeParse({
      title: "Test XSS URL",
      content: "Contenu suffisamment long pour passer la règle de longueur.",
      link: "javascript:alert(1)",
    });
    assert.equal(invalidUrl.success, false);
  });

  it("valide les candidatures, événements, vitrine et newsletter", () => {
    assert.equal(
      submitApplicationSchema.safeParse({
        programSlug: "programme-inexistant",
        phone: "+221771234567",
        city: "Ziguinchor",
        motivation: "Une motivation détaillée de plus de vingt caractères.",
      }).success,
      false
    );

    assert.equal(
      submitApplicationSchema.safeParse({
        programSlug: "acceent-incub",
        phone: "+221771234567",
        city: "Ziguinchor",
        motivation: "Je souhaite développer mon projet agroalimentaire en Casamance.",
      }).success,
      true
    );

    assert.equal(
      createEventSchema.safeParse({
        title: "Forum 2026",
        description: "Description détaillée du forum entrepreneurial.",
        location: "Ziguinchor",
        startDate: "date-invalide",
      }).success,
      false
    );

    const goodNl = subscribeNewsletterSchema.safeParse({
      email: "  Membre@Acceent.Org ",
      name: "Awa",
    });
    assert.equal(goodNl.success, true);
    if (goodNl.success) {
      assert.equal(goodNl.data.email, "membre@acceent.org");
    }

    assert.equal(
      partnerSchema.safeParse({
        name: "Partenaire Casamance",
        logoUrl: "/logo/logo-acceent.png",
        description: "Partenaire stratégique local.",
        website: "https://acceent.org",
      }).success,
      true
    );

    assert.equal(
      testimonialSchema.safeParse({
        authorName: "Ousmane Diédhiou",
        authorRole: "Entrepreneur",
        quote: "Un accompagnement exceptionnel au sein de ACCEENT Incub.",
        rating: 5,
      }).success,
      true
    );
  });
});
