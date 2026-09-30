# Architecture Technique - ACCEENT Website

Ce document détaille l'architecture logicielle, l'organisation des répertoires et les choix techniques retenus pour l'application **ACCEENT Website**.

---

## 🏗️ Vue d'Ensemble de la Stack

Le projet s'appuie sur une architecture **Full-Stack moderne avec Next.js 16 (App Router)** et **React 19**, offrant des performances élevées grâce au rendu serveur (RSC) et une sécurité renforcée via des Server Actions typées.

```
┌──────────────────────────────────────────────────────────────────┐
│                      Navigateur Client                           │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                  HTTP / HTTPS (Cookies HTTP-Only)
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│                       Middleware Next.js                         │
│                    (src/middleware.ts)                           │
│           - Contrôle d'accès par rôle (JWT JOSE)                 │
└─────────┬──────────────────────────────────────────────┬─────────┘
          │                                              │
┌─────────▼─────────────────────────┐          ┌─────────▼─────────┐
│        Pages Publics (RSC)        │          │   Pages Admin/    │
│            (main)                 │          │    Dashboard      │
└─────────┬─────────────────────────┘          └─────────┬─────────┘
          │                                              │
          ▼                                              ▼
┌───────────────────────────────────┐          ┌───────────────────┐
│     Données Statiques (TS)        │          │  Server Actions   │
│           src/data/               │          │   (src/actions/)  │
└───────────────────────────────────┘          └─────────┬─────────┘
                                                         │
                                              ┌──────────▼─────────┐
                                              │ Prisma ORM Client  │
                                              │ (src/lib/prisma.ts)│
                                              └──────────┬─────────┘
                                                         │
                                              ┌──────────▼─────────┐
                                              │ Base de données    │
                                              │ PostgreSQL Supabase│
                                              └────────────────────┘
```

---

## 📁 Structure des Répertoires

```
acceent-website/
├── documentation/               # Documentation officielle du projet
├── prisma/                      # Schéma Prisma et migrations PostgreSQL
│   ├── schema.prisma
│   └── migrations/
├── public/                      # Ressources statiques (images, logos, favicon)
│   ├── images/
│   └── logo/
├── src/
│   ├── actions/                 # Server Actions (auth, post, user)
│   ├── app/                     # Routes Next.js (App Router)
│   │   ├── (main)/              # Groupe de routes publiques (Accueil, About, Programmes...)
│   │   ├── admin/               # Espace d'administration (ADMIN & AUTHOR)
│   │   ├── api/                 # Endpoints d'API internes
│   │   ├── auth/                # Pages d'authentification (login, register)
│   │   ├── dashboard/           # Espace membre utilisateur (USER)
│   │   ├── globals.css          # Styles globaux et variables CSS Tailwind v4
│   │   └── layout.tsx           # Layout racine avec polices et métadonnées
│   ├── components/              # Composants UI React
│   │   ├── layout/              # Header, Footer, Navigation
│   │   ├── shared/              # Composants partagés (Contact, Partenaires...)
│   │   └── ui/                  # Composants atomiques shadcn/ui
│   ├── data/                    # Fichiers de données statiques (Programmes, Domaines...)
│   ├── hooks/                   # Hooks React personnalisés
│   ├── lib/                     # Utilitaires (prisma, session, supabase, seo, utils)
│   ├── middleware.ts            # Middleware de protection et gestion des sessions JWT
│   ├── services/                # Services métier (ContactService...)
│   ├── types/                   # Interfaces et types TypeScript partagés
│   ├── utils/                   # Helpers utilitaires
│   └── validation/              # Schémas de validation Zod
├── .env                         # Variables d'environnement (Secret, Database URL)
├── next.config.ts               # Configuration Next.js
├── package.json                 # Dépendances et scripts
└── tsconfig.json                # Configuration TypeScript
```

---

## ⚡ Organisation des Routes Next.js

L'application utilise les **Route Groups** de Next.js `(nom)` pour organiser logiquement les vues sans modifier la structure des URLs :

1. **`(main)`** : Le site vitrine public.
   - `/` : Page d'accueil.
   - `/about` : À propos d'ACCEENT.
   - `/education`, `/entreprenariat`, `/numerique` : Hubs des 3 domaines d'intervention.
   - Sub-routes pour chaque programme (ex. `/education/acceent-elles`, `/numerique/wro`).
2. **`auth/`** : Authentification.
   - `/auth/login` : Page de connexion.
   - `/auth/register` : Page d'inscription.
3. **`admin/`** : Espace d'administration réservé aux rôles `ADMIN` et `AUTHOR`.
   - Dashboard de gestion des articles et des utilisateurs.
4. **`dashboard/`** : Espace client/membre réservé aux utilisateurs connectés (`USER`).

---

## 🛡️ Modèle Server vs Client Components

- **Server Components (par défaut)** :
  - Utilisés pour toutes les pages d'affichage de contenu, SEO et layouts.
  - Avantages : Zéro JavaScript envoyé au client pour la structure, accès sécurisé aux ressources serveur.
- **Client Components (`"use client"`)** :
  - Restreints aux îlots d'interactivité (formulaires React Hook Form, bannières d'alerte, menus mobiles interactifs, animations Framer Motion).
  - Placés au niveau le plus bas de l'arbre de composants (feuilles de l'arbre UI).

---

## 🎨 Design System et Styles

- **Tailwind CSS 4** : Configuration via `@import "tailwindcss";` dans [src/app/globals.css](file:///c:/ACCEENT/acceent-website/src/app/globals.css).
- **shadcn/ui & Radix UI** : Composants accessibles et hautement personnalisables installés dans `src/components/ui/` (`button`, `dialog`, `input`, `card`, etc.).
- **Icons** : `lucide-react` pour les icônes vectorielles légères.
- **Animations** : Transitions CSS fluides et animations Framer Motion pour le dynamic display.

---

## 🔗 Aliases d'Importation

Le projet utilise des alias de chemins définis dans `tsconfig.json` :

```json
"@/*": ["./src/*"]
```

Exemple d'importation :
```typescript
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
```
