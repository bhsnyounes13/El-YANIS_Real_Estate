# Déploiement sur Hostinger (EL-YANIS)

*« Haustinger » désigne ici **Hostinger** — hébergeur courant pour VPS KVM.*

Ce projet est une **SPA React (Vite)** + **API Express** + **PostgreSQL**. L’hébergement **mutualisé PHP seul** ne convient pas : il faut un **VPS Hostinger** (ou équivalent) avec **Node.js 20+** et **PostgreSQL**.

## 1. Prérequis sur le VPS

- Ubuntu 22.04/24.04 (souvent proposé sur Hostinger VPS).
- **Node 20+** (`nvm` ou paquet Node officiel).
- **PostgreSQL** (service managé Hostinger si disponible, ou PostgreSQL installé sur le VPS).
- **Nginx** (ou Caddy) en reverse proxy + **Certbot** (Let’s Encrypt) pour le HTTPS.
- **PM2** (`npm i -g pm2`) pour garder l’API en cours d’exécution.

## 2. Variables d’environnement (production)

Sur le serveur, créez un fichier **`.env`** à la racine du dépôt (même principe qu’en local). Indispensables :

| Variable | Rôle |
|----------|------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Chaîne Prisma PostgreSQL (hôte souvent interne ou fourni par Hostinger). |
| `JWT_ACCESS_SECRET` | Au moins 32 caractères, secret fort. |
| `FRONTEND_ORIGIN` | URL **exacte** du site, ex. `https://votredomaine.com` (HTTPS, une seule origine). |
| `TURNSTILE_SECRET_KEY` | **Obligatoire** en production (validation au démarrage de l’API). |
| `PORT` | `3001` (ou autre port interne ; Nginx proxy vers ce port). |

Images / stockage :

- **Recommandé en prod** : **S3 ou Cloudflare R2** (`STORAGE_BUCKET`, clés, `STORAGE_PUBLIC_URL`, etc.).
- **Disque sur le VPS** : `STORAGE_LOCAL_ROOT` + **`STORAGE_LOCAL_PUBLIC_BASE=https://votredomaine.com`** pour que les URLs d’images pointent vers le même domaine (Nginx doit proxifier `/uploads/` vers l’API, voir l’exemple Nginx ci-dessous).

Autres : voir **`.env.example`** (Sentry, durées JWT, bootstrap admin, etc.).

## 3. Build sur le serveur

Depuis la racine du projet (après `git clone` ou upload sur le VPS) :

```bash
npm ci
```

Le paquet **`prisma`** est en **dépendance de production** : `postinstall` exécute `prisma generate` même avec `npm ci --omit=dev` (utile si vous ne buildez que sur une CI et ne copiez que `dist/` + `backend/dist/` + `node_modules` minimal).

**Méthode simple (tout sur le VPS)** — inclut Vite + TypeScript pour compiler le front et l’API :

```bash
npm ci
# Configurer .env (voir §2), puis :
npx prisma db push --schema backend/prisma/schema.prisma
npm run build:production
```

**Méthode CI / machine locale** — sur la CI ou votre PC : `npm ci && npm run build:production`, puis copier sur le VPS au minimum **`dist/`**, **`backend/dist/`**, **`package.json`**, **`package-lock.json`**, **`backend/prisma/`**, **`.env`**. Sur le serveur :

```bash
npm ci --omit=dev
npx prisma db push --schema backend/prisma/schema.prisma
```

Le **`postinstall`** régénère le client Prisma (le CLI `prisma` est en dépendance de prod).

Schéma sans migrations versionnées : `db push` comme ci-dessus. Avec migrations Git : **`npm run db:migrate:deploy`** à la place.

## 4. Nginx

Exemple prêt à adapter : **`deploy/hostinger.nginx.conf.example`**.

Points clés :

- `root` vers le dossier **`dist/`** généré par Vite.
- `location /api/` → proxy vers `http://127.0.0.1:3001` (ou le `PORT` de l’API).
- `location /uploads/` → même proxy si vous utilisez le stockage disque local.
- `try_files` pour le routage SPA (`/index.html`).

Build du frontend : sans `VITE_API_URL`, les appels partent en **relatif** `/api/...`, donc **même domaine** que le site — adapté à cette config Nginx.

## 5. Démarrer l’API avec PM2

Fichier **`ecosystem.config.cjs`** à la racine.

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # suivre les instructions pour redémarrage au boot
```

L’API lit le **`.env`** à la racine grâce à `dotenv`.

## 6. Checklist rapide

- [ ] DNS du domaine pointant vers l’IP du VPS.
- [ ] PostgreSQL créé + `DATABASE_URL` testée (`npx prisma db execute --stdin` ou `npm run check:db` si port exposé).
- [ ] `.env` complet (`FRONTEND_ORIGIN` en `https://…`, Turnstile, JWT).
- [ ] `npm run build:production` OK.
- [ ] Nginx + SSL.
- [ ] `pm2 start` + `pm2 save` + `pm2 startup`.
- [ ] Stockage S3/R2 **ou** disque + `STORAGE_LOCAL_PUBLIC_BASE` + proxy `/uploads/`.

## 7. Cloudflare Pages + API sur le VPS (option)

Vous pouvez héberger le **frontend** sur Cloudflare Pages et l’**API** sur Hostinger : définissez alors **`VITE_API_URL=https://api.votredomaine.com`** au moment du build Pages, et `FRONTEND_ORIGIN` côté API sur l’URL Pages — CORS et cookies doivent correspondre à la doc du projet (`DOCUMENTATION.md`).

---

En résumé : **VPS Hostinger**, **Nginx** devant **Vite `dist/`** + **proxy `/api`**, **PM2** pour **`backend/dist/index.js`**, **PostgreSQL** et **`.env` production** conformes à **`env-validation`** (notamment Turnstile).
