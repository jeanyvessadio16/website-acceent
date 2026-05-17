# Architecture technique

Ce document décrit les choix d’architecture du site ACCEENT pour les développeurs qui rejoignent ou maintiennent le projet.

---

## Vue d’ensemble

Le site est une **application Next.js full-stack légère** : pas de base de données ni d’API Routes pour l’instant. Le contenu est **statique** (fichiers TypeScript dans `src/data/`), le rendu privilégie les **React Server Components (RSC)** et l’interactivité est limitée aux îlots client (`"use client"`).

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  src/data/   │────►│  app/**/page    │────►│  HTML (RSC)  │
└──────────────┘     └────────┬────────┘     └──────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  components/    │
                     │  layout + shared│
                     └─────────────────┘
```

---

## App Router (Next.js)

### Layout racine

`src/app/layout.tsx` enveloppe toutes les pages :

- Import de `globals.css` et de la police Inter
- `Header` fixe en haut de page
- `<main>{children}</main>`
- `Footer` en bas

Les pages n’ont pas à réimporter Header/Footer.

### Groupes de routes

| Groupe | Rôle |
|--------|------|
| `(programme)` | Pages « hub » listant les programmes d’un domaine |
| `(education)` | Fiches programmes éducation |
| `(entreprenariat)` | Fiches programmes entrepreneuriat |
| `(numerique)` | Fiches programmes numérique |

Les parenthèses indiquent un **segment de layout optionnel sans impact URL** — uniquement de l’organisation.

### Fichiers spéciaux

| Fichier | Rôle |
|---------|------|
| `loading.tsx` | UI de chargement (Suspense boundary) |
| `not-found.tsx` | Page 404 personnalisée |

---

## Couches du code

### 1. Données (`src/data/`)

Fichiers exportant des tableaux ou objets constants. Pas de fetch réseau.

**Convention de nommage :** plusieurs fichiers utilisent `programes*` (orthographe historique du projet) — conserver la cohérence lors d’ajouts.

**Fichiers clés :**

| Fichier | Usage |
|---------|--------|
| `list-domaines.ts` | Cartes domaines sur l’accueil |
| `education/programes-education.ts` | Liste programmes éducation |
| `entreprenariat/programmes-entreprenariat.ts` | Liste entrepreneuriat |
| `numerique/programmes-numerique.ts` | Liste numérique |
| `partenaires.ts` | Carrousel partenaires |
| `footer/programmes.ts` | Liens footer |
| `footer/link-media.ts` | Réseaux sociaux |

Les pages détaillées (ex. `acceentElles.ts`, `wroAction.ts`) contiennent le contenu long format d’une fiche programme.

### 2. Pages (`src/app/`)

- Exportent `metadata` pour le SEO quand nécessaire.
- Composent l’UI à partir de composants `shared/` et de données importées.
- Restent des **Server Components** sauf besoin explicite de hooks ou d’événements navigateur.

### 3. Composants

#### `components/layout/`

| Composant | Type | Responsabilité |
|-----------|------|----------------|
| `Header.tsx` | Client | Navigation desktop/mobile, menu programmes |
| `Footer.tsx` | Server | Pied de page, liens, contact |
| `ProgrammeLayout.tsx` | Server | Hero image + zone contenu (pages programmes anciennes) |

#### `components/shared/`

| Composant | Type | Responsabilité |
|-----------|------|----------------|
| `HeaderLayout.tsx` | Server | En-tête gradient pour pages intérieures (about, hubs) |
| `Contact.tsx` | Client | Formulaire + coordonnées |
| `Partenaires.tsx` | Server | Bandeau partenaires (marquee CSS) |
| `alerts/*` | Client | Dialog succès, bannière erreur formulaire |

#### `components/ui/`

Composants **shadcn/ui** générés et personnalisables : `button`, `card`, `input`, `dialog`, etc. Ne pas modifier la structure Radix sans besoin ; préférer les variants et `className`.

### 4. Services (`src/services/`)

Logique métier **sans dépendance React**. Actuellement : `ContactService` uniquement.

Pattern recommandé pour de futurs services :

```typescript
export class MonService {
  static async action(payload: Input): Promise<Result> {
    try {
      const valid = schema.parse(payload);
      await this.executer(valid);
      return { success: true, message: "…" };
    } catch (error) {
      return { success: false, message: "…" };
    }
  }
}
```

### 5. Validation (`src/zodSchema/`)

Schémas Zod partagés entre service et (optionnellement) formulaire. Le type inféré `ContactFormData` évite la duplication de types.

### 6. Types (`src/types/`)

Interfaces TypeScript pour structures réutilisées (ex. `Partenaire`).

---

## Alias de chemins

`tsconfig.json` définit :

```json
"@/*": ["./src/*"]
```

Exemple : `import { Button } from "@/components/ui/button"`.

---

## Server vs Client

| Critère | Server Component | Client Component |
|---------|------------------|------------------|
| Directive | Aucune (défaut) | `"use client"` en tête de fichier |
| Hooks React | Non | Oui (`useState`, `useForm`, etc.) |
| Événements DOM | Non | Oui |
| Import depuis client | Possible (enfant client) | Ne pas importer un Server Component |

**Règle pratique :** pousser `"use client"` le plus bas possible dans l’arbre (feuilles interactives).

---

## Images

Utiliser `next/image` pour les images locales dans `public/` :

```tsx
<Image src="/images/exemple.jpg" alt="Description" fill className="object-cover" />
```

- Placer les assets dans `public/images/` ou `public/logo/`.
- Renseigner un `alt` descriptif pour l’accessibilité.
- `priority` sur le logo du header (LCP).

---

## Accessibilité

Pratiques déjà en place à étendre :

- `aria-label` sur le logo et le menu mobile
- `aria-expanded` / `aria-controls` sur le bouton menu
- `aria-invalid` sur les champs en erreur
- `prefers-reduced-motion` pour le carrousel partenaires (`globals.css`)

---

## Évolutions prévues (non implémentées)

| Besoin | Approche suggérée |
|--------|-------------------|
| Envoi e-mail réel | API Route `app/api/contact/route.ts` + Resend / Nodemailer |
| CMS | Contentlayer, Sanity ou MDX dans `content/` |
| i18n | `next-intl` ou segments `[locale]` |
| Analytics | Plausible / GA via `next/script` dans `layout.tsx` |
| Tests | Vitest + Testing Library pour services et composants critiques |

---

## Ajouter un composant shadcn

```bash
npx shadcn@latest add dialog
```

La configuration (`components.json`) pointe vers `src/components/ui` et `src/lib/utils.ts`.

---

## Dépendances notables

- **`bcryptjs`** : présent dans `package.json` mais non utilisé dans le code actuel — réservé à une future authentification admin ou peut être retiré si inutile.
- **`radix-ui`** : primitives pour les composants shadcn.

Pour toute question sur le formulaire de contact, voir [../src/services/README.md](../src/services/README.md).
