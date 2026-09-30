# Documentation Officielle - ACCEENT Website

Bienvenue dans la documentation officielle du projet **ACCEENT Website** (*Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires*).

Ce dossier regroupe l'ensemble des guides techniques, d'architecture, de sécurité, de gestion de contenu et d'installation nécessaires pour maintenir, faire évoluer et déployer la plateforme.

---

## 📚 Sommaire de la documentation

| Document | Description |
| :--- | :--- |
| 🏗️ [Architecture Technique](file:///c:/ACCEENT/acceent-website/documentation/architecture-technique.md) | Vue d'ensemble de la stack (Next.js 16 App Router, RSC, Tailwind CSS 4, Prisma ORM, Supabase, JWT JOSE). |
| 🚀 [Installation et Déploiement](file:///c:/ACCEENT/acceent-website/documentation/installation-et-deploiement.md) | Guide pas-à-pas pour l'installation locale, la configuration des variables d'environnement, les migrations Prisma et le déploiement en production. |
| 🔒 [Base de Données et Sécurité](file:///c:/ACCEENT/acceent-website/documentation/base-de-donnees-et-securite.md) | Modèle de données PostgreSQL, rôles d'accès (`USER`, `AUTHOR`, `ADMIN`), sessions JWT HTTP-only et middleware de protection des routes. |
| 📝 [Guide de Gestion du Contenu et Admin](file:///c:/ACCEENT/acceent-website/documentation/guide-contenu-et-admin.md) | Guide pour éditer les contenus statiques (`src/data/`), ajouter des programmes et utiliser le tableau de bord administrateur (`/admin`). |
| ⚙️ [API & Server Actions](file:///c:/ACCEENT/acceent-website/documentation/api-et-server-actions.md) | Documentation des Server Actions (`src/actions`), des schémas de validation Zod et des services métier. |

---

## ⚡ Aperçu Rapide de la Stack Technique

- **Framework Front & Back** : [Next.js 16 (App Router)](https://nextjs.org/)
- **Bibliothèque UI** : [React 19](https://react.dev/)
- **Langage** : [TypeScript 5](https://www.typescriptlang.org/)
- **ORM & Base de Données** : [Prisma 7](https://www.prisma.io/) + [PostgreSQL (Supabase)](https://supabase.com/)
- **Styles & Composants** : [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Authentification & Session** : Server Actions + `jose` (JWT) + Cookies `httpOnly`
- **Validation** : [Zod 4](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)

---

## 📍 Localisation des fichiers clés

- **Entrée principale** : [src/app/(main)/page.tsx](file:///c:/ACCEENT/acceent-website/src/app/(main)/page.tsx)
- **Schéma Prisma** : [prisma/schema.prisma](file:///c:/ACCEENT/acceent-website/prisma/schema.prisma)
- **Middleware de Sécurité** : [src/middleware.ts](file:///c:/ACCEENT/acceent-website/src/middleware.ts)
- **Gestion des Sessions** : [src/lib/session.ts](file:///c:/ACCEENT/acceent-website/src/lib/session.ts)
- **Données Statiques** : [src/data](file:///c:/ACCEENT/acceent-website/src/data)
