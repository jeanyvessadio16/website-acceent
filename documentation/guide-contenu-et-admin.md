# Guide de Gestion du Contenu et d'Administration - ACCEENT Website

Ce document s'adresse aux administrateurs, rédacteurs et équipes de communication pour la mise à jour des contenus du site (statiques et dynamiques).

---

## 1. 📁 Gestion du Contenu Statique (`src/data/`)

Le contenu principal du site vitrine est structuré sous forme de données TypeScript dans le dossier [src/data](file:///c:/ACCEENT/acceent-website/src/data). Cela permet des mises à jour rapides sans toucher à la structure des composants HTML/React.

### Carte des Fichiers de Contenu

| Élément du site | Fichier source |
| :--- | :--- |
| **Domaines d'intervention (Accueil)** | [src/data/list-domaines.ts](file:///c:/ACCEENT/acceent-website/src/data/list-domaines.ts) |
| **Programmes Éducation** | [src/data/education/programes-education.ts](file:///c:/ACCEENT/acceent-website/src/data/education/programes-education.ts) |
| **Programmes Entrepreneuriat** | [src/data/entreprenariat/programmes-entreprenariat.ts](file:///c:/ACCEENT/acceent-website/src/data/entreprenariat/programmes-entreprenariat.ts) |
| **Programmes Numérique** | [src/data/numerique/programmes-numerique.ts](file:///c:/ACCEENT/acceent-website/src/data/numerique/programmes-numerique.ts) |
| **Détails Programme ACCEENT4ELLES** | [src/data/education/acceentElles.ts](file:///c:/ACCEENT/acceent-website/src/data/education/acceentElles.ts) |
| **Détails Programme WRO** | [src/data/numerique/wroAction.ts](file:///c:/ACCEENT/acceent-website/src/data/numerique/wroAction.ts) |
| **Liste des Partenaires** | [src/data/partenaires.ts](file:///c:/ACCEENT/acceent-website/src/data/partenaires.ts) |
| **Liens Footer & Réseaux Sociaux** | [src/data/footer/programmes.ts](file:///c:/ACCEENT/acceent-website/src/data/footer/programmes.ts) & [link-media.ts](file:///c:/ACCEENT/acceent-website/src/data/footer/link-media.ts) |

---

### Exemple : Ajouter ou Éditer un Programme

Pour ajouter un nouveau programme dans le domaine Numérique :

1. Déposez l'image d'illustration dans `public/images/` (nom sans espaces, format `.webp` ou `.jpg`).
2. Ouvrez [src/data/numerique/programmes-numerique.ts](file:///c:/ACCEENT/acceent-website/src/data/numerique/programmes-numerique.ts).
3. Ajoutez une entrée dans le tableau :

```typescript
{
  id: 4,
  nom: "Nouveau Programme Numérique",
  description: "Description courte du programme affichée sur la carte.",
  image: "/images/nouveau-programme.webp",
  page: "/numerique/nouveau-programme", // Ou lien externe complet "https://..."
}
```

---

## 2. 🖼️ Gestion des Images et Medias

Toutes les images statiques doivent être placées dans le dossier `public/` :

- **Photos de programmes et bannières** : `public/images/`
- **Logos ACCEENT et icônes** : `public/logo/`

### Bonnes Pratiques Images
- **Format conseillé** : WebP ou JPEG optimisé.
- **Poids maximal** : < 300 Ko par image.
- **Noms de fichiers** : En minuscules, séparés par des tirets (ex. `wro-ziguinchor-2026.webp`).

---

## 3. 🔑 Espace d'Administration (`/admin`)

Le site dispose d'un espace d'administration accessible aux utilisateurs ayant le rôle `ADMIN` ou `AUTHOR`.

### Connexion à l'Admin
1. Rendez-vous sur `/auth/login`.
2. Connectez-vous avec vos identifiants administrateur.
3. Vous serez automatiquement redirigé vers l'URL `/admin`.

### Fonctionnalités Admin
- **Gestion des Articles (`Post`)** :
  - **Accès par ID** : Chaque article est désormais accessible publiquement via son identifiant unique (`/actualites/[id]`). Il n'est plus nécessaire d'inventer ni de gérer des slugs manuellement dans les formulaires.
  - **Téléversement Automatique d'Images (Supabase Storage)** : Les modales de création et d'édition incluent un sélecteur d'image interactif (`ImageUploader`). Lors du choix d'un fichier (PNG, JPG, WebP jusqu'à 10 Mo), l'image est automatiquement envoyée vers le bucket Supabase `news-images`.
  - **Verrouillage de l'URL** : L'URL publique générée par Supabase s'insère automatiquement dans le champ d'URL et est verrouillée en lecture seule pour éviter toute altération accidentelle. Un bouton *« Effacer »* ou *« Changer l'image »* permet de réinitialiser si besoin.
  - **Publication / Brouillon** : Publication immédiate ou basculement en brouillon depuis la liste en un clic.
- **Gestion des Utilisateurs (`User`)** *(Rôle ADMIN uniquement)* :
  - Modification des rôles (`USER`, `AUTHOR`, `ADMIN`).
  - Gestion des comptes utilisateurs enregistrés.

---

## 4. 📬 Formulaire de Contact & Coordonnées

### Coordonnées affichées sur le site
Les informations de contact (téléphone, adresse à Santhiaba Ziguinchor, e-mail) sont définies dans :
- [src/components/shared/Contact.tsx](file:///c:/ACCEENT/acceent-website/src/components/shared/Contact.tsx)
- [src/components/layout/Footer.tsx](file:///c:/ACCEENT/acceent-website/src/components/layout/Footer.tsx)

### Traitement des messages
Le service de réception du formulaire de contact est localisé dans [src/services/contactService.ts](file:///c:/ACCEENT/acceent-website/src/services/contactService.ts). Lors de la mise en place d'un service d'envoi d'e-mails réels (Resend / SendGrid / Nodemailer), la logique sera connectée dans ce service.
