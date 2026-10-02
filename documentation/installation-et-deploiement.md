# Installation et Déploiement - ACCEENT Website

Ce document fournit le guide complet pour configurer l'environnement de développement local, exécuter les migrations de base de données et déployer l'application en production.

---

## 📋 Prérequis Systemes

Pour exécuter le projet localement ou en serveur de build, vous avez besoin de :

- **Node.js** : version `20.x` LTS ou supérieure.
- **Gestionnaire de paquets** : `pnpm` (recommandé v9+), `npm` ou `yarn`.
- **Base de données** : PostgreSQL (instance locale ou hébergée sur [Supabase](https://supabase.com/)).

---

## 🔑 Variables d'Environnement

Créez un fichier `.env` (ou `.env.local`) à la racine du projet en vous basant sur la configuration ci-dessous :

```env
# Connexion Postgres via le pooler de transactions (mode pooler Supabase, IPv4)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?pgbouncer=true"

# Connexion Postgres directe (mode session, utilisé pour les migrations Prisma)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:5432/postgres"

# Supabase Public Keys (optionnel selon intégration Supabase JS client)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="[VOTRE_CLÉ_PUBLIQUE]"

# Clé secrète de signature des sessions JWT (JOSE)
SESSION_SECRET="votre_cle_secrete_super_securisee_min_32_caracteres"
```

> [!IMPORTANT]
> `SESSION_SECRET` doit être une chaîne aléatoire complexe d'au moins 32 caractères. Ne la commitez jamais dans Git.

---

## ⚙️ Procédure d'Installation en Local

### 1. Cloner le projet et installer les dépendances

```bash
git clone <repository-url>
cd acceent-website

# Installation via pnpm
pnpm install
```

### 2. Générer le client Prisma et appliquer la base de données

```bash
# Générer le client TypeScript Prisma
npx prisma generate

# Appliquer la structure du schéma sur la base de données PostgreSQL
npx prisma db push

# Configurer le bucket Supabase Storage et les politiques de sécurité (RLS)
pnpm exec tsx scripts/setup_storage_policy.ts
```

### 3. Lancer le serveur de développement

```bash
pnpm dev
```

L'application est désormais accessible à l'adresse [http://localhost:3000](http://localhost:3000). Le rechargement à chaud (Hot Module Replacement) est actif.

---

## 🛠️ Scripts NPM Disponibles

| Script | Commande | Description |
| :--- | :--- | :--- |
| `dev` | `next dev` | Démarre le serveur de développement avec Turbopack / Fast Refresh. |
| `build` | `prisma generate && next build` | Génère le client Prisma et compile l'application pour la production. |
| `start` | `next start` | Lance le serveur Web de production (après `pnpm build`). |
| `lint` | `eslint` | Vérifie la conformité du code avec les règles ESLint / Next.js. |
| `postinstall` | `prisma generate` | Exécuté automatiquement après l'installation des dépendances. |

---

## 🚀 Déploiement en Production (Vercel)

Le projet est préconfiguré pour un déploiement fluide sur **Vercel**.

### Étape 1 : Connexion du dépôt Git
1. Connectez votre compte Vercel à votre dépôt GitHub / GitLab.
2. Importez le projet `acceent-website`.

### Étape 2 : Configuration des variables d'environnement sur Vercel
Dans le tableau de bord Vercel (Project Settings > Environment Variables), ajoutez :
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SESSION_SECRET`

### Étape 3 : Commande de Build Vercel
Vercel exécutera automatiquement le script de build configuré dans `package.json` :
```bash
prisma generate && next build
```

---

## 🔍 Migration de Base de Données en Production

Si vous apportez des modifications au fichier `prisma/schema.prisma` :

1. En développement :
   ```bash
   npx prisma migrate dev --name nom_de_la_migration
   ```
2. Avant déploiement en production :
   ```bash
   npx prisma migrate deploy
   ```
