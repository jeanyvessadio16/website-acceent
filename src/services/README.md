# Services

Couche de **logique métier** isolée des composants React. Les services ne doivent pas importer de hooks ni de composants UI.

Documentation générale du projet : [README.md](../../README.md) · [Architecture](../../docs/architecture.md)

---

## ContactService

Gère la validation et l’envoi du formulaire de contact.

**Fichier :** `contactService.ts`  
**Schéma associé :** `src/zodSchema/contact.ts`  
**Composant consommateur :** `src/components/shared/Contact.tsx`

### Flux

```
Contact.tsx (onSubmit)
    → ContactService.submitContactForm(data)
        → contactSchema.parse(data)   // Zod
        → sendContactEmail(data)      // À remplacer par une vraie intégration
    → ContactServiceResult { success, message, data? }
```

### Utilisation

```typescript
import { ContactService } from "@/services/contactService";

const result = await ContactService.submitContactForm({
  nomComplet: "Awa Diop",
  email: "awa@exemple.sn",
  message: "Bonjour, je souhaite en savoir plus sur vos programmes.",
});

if (result.success) {
  // Afficher SuccessAlertDialog, réinitialiser le formulaire
  console.log(result.data);
} else {
  // Afficher FormErrorBanner avec result.message
}
```

### Interface de retour

```typescript
interface ContactServiceResult {
  success: boolean;
  message: string;
  data?: ContactFormData; // Présent uniquement si success === true
}
```

### Méthode publique

#### `submitContactForm(data: ContactFormData): Promise<ContactServiceResult>`

1. Valide `data` avec `contactSchema`
2. Appelle `sendContactEmail` (simulation actuelle : délai 1,5 s + `console.log`)
3. Retourne un résultat uniforme (succès ou message d’erreur lisible)

Les erreurs Zod sont converties en message utilisateur (première erreur du schéma).

---

## Brancher un envoi d'e-mail réel

Modifier la méthode **privée** `sendContactEmail` dans `contactService.ts`.

### Option A — API Route Next.js (recommandé)

1. Créer `src/app/api/contact/route.ts` qui appelle Resend / SendGrid
2. Dans `sendContactEmail`, remplacer la simulation par :

```typescript
const response = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
if (!response.ok) throw new Error("Échec d'envoi");
```

3. Stocker les clés API dans `.env.local` (jamais commitées)

### Option B — Appel direct depuis le service

Possible uniquement côté serveur. Si le service est appelé depuis un Client Component, préférer l’option A pour ne pas exposer de secrets.

### Exemples de fournisseurs

| Service | Usage typique |
|---------|----------------|
| [Resend](https://resend.com/) | API simple, bon DX avec Next.js |
| SendGrid / Mailgun | Volume plus élevé |
| Base de données | Persister les messages avant envoi |
| CRM (HubSpot, etc.) | Création de leads |

---

## Ajouter un nouveau service

1. Créer `src/services/monService.ts`
2. Définir un schéma Zod dans `src/zodSchema/` si validation nécessaire
3. Exporter une classe avec méthodes `static` et un type `*Result` cohérent
4. Documenter ici ou dans `docs/architecture.md`

---

## État actuel (simulation)

`sendContactEmail` :

- Attend 1,5 seconde (simulation réseau)
- Logue le message vers `info@acceent.org` dans la console serveur
- Simule une erreur aléatoire (~1 %) pour tester la gestion d’erreur

**À retirer en production** : la simulation d’erreur aléatoire et le délai artificiel.
