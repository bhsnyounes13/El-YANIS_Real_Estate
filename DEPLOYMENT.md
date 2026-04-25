# Déploiement EL-YANIS (Vite + React)

## Prérequis

- **Node.js** ≥ 20 (recommandé : **22**, voir `.nvmrc`)
- `npm ci` ou `npm install` pour les dépendances

## Variables d’environnement (build)

Créer un fichier `.env` ou configurer les variables sur la plateforme (**Build time** pour tout ce qui commence par `VITE_`).

| Variable              | Obligatoire           | Description                                                                             |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| `VITE_ADMIN_PASSWORD` | **Oui** en production | Mot de passe du panneau `/admin` (jamais commité).                                      |
| `VITE_API_URL`        | **Oui** si l’API est sur un autre domaine que le site | URL du backend **sans** slash final (ex. `https://xxx.up.railway.app`). Si vide : requêtes `/api/…` sur **l’origine du site** (OK seulement avec proxy Nginx ou monolithe). Voir `docs/RAILWAY.md` (API + site séparés). |
| `VITE_BASE_PATH`      | Non                   | Si l’app est servie sous un sous-chemin (ex. `/app/`). Sinon laisser vide (racine `/`). |

Le mot de passe admin est inclus dans le bundle client : ce n’est qu’une **barrière légère**. Pour une sécurité réelle, prévoir une auth serveur.

## Commandes locales

```bash
npm ci
npm run build    # sortie dans dist/
npm run preview  # prévisualiser le build
npm run ci       # lint + tests + build (comme la CI)
```

## Hébergeurs statiques

- **Netlify** : `netlify.toml` est déjà présent (SPA → `index.html`, `publish = dist`).
- **Vercel** : `vercel.json` (framework Vite, rewrites SPA, en-têtes de base).

Sur chaque plateforme, déclarer `VITE_ADMIN_PASSWORD` (et les autres) dans les **paramètres de build / environnement**.

## Sous-chemin (GitHub Pages, sous-domaine path)

1. Définir `VITE_BASE_PATH=/nom-du-dossier/` au build.
2. Le routeur utilise `import.meta.env.BASE_URL` (`BrowserRouter basename`).

## Docker

Image nginx servant `dist/` :

```bash
docker build \
  --build-arg VITE_ADMIN_PASSWORD=votre_mot_de_passe \
  --build-arg VITE_API_URL=https://api.example.com \
  -t elyanis-web .

docker run -p 8080:80 elyanis-web
```

Sans `--build-arg`, le build peut échouer côté admin en production si aucun mot de passe n’est injecté (comportement attendu).

## CI GitHub Actions

Le workflow `.github/workflows/ci.yml` exécute lint, tests et build sur les branches `main` / `master`.
