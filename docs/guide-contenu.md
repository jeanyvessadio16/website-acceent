# Guide de mise à jour du contenu

Ce guide s’adresse aux personnes qui mettent à jour les textes, images et liens du site **sans modifier la structure React**. Une connaissance minimale de l’éditeur de code et de Git est utile.

---

## Principe général

Le contenu affiché sur la plupart des pages provient de fichiers dans **`src/data/`** et d’images dans **`public/`**. Pour changer un titre, une description ou une photo de carte programme, il suffit en général de modifier ces fichiers — pas la page complète.

---

## Checklist : ajouter un nouveau programme

- [ ] Image optimisée déposée dans `public/images/` (JPEG/WebP, nom sans espaces)
- [ ] Entrée ajoutée dans le bon fichier `programes-*.ts`
- [ ] Page créée sous `src/app/(domaine)/nom-du-programme/page.tsx` (demander à un développeur si besoin)
- [ ] Lien ajouté dans `src/data/footer/programmes.ts` si le programme doit apparaître en pied de page
- [ ] Texte relu (orthographe, accents français)
- [ ] Test local : `pnpm dev` puis navigation vers la nouvelle URL

---

## Fichiers par type de contenu

### Page d'accueil — trois domaines

**Fichier :** `src/data/list-domaines.ts`

Chaque objet contient :

| Propriété | Description |
|-----------|-------------|
| `nom` | Titre de la carte |
| `description` | Texte sous le titre |
| `image` | Chemin depuis `public/` (ex. `/images/educaton.jpg`) |
| `page` | Lien interne (ex. `/education`) |

### Liste des programmes (page hub)

| Domaine | Fichier |
|---------|---------|
| Éducation | `src/data/education/programes-education.ts` |
| Entrepreneuriat | `src/data/entreprenariat/programmes-entreprenariat.ts` |
| Numérique | `src/data/numerique/programmes-numerique.ts` |

Structure d’une entrée :

```typescript
{
  id: 1,                    // Identifiant unique dans le tableau
  nom: "NOM DU PROGRAMME",
  description: "Résumé court pour la carte.",
  image: "/images/photo.jpg",
  page: "/chemin-interne",   // ou URL externe complète https://...
}
```

Pour un **lien externe** (nouvel onglet automatique si la page le gère), mettre l’URL complète dans `page`, comme pour YAAKAAR dans `programmes-entreprenariat.ts`.

### Contenu détaillé d'une fiche programme

Les pages individuelles importent souvent un fichier dédié :

| Programme | Données détaillées |
|-----------|-------------------|
| ACCEENT4ELLES | `src/data/education/acceentElles.ts` |
| TUT'TANK | `src/data/education/tut-tank.ts` |
| ACCEENT'INCUB | `src/data/entreprenariat/acceentIncub.ts` |
| WRO | `src/data/numerique/wroAction.ts` |

Ouvrir le fichier correspondant et modifier les textes, listes ou sections selon la structure existante.

### Partenaires

**Fichier :** `src/data/partenaires.ts`  
**Type :** `src/types/partenaires.ts`

| Propriété | Description |
|-----------|-------------|
| `name` | Nom affiché |
| `logo` | Chemin logo dans `public/` |
| `description` | Texte court (accessibilité / SEO) |
| `website` | URL du partenaire |

### Pied de page

| Élément | Fichier |
|---------|---------|
| Liens programmes | `src/data/footer/programmes.ts` |
| Réseaux sociaux | `src/data/footer/link-media.ts` |

### Page À propos

Contenu principalement dans `src/app/about/page.tsx` (statistiques, valeurs). Pour de gros changements, prévoir une revue développeur.

---

## Images

### Bonnes pratiques

- Format : **WebP** ou **JPEG** pour les photos ; **PNG** ou **SVG** pour les logos
- Taille raisonnable (< 500 Ko par image si possible)
- Noms de fichiers en **minuscules**, tirets : `mon-programme-2025.jpg`
- Chemin dans le code : toujours commencer par `/images/` ou `/logo/`

### Emplacements

```
public/
├── images/          # Photos programmes, bannières
└── logo/            # Logos ACCEENT et réseaux sociaux
```

---

## Coordonnées affichées sur le site

Les informations de contact visibles par les visiteurs sont définies dans :

- `src/components/shared/Contact.tsx` (adresse, e-mail, téléphone)
- `src/components/layout/Footer.tsx` (bloc contact)

Lors d’un changement de numéro ou d’e-mail, **mettre à jour les deux fichiers** pour rester cohérent.

E-mail de destination du formulaire (côté technique) : `src/services/contactService.ts` → `info@acceent.org` dans le log simulé.

---

## SEO — titres de pages

Chaque page dans `src/app/.../page.tsx` peut définir :

```typescript
export const metadata: Metadata = {
  title: "Titre affiché dans l'onglet",
  description: "Description pour les moteurs de recherche",
};
```

Le layout global ajoute le suffixe `| ACCEENT` via le template défini dans `layout.tsx`.

---

## Workflow Git recommandé

1. Créer une branche : `content/maj-programme-wro`
2. Modifier uniquement les fichiers data / images / métadonnées
3. Vérifier en local sur mobile et desktop
4. Ouvrir une pull request avec une liste des pages impactées

---

## Ce qu'il ne faut pas modifier sans développeur

- `src/components/ui/*` (composants de base)
- `next.config.ts`, `package.json`
- Logique du formulaire (`ContactService`, schéma Zod)
- Structure des layouts (`layout.tsx`, `Header.tsx`)

---

## Besoin d'aide ?

Consulter le [README principal](../README.md) ou la [documentation d'architecture](architecture.md).
