# Architecture Technique — ACCEENT Website

Application web officielle de l'association **ACCEENT** (*Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires*), basée à Ziguinchor (Sénégal).

---

## 1. Stack Technique

- **Framework** : Next.js 16 (App Router, Turbopack, Server Components, Server Actions, Proxy Next 16)
- **UI** : React 19, TypeScript (`strict: true`), Tailwind CSS v4, Lucide Icons, Radix UI / shadcn
- **Base de données** : PostgreSQL (Supabase Pooler) avec Prisma 7 (`@prisma/adapter-pg` + pool `pg` borné)
- **Authentification** : JWT HS256 signé via `jose` dans un cookie `HttpOnly` (`acceent_session`), hachage des mots de passe avec `bcryptjs` (coût 12)
- **Stockage médias & documents** : Supabase Storage (`news-images`, `documents`)
- **Validation & Sécurité** : Schémas Zod v4, rate-limiter en mémoire par fenêtre glissante, journalisation structurée et pistes d'audit en base (`audit_logs`)
- **Tests** : `tsx --test` avec `node:test` et `node:assert/strict`

---

## 2. Organisation en Couches (`src/`)

```text
src/
├── proxy.ts                   # Point d'entrée réseau Next.js 16 (SEO 301 + RBAC Fail-Closed)
├── app/
│   ├── (main)/                # Vitrine publique (Accueil, Pôles, Actualités, Événements, Contact)
│   ├── auth/                  # Connexion, Inscription, Mot de passe oublié / Réinitialisation
│   ├── dashboard/             # Portail Membre (Programmes, Candidatures, Événements, Ressources, Profil)
│   ├── admin/                 # Back-office & Cockpit (Articles, Événements, Ressources, Candidatures, Utilisateurs, Newsletter, Partenaires, Audit)
│   ├── api/                   # Endpoints HTTP (health, logout POST, export CSV émargement, désinscription newsletter)
│   └── global-error.tsx       # Filet d'erreur global
├── actions/                   # Server Actions (orchestration validation + RBAC + DB + audit + revalidation)
├── repositories/              # Accès Prisma pur, projections sans fuite de secrets, DTOs prêts pour le rendu
├── services/                  # Intégrations externes (Supabase Storage, Resend Email, Web3Forms)
├── validation/                # Schémas Zod v4 réutilisables (client & serveur)
├── lib/
│   ├── core/                  # Infrastructure transverse (logger, result, auth-guard, rate-limit, audit, request, strings)
│   ├── constants/             # Référentiel des programmes, catégories, statuts et helpers de sécurité (isSafeUrl, escapeCsvCell)
│   ├── env.ts                 # Validation paresseuse des variables d'environnement (Serveur & Public)
│   ├── prisma.ts              # Singleton Pool PostgreSQL + PrismaClient (limites mémoire et idle timeouts)
│   ├── seo.ts                 # Métadonnées SEO, GEO et sitemap
│   └── session.ts             # Création, signature et vérification des cookies de session JWT
└── components/                # Composants React classés par domaine (actualites, admin, auth, dashboard, events, layout, seo, shared, ui)
```

---

## 3. Contrôle d'Accès (RBAC) & Sécurité

L'accès est vérifié systématiquement à **trois niveaux** :

1. **Niveau Proxy (`src/proxy.ts`)** :
   - Redirection 301 SEO de `*.vercel.app` vers `https://acceent.org`.
   - Politique *Fail-Closed* sur `/admin` et `/dashboard`.
   - Restriction des routes de pilotage (`/admin/utilisateurs`, `/admin/candidatures`, `/admin/partenaires`, `/admin/newsletter`, `/admin/audit`) au rôle `ADMIN`.
2. **Niveau Layout / Page Serveur** :
   - Vérification `getSession()` + rôle dans `src/app/admin/layout.tsx`, `src/app/dashboard/layout.tsx` et chaque page d'administration stricte.
3. **Niveau Server Actions & API Routes** :
   - Gardes centralisées `requireSession()`, `requireAdmin()`, `requireAuthorOrAdmin()`, `canManageOwnedResource()`.
   - Anti-IDOR : un `AUTHOR` ne peut modifier ou supprimer que ses propres articles, événements et ressources.
   - Rate-limiting sur `loginAction`, `registerAction`, `requestPasswordResetAction`, `submitApplicationAction` et `subscribeNewsletterAction`.
   - Déconnexion verrouillée sur `POST /api/auth/logout` (protection CSRF).
   - En-têtes HTTP renforcés dans `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Permissions-Policy`).
   - Traçabilité des mutations sensibles dans `audit_logs`, consultable sur `/admin/audit`.

---

## 4. Observabilité & Exploitation

- **Health Check** : `GET /api/health` exécute `SELECT 1` sur PostgreSQL, mesure la latence DB et vérifie la disponibilité des variables Storage / E-mail (`200 ok` ou `503 degraded`).
- **Logs structurés** : `logger.info | warn | error` émet du JSON structuré en production (`NODE_ENV=production`) et un format lisible en développement.
- **Variables d'environnement** : listées et documentées dans `.env.example`.

---

## 5. Commandes de Vérification

```powershell
npx prisma db push          # Synchronise le schéma avec PostgreSQL
npx prisma generate         # Régénère le client Prisma
npm run test                # Exécute les tests unitaires (tests/*.test.ts)
npm run typecheck           # Vérifie TypeScript strict (tsc --noEmit)
npm run build               # Compile le build de production Next.js
```
