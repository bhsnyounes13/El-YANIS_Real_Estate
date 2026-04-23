# EL-YANIS — Référence complète pour codage externe

Document unique pour reproduire, intégrer ou étendre le projet dans un autre outil (IDE, autre IA, équipe).  
**Dépôt :** application web **immobilier** (Algérie occidentale), vitrine + annonces ; **pas de tableau de bord admin** dans ce code.

---

## 1. Stack technique

| Couche        | Technologie                                                  |
| ------------- | ------------------------------------------------------------ |
| Runtime UI    | React **19**                                                 |
| Build         | **Vite 7**                                                   |
| Langage       | **TypeScript**                                               |
| Styles        | **Tailwind CSS v4** (`@tailwindcss/vite`)                    |
| Routing       | **react-router-dom** v7 (SPA `BrowserRouter`)                |
| Données async | **TanStack React Query** v5                                  |
| Formulaires   | **react-hook-form** + **zod** + `@hookform/resolvers`        |
| UI            | **shadcn/ui** (style **new-york**), **Radix UI**, **Lucide** |
| Alias chemins | `@/` → `src/` (voir `vite.config.ts`, `tsconfig`)            |

---

## 2. Commandes

```bash
npm install
npm run dev          # Vite, port 8080 par défaut (voir vite.config)
npm run build
npm run preview
npm run test         # Vitest
npm run lint
npm run export:redesign   # régénère EXPORT_CLAUDE_REDESIGN.md
```

---

## 3. Variables d’environnement

| Variable       | Rôle                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | URL de base du backend **sans** slash final. Si vide ou requête en échec, l’app utilise les **données mock** (`mockData`, `servicesCatalog`). |

Fichier exemple : `.env.example` à la racine.

---

## 4. Routes React (SPA)

Toutes sous `WebLayout` (`Navbar` + `Outlet` + `Footer`) sauf si vous changez l’architecture.

| Chemin          | Page                                                  | Fichier                        |
| --------------- | ----------------------------------------------------- | ------------------------------ |
| `/`             | Accueil                                               | `src/pages/Index.tsx`          |
| `/listings`     | Catalogue + filtres (query `q`, `type`, `city`, etc.) | `src/pages/Listings.tsx`       |
| `/property/:id` | Détail bien                                           | `src/pages/PropertyDetail.tsx` |
| `/services`     | Services                                              | `src/pages/Services.tsx`       |
| `/agents`       | Agents                                                | `src/pages/Agents.tsx`         |
| `/about`        | À propos                                              | `src/pages/About.tsx`          |
| `/contact`      | Contact                                               | `src/pages/Contact.tsx`        |
| `*`             | 404                                                   | `src/pages/NotFound.tsx`       |

**Pas de route `/admin` ni dashboard** dans la version actuelle.

---

## 5. Point d’entrée & providers

- `index.html` → `#root` → `src/main.tsx` (`createRoot`, `StrictMode`).
- CSS : `src/styles.css` puis `src/index.css` (ordre important pour le thème).
- `src/App.tsx` : `QueryClientProvider` → `LanguageProvider` → `ThemeProvider` → `TooltipProvider` → toasts → `BrowserRouter` → routes ci-dessus.

---

## 6. Contrat API (frontend)

Constantes : `src/lib/api/endpoints.ts`

| Méthode | Chemin                     | Usage                          |
| ------- | -------------------------- | ------------------------------ |
| GET     | `/api/properties`          | Liste des biens                |
| GET     | `/api/properties/featured` | Biens mis en avant             |
| GET     | `/api/properties/:id`      | Détail                         |
| GET     | `/api/agents`              | Agents                         |
| GET     | `/api/services`            | Services                       |
| POST    | `/api/contact`             | Formulaire contact général     |
| POST    | `/api/inquiries`           | Demande liée à un bien (fiche) |

Client HTTP : `src/lib/api/client.ts` — `apiGet` / `apiPost`, base = `getApiBase()` (`VITE_API_URL`).  
Mappers DTO → modèle domaine : `src/lib/api/mappers.ts`.  
Types DTO : `src/lib/api/types.ts`.  
Fallback mock : `src/lib/api/fallback.ts` (utilisé par les hooks si pas d’API ou erreur).

---

## 7. Hooks React Query

| Hook                    | Fichier                                      |
| ----------------------- |-------------------------------------------- |
| `useProperties`         | `src/hooks/queries/useProperties.ts`         |
| `useFeaturedProperties` | `src/hooks/queries/useFeaturedProperties.ts` |
| `useProperty`           | `src/hooks/queries/useProperty.ts`           |
| `useAgents`             | `src/hooks/queries/useAgents.ts`             |
| `useServices`           | `src/hooks/queries/useServices.ts`           |
| `useContactInquiry`     | `src/hooks/mutations/useContactInquiry.ts`   |
| `usePropertyInquiry`    | `src/hooks/mutations/usePropertyInquiry.ts`  |

