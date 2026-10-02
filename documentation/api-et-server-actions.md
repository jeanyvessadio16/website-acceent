# API & Server Actions - ACCEENT Website

Ce document décrit la couche API et les **Server Actions** de Next.js utilisées pour la logique serveur, les interactions avec la base de données et la gestion de la sécurité.

---

## ⚙️ Architecture des Server Actions

Les Server Actions remplacent les routes API traditionnelles pour la gestion des mutations de données et de formulaires dans l'application. Elles s'exécutent exclusivement côté serveur, garantissant la sécurité des données et des clés secrètes.

Toutes les Server Actions sont regroupées dans le répertoire [src/actions](file:///c:/ACCEENT/acceent-website/src/actions).

```
src/actions/
├── auth/
│   ├── index.ts          # Point d'entrée exportant les actions auth
│   ├── login.ts          # Action de connexion (loginAction)
│   ├── logout.ts         # Action de déconnexion (logoutAction)
│   └── register.ts       # Action d'inscription (registerAction)
├── post/
│   └── index.ts          # Actions CRUD pour les articles (Posts)
└── user/
    └── index.ts          # Actions d'administration des utilisateurs
```

---

## 🔑 1. Server Actions d'Authentification (`src/actions/auth`)

### `loginAction(prevState, formData)`
- **Fichier** : [src/actions/auth/login.ts](file:///c:/ACCEENT/acceent-website/src/actions/auth/login.ts)
- **Rôle** : Authentifie un utilisateur avec son email et mot de passe.
- **Processus** :
  1. Valide les entrées avec le schéma Zod `LoginSchema`.
  2. Recherche l'utilisateur dans PostgreSQL via `prisma.user.findUnique()`.
  3. Vérifie le mot de passe haché avec `bcrypt.compare()`.
  4. Génère le token JWT via `createSession()`.
  5. Pose le cookie HTTP-only `acceent_session`.
- **Retour** : `{ success: boolean, message?: string, errors?: Record<string, string[]> }`.

### `registerAction(prevState, formData)`
- **Fichier** : [src/actions/auth/register.ts](file:///c:/ACCEENT/acceent-website/src/actions/auth/register.ts)
- **Rôle** : Crée un nouveau compte utilisateur (`USER`).
- **Processus** :
  1. Valide l'email, le mot de passe et le nom avec `RegisterSchema`.
  2. Vérifie l'unicité de l'adresse email.
  3. Hache le mot de passe avec `bcrypt.hash(password, 10)`.
  4. Crée le record dans la table `users`.
  5. Initialise la session utilisateur.

### `logoutAction()`
- **Fichier** : [src/actions/auth/logout.ts](file:///c:/ACCEENT/acceent-website/src/actions/auth/logout.ts)
- **Rôle** : Détruit le cookie `acceent_session` et redirige vers la page de connexion `/auth/login`.

---

## 📝 2. Server Actions & Service de Stockage (`src/actions/post` & `src/services/storage`)

### Service de Stockage Supabase (`src/services/storage.ts`)
- **`uploadPostImage(file: File)`** : Reçoit un fichier image depuis le composant `ImageUploader`, l'envoie dans le bucket Supabase `news-images` (sous le sous-dossier `articles/`) et retourne l'URL publique générée.
- **Script de configuration RLS** (`scripts/setup_storage_policy.ts`) : Script exécutable (`pnpm exec tsx scripts/setup_storage_policy.ts`) configurant automatiquement le bucket public et les règles RLS `INSERT`, `SELECT`, `UPDATE` et `DELETE` sur Supabase.

### Actions des Articles (`src/actions/post/index.ts`)

| Action | Rôle | Contrôle d'Accès |
| :--- | :--- | :--- |
| `createPostAction(data)` | Crée un nouvel article. L'accès public se fait via l'ID (`/actualites/[id]`). | Rôles `ADMIN` ou `AUTHOR` |
| `updatePostAction(id, data)` | Met à jour le titre, le contenu ou l'image d'un article. | Auteur de l'article ou `ADMIN` |
| `deletePostAction(id)` | Supprime un article de la base de données. | Auteur de l'article ou `ADMIN` |
| `togglePublishPostAction(id)` | Alterne l'état de publication (`published: true/false`). | Rôles `ADMIN` ou `AUTHOR` |

---

## 👥 3. Server Actions des Utilisateurs (`src/actions/user`)

Fichier principal : [src/actions/user/index.ts](file:///c:/ACCEENT/acceent-website/src/actions/user/index.ts)

| Action | Rôle | Contrôle d'Accès |
| :--- | :--- | :--- |
| `updateUserRoleAction(userId, role)` | Modifie le rôle d'un utilisateur (`USER`, `AUTHOR`, `ADMIN`). | Rôle `ADMIN` uniquement |
| `deleteUserAction(userId)` | Supprime un compte utilisateur et ses articles associés. | Rôle `ADMIN` uniquement |

---

## 🛡️ Schémas de Validation Zod (`src/validation/`)

Toutes les Server Actions et les formulaires côté client valident rigoureusement leurs entrées avec [Zod 4](https://zod.dev/).

Exemple de schéma Zod de connexion ([src/validation/auth.ts](file:///c:/ACCEENT/acceent-website/src/validation/auth.ts)) :

```typescript
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
```

---

## 🛠️ Pattern Standard de Réponse d'une Server Action

Toutes les actions renvoient un objet typé standard permettant une gestion unifiée de l'UI et des messages d'erreur :

```typescript
export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};
```
