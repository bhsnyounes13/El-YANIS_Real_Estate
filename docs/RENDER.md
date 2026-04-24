# Déploiement sur Render

## Service Web (Node)

1. Créer un **Web Service** branché sur ce dépôt.
2. **Build command** : `npm ci --include=dev && npm run build:production`  
   (`--include=dev` garde Vite et TypeScript ; sans cela, le build échoue souvent quand `NODE_ENV=production`.)
3. **Start command** : `npm start` (exécute `node backend/dist/index.js`).
4. **Health check** : `/api/health`.

## Variables d’environnement

Renseigner au minimum (voir `.env.example`) : `DATABASE_URL`, `JWT_ACCESS_SECRET`, `FRONTEND_ORIGIN` (URL publique du service Render, `https://…`), `TURNSTILE_SECRET_KEY`, `NODE_ENV=production`.

Render injecte **`PORT`** : ne pas le fixer à la main.

## Frontend + API sur le même service

Avec **`SERVE_SPA=true`**, l’API sert aussi le build Vite dans `dist/` (fichiers statiques + fallback SPA). Le fichier `render.yaml` du dépôt active cette option par défaut.

API seule : mettre `SERVE_SPA=false` ou retirer la variable.

## Base de données

Créer une **Render PostgreSQL** et lier `DATABASE_URL`. Schéma : `npx prisma db push` depuis votre machine (ou un job one-shot) si vous n’utilisez pas encore de migrations versionnées ; avec migrations Git : `npx prisma migrate deploy` en **pre-deploy** ou manuellement.

## Blueprint

Le fichier racine **`render.yaml`** peut servir de modèle ; complétez les secrets sensibles dans le dashboard Render.
