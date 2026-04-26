# Déploiement sur Railway

## Service Web (API + frontend sur une seule URL)

1. **New project** → déployer depuis GitHub (ce dépôt).
2. Ajouter **PostgreSQL** (plugin Railway) et **lier** la variable `DATABASE_URL` au service web (souvent automatique).
3. Le fichier **`railway.json`** force **Railpack**, désactive le Dockerfile (`dockerfilePath: null`) et définit build / start.  
   **Important** : pas de `Dockerfile` à la racine (sinon Railway build une image **Nginx** sans Node, puis `npm start` échoue). Image statique seule : **`Dockerfile.spa`**.

4. Dans le **dashboard Railway** → service → **Settings** : si un **Dockerfile path** personnalisé est renseigné, **supprimez-le** / repassez le builder sur **Railpack**, puis redéployez.

### Commandes (déjà dans `railway.json`)

| Étape | Commande |
|--------|-----------|
| Install | `npm ci` (phase Railpack ; voir `.npmrc` pour garder les devDependencies) |
| Build | `npm run build:production` (ne pas relancer `npm ci` ici : évite `EBUSY` sur `node_modules/.vite`) |
| Start | `npm start` (recommandé) → `prisma migrate deploy` puis `node backend/dist/index.js` |

**Important — URL `{"error":"Not found"}` sur `/api/...` :** le code API compilé se trouve dans **`backend/dist/`**, pas à la racine. Le build (`npm run build:production` ou Railpack) doit exécuter **`build:api`** (TypeScript) et **`build:railway-root-entry`**, ce qui génère aussi un **`dist/index.js` à la racine** si vous avez paramétré le service sur `node dist/index.js`. Mieux : **déploiement → Start = `npm start`** (défaut de `railway.json`) afin d’inclure les migrations et le bon binaire. Ne pas utiliser un vieux `dist/` jamais reconstruit.

Railway injecte **`PORT`** automatiquement. L’API écoute par défaut sur **`0.0.0.0`** (variable optionnelle **`HOST`** pour surcharger).

**Railpack / install** : le dépôt doit utiliser **`package-lock.json` (npm)** uniquement. Ne commitez pas **`bun.lockb`** (sinon Railpack lance `bun install` et peut échouer sur « lockfile is frozen »).

### Variables d’environnement (service web)

| Variable | Obligatoire | Remarque |
|----------|-------------|----------|
| `NODE_ENV` | oui | `production` |
| `DATABASE_URL` | oui | Fournie par le plugin Postgres si lié ; en cas d’échec de connexion, vérifier `?sslmode=require` (souvent requis vers Postgres hébergé). |
| `DB_CONNECT_TIMEOUT_MS` | non | Défaut 30000 — après démarrage HTTP, la vérif Prisma échoue avec un message explicite au lieu de bloquer indéfiniment. |
| `JWT_ACCESS_SECRET` | oui | ≥ 32 caractères |
| `FRONTEND_ORIGIN` | recommandé | URL **publique** exacte (sans `/` final). **Si absent** : l’API utilise `https://${RAILWAY_PUBLIC_DOMAIN}` (domaine public généré dans *Networking*). Définissez `FRONTEND_ORIGIN` si vous utilisez un **domaine personnalisé** ou si `RAILWAY_PUBLIC_DOMAIN` est vide au premier déploiement. |
| `TURNSTILE_SECRET_KEY` | oui en prod | Requis par la validation au démarrage de l’API |
| `SERVE_SPA` | recommandé | `true` pour servir le build Vite (`dist/`) depuis Express (monolithe) |

**Frontend / Vite** : si l’API et le site partagent **la même** URL Railway, laissez **`VITE_API_URL` vide** au build : les appels restent en `/api/...`. Sinon, définissez **`VITE_API_URL`** dans les variables **au moment du build** (section variables avec scope *Build* si disponible).

**Turnstile côté navigateur** : `VITE_TURNSTILE_SITE_KEY` au build si vous utilisez le widget.

