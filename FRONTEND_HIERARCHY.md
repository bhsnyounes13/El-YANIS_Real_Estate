# Hiérarchie du frontend — EL-YANIS

Vue d’ensemble de l’organisation des fichiers côté interface (Vite + React). Les chemins sont relatifs à la racine du dépôt.

---

## Point d’entrée & assets statiques

| Emplacement  | Rôle                                                 |
| ------------ | ---------------------------------------------------- |
| `index.html` | Document HTML, `#root`, métadonnées SEO / Open Graph |
| `public/`    | Fichiers servis tels quels (pas de bundling)         |

```
public/
├── favicon.ico
├── manifest.json          # PWA
├── offline.html
├── placeholder.svg
├── robots.txt
├── sw.js                  # service worker (si utilisé)
├── _env.js
├── _redirects
├── .htaccess
└── icons/
    └── icon.svg
```

---

## Dossier `src/` — application React

```
src/
├── App.tsx                 # Providers, React Router, routes
├── main.tsx                # createRoot, imports CSS globaux
├── index.css               # @reference styles + couches @layer + utilitaires premium
├── styles.css              # Tailwind v4 @theme, tokens :root / .dark
├── vite-env.d.ts           # Types Vite / références
│
├── assets/
│   └── logo.jpg            # Logo marque (Navbar, Footer)
│
├── layouts/
│   └── WebLayout.tsx       # Shell : Navbar + <Outlet /> + Footer
│
├── pages/
│   ├── Index.tsx           # Accueil (hero, recherche, featured)
│   ├── Listings.tsx        # Catalogue + filtres (URL query)
│   ├── PropertyDetail.tsx  # Fiche bien
│   ├── Services.tsx
│   ├── Agents.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── NotFound.tsx        # 404
│
├── components/
│   ├── Navbar.tsx          # Navigation + menu mobile
│   ├── Footer.tsx
│   ├── PropertyCard.tsx    # Carte annonce
│   ├── LanguageSwitcher.tsx
│   ├── ThemeToggle.tsx
│   ├── LazyImage.tsx
│   └── ui/                 # Primitives shadcn / Radix (voir liste ci-dessous)
│
├── theme/
│   └── ThemeContext.tsx    # Thème clair / sombre (localStorage)
│
├── i18n/
│   ├── LanguageContext.tsx # Langue active (FR / EN / AR), RTL
│   └── translations.ts     # Chaînes par langue
│
├── data/
│   └── mockData.ts         # Propriétés et données de démo
│
├── hooks/
│   ├── use-toast.ts        # Toasts (Radix)
│   └── use-mobile.tsx      # Breakpoint mobile (sidebar patterns)
│
├── lib/
│   └── utils.ts            # cn(), helpers Tailwind
│
└── test/                   # Tests Vitest / Testing Library
    ├── setup.ts
    ├── example.test.ts
    ├── routing-and-pages.test.tsx
    ├── navbar-mobile.test.tsx
    ├── home-and-contact.test.tsx
    └── ui-behavior.test.tsx
```

---

## `src/components/ui/` — composants UI (shadcn « new-york »)

Primitives réutilisables ; la config est dans `components.json` à la racine.

| Fichiers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `form.tsx`, `hover-card.tsx`, `input-otp.tsx`, `input.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toaster.tsx`, `toggle-group.tsx`, `toggle.tsx`, `tooltip.tsx` |

---

## Flux de navigation (résumé)

```
index.html
    └── main.tsx
            └── App.tsx
                    └── BrowserRouter
                            └── WebLayout
                                    ├── Navbar
                                    ├── <Outlet />  → page courante (pages/*)
                                    └── Footer
```

---

## Fichiers de config utiles au frontend (hors `src/`)

| Fichier                               | Rôle                                                    |
| ------------------------------------- | ------------------------------------------------------- |
| `vite.config.ts`                      | Build Vite, alias `@`, plugins React + Tailwind         |
| `tsconfig.json` / `tsconfig.app.json` | Chemins `@/*`                                           |
| `components.json`                     | Alias shadcn, fichier CSS principal, style « new-york » |
| `tailwind`                            | Intégré via `@tailwindcss/vite` dans `vite.config.ts`   |

---

_Dernière mise à jour : structure générée à partir du dépôt EL-YANIS._
