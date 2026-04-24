# Déploiement sur Railway

## Service Web (API + frontend sur une seule URL)

1. **New project** → déployer depuis GitHub (ce dépôt).
2. Ajouter **PostgreSQL** (plugin Railway) et **lier** la variable `DATABASE_URL` au service web (souvent automatique).
3. Le fichier **`railway.toml`** force **Railpack** et les commandes de build / start.  
   **Important** : il ne doit **pas** y avoir de fichier nommé `Dockerfile` à la racine (Railway le priorise et lance **Nginx** sans Node, puis `npm start` échoue). L’image statique Nginx est dans **`Dockerfile.spa`** (`docker build -f Dockerfile.spa .`).

### Commandes (déjà dans `railway.toml`)

| Étape | Commande |
|--------|-----------|
| Build | `npm ci --include=dev && npm run build:production` |
| Start | `npm start` → `node backend/dist/index.js` |

Railway injecte **`PORT`** automatiquement.

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

Chemin utilisé : **`/api/health`** (voir `railway.toml`).

### Image Docker SPA seule

**`Dockerfile.spa`** construit une **SPA + Nginx** (pas l’API). Pour Railway « tout-en-un », utilisez **Railpack** + `npm start` (voir `railway.toml`).
