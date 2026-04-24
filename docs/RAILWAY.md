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
| Build | `npm ci --include=dev && npm run build:production` |
| Start | `npm start` → `node backend/dist/index.js` |

Railway injecte **`PORT`** automatiquement.

**Railpack / install** : le dépôt doit utiliser **`package-lock.json` (npm)** uniquement. Ne commitez pas **`bun.lockb`** (sinon Railpack lance `bun install` et peut échouer sur « lockfile is frozen »).

### Variables d’environnement (service web)

| Variable | Obligatoire | Remarque |
|----------|-------------|----------|
| `NODE_ENV` | oui | `production` |
| `DATABASE_URL` | oui | Fournie par le plugin Postgres si lié |
| `JWT_ACCESS_SECRET` | oui | ≥ 32 caractères |
| `FRONTEND_ORIGIN` | oui | URL **publique** exacte du service, ex. `https://xxx.up.railway.app` (sans `/` final, une seule origine) |
| `TURNSTILE_SECRET_KEY` | oui en prod | Requis par la validation au démarrage de l’API |
| `SERVE_SPA` | recommandé | `true` pour servir le build Vite (`dist/`) depuis Express (monolithe) |

**Frontend / Vite** : si l’API et le site partagent **la même** URL Railway, laissez **`VITE_API_URL` vide** au build : les appels restent en `/api/...`. Sinon, définissez **`VITE_API_URL`** dans les variables **au moment du build** (section variables avec scope *Build* si disponible).

**Turnstile côté navigateur** : `VITE_TURNSTILE_SITE_KEY` au build si vous utilisez le widget.

### Schéma Prisma

- Sans migrations versionnées : `npx prisma db push` depuis votre machine (avec la `DATABASE_URL` de prod), ou une commande one-shot.
- Avec migrations : `deploy.preDeployCommand` ou équivalent, ex. `npx prisma migrate deploy` (adapter au projet).

### Healthcheck

Chemin utilisé : **`/api/health`** (voir `railway.json`).

### Image Docker SPA seule

**`Dockerfile.spa`** construit une **SPA + Nginx** (pas l’API). Pour Railway « tout-en-un », utilisez **Railpack** + `npm start` (voir `railway.json`).
