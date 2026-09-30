# Base de Données et Sécurité - ACCEENT Website

Ce document décrit la structure de la base de données PostgreSQL, le modèle d'authentification par session JWT sécurisée et le système de contrôle d'accès basé sur les rôles (RBAC).

---

## 🗄️ Schéma de Base de Données (Prisma ORM)

Le schéma Prisma est défini dans le fichier [prisma/schema.prisma](file:///c:/ACCEENT/acceent-website/prisma/schema.prisma).

### Enumération des Rôles (`Role`)

```prisma
enum Role {
  USER      // Membre / Utilisateur classique du site
  AUTHOR    // Rédacteur de contenu (accès à la gestion des articles)
  ADMIN     // Administrateur système (accès complet au panel d'admin et aux utilisateurs)
}
```

### Modèle `User` (`users`)

Stocke les utilisateurs et les administrateurs du site.

```prisma
model User {
  id        String   @id @default(uuid())
  firstname String
  lastname  String
  email     String   @unique
  password  String   // Mot de passe haché avec bcryptjs (10 rounds)
  role      Role     @default(USER)
  posts     Post[]   // Articles créés par cet utilisateur
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Modèle `Post` (`posts`)

Stocke les articles, actualités ou publications administrées depuis le tableau de bord.

```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   String
  imageUrl  String
  link      String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@map("posts")
}
```

---

## 🔐 Système d'Authentification & Sessions JWT

L'authentification ne repose pas sur des cookies de session côté serveur lourds, mais sur des **tokens JWT sécurisés et signés** gérés par le module [src/lib/session.ts](file:///c:/ACCEENT/acceent-website/src/lib/session.ts).

### Composants Clés

1. **Signature des Tokens (`jose`)** :
   - Algorithme : `HS256`
   - Clé de signature : `SESSION_SECRET`
   - Durée de validité : **7 jours** (`60 * 60 * 24 * 7` secondes)
   - Contenu du Payload (`SessionPayload`) :
     ```typescript
     export interface SessionPayload {
         userId: string;
         email: string;
         role: "USER" | "AUTHOR" | "ADMIN";
         firstname: string;
         lastname: string;
     }
     ```

2. **Stockage du Cookie de Session (`acceent_session`)** :
   - `httpOnly: true` (Inaccessible via JavaScript côté client pour prévenir les attaques XSS).
   - `secure: process.env.NODE_ENV === "production"` (Transmis uniquement en HTTPS en prod).
   - `sameSite: "lax"` (Protection contre les attaques CSRF).
   - `path: "/"` (Disponible sur tout le domaine).

3. **Hachage des Mots de Passe (`bcryptjs`)** :
   - Les mots de passe sont hachés avant insertion en base lors de l'inscription via Server Action.
   - La comparaison à la connexion s'effectue avec `bcrypt.compare()`.

---

## 🛡️ Protection des Routes via Middleware

Le fichier [src/middleware.ts](file:///c:/ACCEENT/acceent-website/src/middleware.ts) intercepte les requêtes réseau et valide les permissions avant de rendre la page.

### Matrice de Contrôle d'Accès

| Espace / Route | Visiteurs Anonymes | Rôle `USER` | Rôle `AUTHOR` | Rôle `ADMIN` |
| :--- | :---: | :---: | :---: | :---: |
| **Site Public (`/`, `/about`, `/education`...)** | ✅ Accès | ✅ Accès | ✅ Accès | ✅ Accès |
| **Auth (`/auth/login`, `/auth/register`)** | ✅ Accès | 🔄 Redirige `/dashboard` | 🔄 Redirige `/admin` | 🔄 Redirige `/admin` |
| **Espace Membre (`/dashboard/**`)** | 🔒 Redirige `/auth/login` | ✅ Accès | ✅ Accès | ✅ Accès |
| **Espace Admin (`/admin/**`)** | 🔒 Redirige `/auth/login` | ⛔ Redirige `/dashboard` | ✅ Accès | ✅ Accès |

### Logique du Middleware

```typescript
// Extrait de src/middleware.ts
export async function middleware(request: NextRequest) {
    const token = request.cookies.get("acceent_session")?.value;
    const session = token ? await verifySession(token) : null;
    const isAuthenticated = session !== null;

    // Protection Espace Admin (/admin)
    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) return redirectToLogin();
        if (session.role !== "ADMIN" && session.role !== "AUTHOR") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // Protection Espace Membre (/dashboard)
    if (pathname.startsWith("/dashboard")) {
        if (!isAuthenticated) return redirectToLogin();
    }
}
```