**Variables via CLI** : pour configurer l’e-mail (SMTP) avec la CLI Railway (`railway login`, `railway link`, `railway variable set …`), voir la section **Configuration avec la CLI Railway** dans [SMTP.md](SMTP.md).

### Schéma Prisma

- Le dépôt contient des **migrations** (`backend/prisma/migrations/`) : au démarrage, `npm start` exécute **`prisma migrate deploy`**. Voir [RAILWAY_DATABASE_FIX.md](RAILWAY_DATABASE_FIX.md) en cas d’erreur « table n’existe pas ».
- Urgence seulement : `EMERGENCY_DB_PUSH=true` (équivalent `db push` au boot) — à éviter en prod. Référence : [RAILWAY_DATABASE_FIX.md](RAILWAY_DATABASE_FIX.md).

### Healthcheck

Chemin utilisé : **`/api/health`** (voir `railway.json`).

Si le déploiement affiche **« service unavailable »** pendant plusieurs minutes :

1. Ouvrez les **logs du déploiement** (runtime), pas seulement le build : recherchez `bootstrap_failed`, erreurs Prisma ou stack trace au démarrage.
2. Vérifiez que **`DATABASE_URL`** pointe vers une base joignable depuis Railway (plugin Postgres lié au service).
3. Vérifiez **`JWT_ACCESS_SECRET`** (≥ 32 caractères), **`FRONTEND_ORIGIN`** (URL exacte du site), **`TURNSTILE_SECRET_KEY`** : en production, leur absence ou une valeur invalide peut faire **quitter le processus** avant `listen`, donc le healthcheck échoue.
4. Si vous servez le frontend depuis le même processus, définissez **`SERVE_SPA=true`** après le premier build réussi (le healthcheck reste sur `/api/health`).

### API seule sur Railway + site Vite ailleurs (ex. elyanis.com, Hostinger, Netlify)

Si le **front** est déployé sur un **autre domaine** que l’API, le build Vite **doit** connaître l’URL de l’API, sinon le navigateur appelle `/api/…` sur l’hébergeur du site → **404** (« API introuvable »).

1. **URL publique de l’API** : dans Railway, service de l’API → **Settings → Networking** (ou l’URL `*.up.railway.app` affichée). Aucun slash final.
2. **Vérification** : `GET https://<cette-url>/api/health` doit répondre `200` avec `ok: true` et des tables prêtes. Si `ok: false` / `DATABASE_SCHEMA_NOT_READY`, exécutez les migrations (voir [RAILWAY_DATABASE_FIX.md](RAILWAY_DATABASE_FIX.md)).
3. **Build du front** : à la racine du dépôt, définir `VITE_API_URL=https://<cette-même-url>` (fichier **`.env.production`** en local, ou variable de **build** sur la CI / l’hébergeur du site), puis `npm run build` et uploader le dossier `dist/`.
4. **Variables côté API** (service Railway de l’API) :
   - `FRONTEND_ORIGIN=https://votre-site.com` (ex. `https://elyanis.com`, **sans** `/` final) — obligatoire pour CORS / cookies.
   - `NODE_ENV=production` — ne pas laisser `development` en prod.
   - `JWT_ACCESS_SECRET` (≥ 32 caractères, secret fort), `DATABASE_URL` (plugin Postgres), etc.
5. **Déploiement du `dist/`** : après `npm run build` local (avec `.env.production` ou `VITE_API_URL` en variable de build), uploader le nouveau `dist/` vers l’hébergeur du site. Le simple remplacement d’un `.env` sur l’hébergeur **statique** ne change **pas** l’URL d’API (elle est **figée** dans le JS).

Sans `VITE_API_URL` au build, le bundle utilise des chemins relatifs ; c’est seulement valable si Nginx (ou l’hébergeur) **proxifie** `/api/` vers la même app — voir [HOSTINGER.md](HOSTINGER.md).

### Image Docker SPA seule

**`Dockerfile.spa`** construit une **SPA + Nginx** (pas l’API). Pour Railway « tout-en-un », utilisez **Railpack** + `npm start` (voir `railway.json`).
