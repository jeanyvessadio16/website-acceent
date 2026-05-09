# Services

Ce dossier contient les services de l'application, responsables de la logique métier et des interactions externes.

## ContactService

Le service de gestion du formulaire de contact.

### Utilisation

```typescript
import { ContactService } from "../services/contactService";

// Dans un composant React
const handleSubmit = async (formData) => {
  const result = await ContactService.submitContactForm(formData);

  if (result.success) {
    // Succès - afficher le message de confirmation
    console.log(result.message);
    // result.data contient les données validées
  } else {
    // Erreur - afficher le message d'erreur
    console.error(result.message);
  }
};
```

### Interface

```typescript
interface ContactServiceResult {
  success: boolean;
  message: string;
  data?: ContactFormData; // Présent uniquement en cas de succès
}
```

### Méthodes

#### `submitContactForm(data: ContactFormData): Promise<ContactServiceResult>`

Valide les données du formulaire avec le schéma Zod et les envoie.

**Paramètres :**

- `data`: Les données du formulaire à valider et envoyer

**Retour :**

- `ContactServiceResult` avec le statut de l'opération

### Personnalisation

Pour connecter à une vraie API ou service d'email, modifiez la méthode `sendContactEmail` dans `contactService.ts`.

Exemples d'implémentations :

- API REST avec fetch
- Service d'email (SendGrid, Mailgun)
- Sauvegarde en base de données
- Intégration CRM

### Gestion des erreurs

Le service gère automatiquement :

- Erreurs de validation Zod (messages personnalisés)
- Erreurs réseau
- Erreurs de service externe

Toutes les erreurs sont capturées et retournées dans un format uniforme.