---

## 8. Modèles domaine (résumé)

Fichier canonique : `src/lib/domain/types.ts`

- **Property** : `id`, titres/descriptions `en|fr|ar`, `type` `sale|rent`, `price`, `city` (`tlemcen` \| `ainTemouchent` \| `sidiBelAbbes`), `bedrooms`, `bathrooms`, `area`, `images[]`, `amenities[]`, `agent_id`, optionnel `bookedDates[]`, `featured`, `tags` (`exclusive` \| `new` \| `featured`).
- **Agent** : `id`, `name`, `photo`, `phone`, `email`, bios `en|fr|ar`.
- **ServiceItem** : `id`, champs localisés, `iconKey` (icône Lucide côté UI).
- **ContactInquiryInput** / **PropertyInquiryInput** : champs formulaires + `propertyId` / `preferredDate` pour la fiche.

Données de secours : `src/data/mockData.ts`, `src/data/servicesCatalog.ts`.

---

## 9. Internationalisation (i18n)

- Langues : **en**, **fr**, **ar**.
- `src/i18n/LanguageContext.tsx` : `language`, `setLanguage`, `t(key)`, `dir` (`rtl` si `ar`).
- Clés/valeurs : `src/i18n/translations.ts` (structure `Record<key, { en, fr, ar }>`).
- Persistance : `localStorage` (`el-yanis-lang`), thème : `el-yanis-theme` dans `ThemeContext`.

---

## 10. Design system (« Luminous Estate »)

- Fichiers principaux : `src/styles.css` (tokens `@theme`, `:root`, `.dark`), `src/index.css` (couches, utilitaires `.luminous-*`, `.glass-nav`, rent context).
- Marque : bleus **#0037b0** → **#1d4ed8** ; locations **rent** : violet **#5E52B4** / **#B0AFE3** (usage contextuel, pas global).
- Typo : **Manrope** (titres), **Inter** (corps) — chargées dans `index.css` / Google Fonts.
- Composants métier notables : `PropertyCard` (ratio image 4:5), `Navbar`, `Footer`, `PageHero`, `SectionShell`, `HeroSearch`, `ListingFilters`, etc.
- **Container** : dans `index.css`, règle `.container` avec `margin-inline: auto` et `padding-inline: clamp(...)` pour marges latérales confortables.

---

## 11. Arborescence utile (complément)

Référence détaillée des dossiers : **`FRONTEND_HIERARCHY.md`**.  
Pack design + extraits de code généré : **`EXPORT_CLAUDE_REDESIGN.md`** (régénérable avec `npm run export:redesign`).

Structure synthétique actuelle :

```
src/
  App.tsx, main.tsx, index.css, styles.css, vite-env.d.ts
  assets/
  components/          # UI métier + ui/ (shadcn)
  data/                # mockData.ts, servicesCatalog.ts
  hooks/               # queries/, mutations/, use-toast, use-mobile
  i18n/
  layouts/             # WebLayout.tsx
  lib/                   # utils.ts, domain/, api/
  pages/
  theme/
  test/
```

---

## 12. shadcn / UI

- Config : `components.json` (alias `@/components`, `@/lib/utils`, CSS principal `src/styles.css`).
- Primitives dans `src/components/ui/*` (Button, Input, Form, Sheet, Calendar, etc.).

---

## 13. Tests

- **Vitest** + **Testing Library** + **jsdom**.
- Setup : `src/test/setup.ts`.
- Utilitaire `QueryClient` : `src/test/test-utils.tsx` (`TestProviders`).
- Fichiers : `src/test/*.test.tsx`, `example.test.ts`.

---

## 14. Déploiement / Cloudflare

- `wrangler.jsonc` : orienté **Pages** avec `pages_build_output_dir: "dist"` (adapter si vous utilisez Workers autrement).

---

## 15. Fichiers de config racine utiles

- `vite.config.ts` — alias `@`, plugins React + Tailwind + tsconfig paths.
- `tsconfig.json` / `tsconfig.app.json` — paths.
- `eslint.config.js`, `prettier` (selon présence).
- `components.json` — shadcn.

---

## 16. Checklist pour un outil externe

1. Reprendre la **stack** §1 et les **routes** §4.
2. Brancher un backend réel via **`VITE_API_URL`** et respecter les chemins §6 (ou adapter `mappers.ts`).
3. Garder les **types domaine** §8 pour cohérence des écrans.
4. Dupliquer les **clés i18n** dans `translations.ts` pour tout nouveau texte.
5. Respecter **ThemeProvider** + **LanguageProvider** pour RTL et dark mode.
6. Lancer **`npm run build`** et **`npm run test`** avant livraison.

---

_Document généré pour le dépôt EL-YANIS — à mettre à jour si la structure du code change._
