# Site web ACCEENT

Site vitrine officiel de **ACCEENT** (*Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires*), association sénégalaise basée à Ziguinchor (quartier Santhiaba).

Ce dépôt contient le code source du site public : présentation des domaines d'intervention (éducation, entrepreneuriat, numérique), catalogue des programmes, page à propos, partenaires et formulaire de contact.

---

## Table des matières

- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation et démarrage](#installation-et-démarrage)
- [Scripts npm](#scripts-npm)
- [Structure du projet](#structure-du-projet)
- [Cartographie des routes](#cartographie-des-routes)
- [Architecture applicative](#architecture-applicative)
- [Ajouter ou modifier du contenu](#ajouter-ou-modifier-du-contenu)
- [Formulaire de contact](#formulaire-de-contact)
- [Design system et styles](#design-system-et-styles)
- [Référencement (SEO)](#référencement-seo)
- [Déploiement](#déploiement)
- [Documentation complémentaire](#documentation-complémentaire)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Langage | [TypeScript 5](https://www.typescriptlang.org/) |
| Styles | [Tailwind CSS 4](https://tailwindcss.com/) |
| Composants | [shadcn/ui](https://ui.shadcn.com/) (Radix UI) |
| Formulaires | [React Hook Form](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) |
| Icônes | [Lucide React](https://lucide.dev/) |
| Police | Inter (Google Fonts) |

Le projet est configuré pour **pnpm** (voir `pnpm-lock.yaml`). npm et yarn fonctionnent également.

---

## Prérequis

- **Node.js** 20 L ou version supérieure recommandée
- **pnpm** 9+ (recommandé) ou npm / yarn

---

## Installation et démarrage

```bash
# Cloner le dépôt (adapter l'URL selon votre remote)
git clone <url-du-repo>
cd acceent-website

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur. Les modifications dans `src/` sont rechargées automatiquement (Fast Refresh).

### Build de production

```bash
pnpm build    # Compilation optimisée
pnpm start    # Serveur de production (après build)
```

### Qualité du code

```bash
pnpm lint     # ESLint (config Next.js)
```

---

## Scripts npm

| Script | Description |
|--------|-------------|
| `dev` | Serveur de développement Next.js |
| `build` | Build de production |
| `start` | Démarre le serveur sur le build généré |
| `lint` | Analyse statique avec ESLint |

---

## Structure du projet

```
acceent-website/
├── public/                 # Assets statiques (images, logos, SVG)
│   ├── images/
│   └── logo/
├── src/
│   ├── app/                # Routes Next.js (App Router)
│   │   ├── layout.tsx      # Layout racine (Header, Footer, métadonnées)
│   │   ├── page.tsx        # Page d'accueil
│   │   ├── globals.css     # Tokens Tailwind, utilitaires globaux
│   │   ├── (programme)/    # Pages hub par domaine
│   │   ├── (education)/    # Pages programmes éducation
│   │   ├── (entreprenariat)/
│   │   └── (numerique)/
│   ├── components/
│   │   ├── layout/         # Header, Footer, ProgrammeLayout
│   │   ├── shared/         # Contact, Partenaires, HeaderLayout, alertes
│   │   └── ui/             # Composants shadcn (Button, Card, Input…)
│   ├── data/               # Contenu statique (programmes, footer, partenaires)
│   ├── services/           # Logique métier (ex. contact)
│   ├── types/              # Types TypeScript partagés
│   ├── zodSchema/          # Schémas de validation Zod
│   └── lib/
│       └── utils.ts        # Utilitaire `cn()` (clsx + tailwind-merge)
├── components.json         # Configuration shadcn/ui
├── next.config.ts
├── tsconfig.json           # Alias `@/*` → `./src/*`
└── package.json
```

Les **groupes de routes** entre parenthèses — `(programme)`, `(education)`, etc. — n’apparaissent pas dans l’URL. Ils servent uniquement à organiser les fichiers.

---

## Cartographie des routes

### Pages principales

| URL | Fichier | Description |
|-----|---------|-------------|
| `/` | `src/app/page.tsx` | Accueil (hero, domaines, partenaires, contact) |
| `/about` | `src/app/about/page.tsx` | Présentation de l'association |
| `/contact` | `src/app/contact/page.tsx` | Formulaire de contact dédié |

### Hubs par domaine

| URL | Fichier | Données |
|-----|---------|---------|
| `/education` | `src/app/(programme)/education/page.tsx` | `src/data/education/programes-education.ts` |
| `/entreprenariat` | `src/app/(programme)/entreprenariat/page.tsx` | `src/data/entreprenariat/programmes-entreprenariat.ts` |
| `/numerique` | `src/app/(programme)/numerique/page.tsx` | `src/data/numerique/programmes-numerique.ts` |

### Programmes — Éducation

| URL | Fichier |
|-----|---------|
| `/acceent-elles` | `src/app/(education)/acceent-elles/page.tsx` |
| `/tut-tank` | `src/app/(education)/tut-tank/page.tsx` |

### Programmes — Entrepreneuriat

| URL | Fichier |
|-----|---------|
| `/acceent-incub` | `src/app/(entreprenariat)/acceent-incub/page.tsx` |
| `/atelier-entreprenariat` | `src/app/(entreprenariat)/atelier-entreprenariat/page.tsx` |
| `/forum-entrepreneur` | `src/app/(entreprenariat)/forum-entrepreneur/page.tsx` |

### Programmes — Numérique

| URL | Fichier |
|-----|---------|
| `/wro` | `src/app/(numerique)/wro/page.tsx` |
| `/ia` | `src/app/(numerique)/ia/page.tsx` |

> **Note :** certains liens du catalogue (ex. YAAKAAR) pointent vers des URLs externes définies dans les fichiers `data/`.

---

## Architecture applicative

```
┌─────────────────────────────────────────────────────────┐
│  app/layout.tsx                                         │
│  Header (fixe) + <main>{children}</main> + Footer         │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Pages serveur        Composants client    Fichiers data
   (RSC par défaut)     ("use client")       (contenu TS)
        │                   │
        │              Contact.tsx
        │                   │
        │              ContactService
        │                   │
        └──────────► zodSchema/contact.ts
```

- **Server Components** : pages dans `app/`, métadonnées `export const metadata`, rendu côté serveur par défaut.
- **Client Components** : navigation mobile (`Header`), formulaire (`Contact`), dialogues d’alerte.
- **Contenu** : centralisé dans `src/data/` pour limiter les changements dans le JSX des pages.

Voir [docs/architecture.md](docs/architecture.md) pour le détail des patterns et conventions.

---

## Ajouter ou modifier du contenu

### Nouveau programme sur une page hub

1. Ajouter une entrée dans le fichier data du domaine concerné, par exemple :

```typescript
// src/data/education/programes-education.ts
{
  id: 3,
  nom: "Mon programme",
  description: "Description courte affichée sur la carte.",
  image: "/images/mon-programme.jpg",  // placer l'image dans public/images/
  page: "/mon-programme",
}
```

2. Créer la page : `src/app/(education)/mon-programme/page.tsx`.
3. Mettre à jour le footer si besoin : `src/data/footer/programmes.ts`.
4. Ajouter l’image dans `public/images/`.

### Domaines sur la page d'accueil

Modifier `src/data/list-domaines.ts` (cartes « Nos domaines d'intervention »).

### Partenaires

Modifier `src/data/partenaires.ts` (type `Partenaire` dans `src/types/partenaires.ts`). Les logos vont dans `public/`.

Guide détaillé : [docs/guide-contenu.md](docs/guide-contenu.md).

---

## Formulaire de contact

Le composant `Contact` (`src/components/shared/Contact.tsx`) est réutilisé sur l’accueil (`/#contact`) et sur `/contact`.

**Flux :**

1. Saisie utilisateur → React Hook Form
2. Soumission → `ContactService.submitContactForm()`
3. Validation Zod (`src/zodSchema/contact.ts`)
4. Envoi simulé via `sendContactEmail()` (à brancher sur une vraie API)

**Champs validés :**

| Champ | Règles |
|-------|--------|
| `nomComplet` | 3–100 caractères, lettres/espaces/tirets/apostrophes |
| `email` | Format email valide, max 254 caractères |
| `message` | 20–1000 caractères |

Pour connecter un service d’e-mail (Resend, SendGrid, API Route Next.js, etc.), modifier la méthode privée `sendContactEmail` dans `src/services/contactService.ts`.

Documentation du service : [src/services/README.md](src/services/README.md).

---

## Design system et styles

- **Tokens CSS** : variables dans `src/app/globals.css` (`@theme inline`, couleurs primary/secondary).
- **Classes utilitaires** : `.section-container`, `.section-padding`, `.section-heading`, `.text-fluid-h1`, etc.
- **Composants UI** : ajout via shadcn — `npx shadcn@latest add <component>` (config dans `components.json`).
- **Utilitaire** : `cn()` dans `src/lib/utils.ts` pour fusionner les classes Tailwind.

Couleur d’identité principale (violet ACCEENT) : définie via les variables `--primary` dans `globals.css`.

---

## Référencement (SEO)

- Métadonnées globales : `src/app/layout.tsx` (`title`, `description`).
- Page d’accueil : métadonnées enrichies (keywords, Open Graph) dans `src/app/page.tsx`.
- Pages internes : `export const metadata` dans chaque `page.tsx`.

**À vérifier avant mise en production :**

- `lang` sur `<html>` (actuellement `en` — envisager `fr` pour le public cible).
- URL canonique et `openGraph.url` alignées sur le domaine final (`https://acceent.org`).
- Images Open Graph accessibles en HTTPS.

---

## Déploiement

Le projet est compatible avec [Vercel](https://vercel.com) (recommandé pour Next.js) ou tout hébergeur supportant Node.js.

```bash
pnpm build
```

Variables d’environnement : aucune obligatoire pour le site statique actuel. Dès qu’un envoi d’e-mail ou une API externe sera branché, documenter les clés dans un fichier `.env.local` (non versionné, voir `.gitignore`).

Exemple de variables futures :

```env
# .env.local (exemple — ne pas committer)
RESEND_API_KEY=
CONTACT_TO_EMAIL=info@acceent.org
```

---

## Documentation complémentaire

| Document | Public cible |
|----------|----------------|
| [docs/architecture.md](docs/architecture.md) | Développeurs — patterns, composants, conventions |
| [docs/guide-contenu.md](docs/guide-contenu.md) | Équipe contenu — programmes, images, footer |
| [src/services/README.md](src/services/README.md) | Intégration API / e-mail du formulaire |

---

## Contact projet

- **Site :** [acceent.org](https://acceent.org)
- **E-mail :** info@acceent.org
- **Adresse :** Quartier Santhiaba, Ziguinchor, Sénégal
- **Téléphone :** +221 76 141 70 70

---

## Licence

Projet privé (`"private": true` dans `package.json`). Tous droits réservés à ACCEENT sauf mention contraire.
