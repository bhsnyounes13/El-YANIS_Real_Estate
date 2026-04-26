# Base PostgreSQL sur Railway (Prisma) — appliquer le schéma

Si l’API renvoie des erreurs du type **« The table public.User does not exist »** ou `DATABASE_SCHEMA_NOT_READY`, la base Railway n’a pas encore les tables définies dans `backend/prisma/schema.prisma`. Il faut appliquer les migrations, puis (optionnel) créer l’utilisateur admin.

## Variables d’environnement (Railway)

| Variable | Rôle |
|----------|------|
| `DATABASE_URL` | Fourni par le plugin PostgreSQL Railway (requis) |
| `NODE_ENV` | `production` |
| `FRONTEND_ORIGIN` | Ex. `https://elyanis.com` |
| `JWT_ACCESS_SECRET` | Secret fort (≥ 32 caractères) |
| `JWT_REFRESH_SECRET` | Secret fort pour les refresh tokens |
| `ADMIN_PASSWORD` | Uniquement pour l’exécution manuelle de `npm run seed:admin` (ne pas commiter) |

Démarrage : `prestart` exécute `prisma generate`, puis `node scripts/ensure-prisma-schema.mjs` lance **`prisma migrate deploy`** (pas `db push` par défaut).

- **`SKIP_DB_MIGRATIONS=true`** : n’applique aucune migration au boot (déploiement spécial ; les tables ne seront pas créées).
- **`EMERGENCY_DB_PUSH=true`** : mode **urgence** — exécute `prisma db push` au lieu de `migrate deploy` (à éviter en prod sauf impasse).

## Cas 1 — Migrations déjà dans le dépôt (recommandé)

Après un push contenant `backend/prisma/migrations/`, sur Railway (shell du service) :

```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

Puis créer l’admin (mot de passe non stocké en dur) :

```bash
ADMIN_EMAIL=admin@gmail.com ADMIN_PASSWORD="votre-mot-de-passe" npm run seed:admin
```

**Si** `Missing script: "seed:admin"` (déploiement ancien ou image minimale) : exécutez le script directement, depuis `/app` (répertoire du service) :

```bash
ADMIN_EMAIL=admin@gmail.com ADMIN_PASSWORD="votre-mot-de-passe" node scripts/seed-admin.js
```

Remarque : ne pas lancer `seed:admin` seul en shell (ce n’est pas une commande) ; utiliser `npm run seed:admin` **ou** `node scripts/seed-admin.js` comme ci-dessus.

## Cas 2 — Générer la migration initiale en local (première fois)

Sur votre machine, avec un PostgreSQL accessible (`DATABASE_URL` dans `.env`) :

```bash
npx prisma migrate dev --name init --schema backend/prisma/schema.prisma
```

Puis valider, committer et pousser :

```bash
git add backend/prisma/migrations
git commit -m "add initial Prisma migration"
git push
```

Déploiement Railway, puis (shell) :

```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
ADMIN_PASSWORD="votre-mot-de-passe" npm run seed:admin
```

## Mode urgence uniquement (`db push`)

Si `migrate deploy` n’est vraiment pas possible (déploiement sans historique de migrations) :

```bash
npx prisma db push --schema backend/prisma/schema.prisma
ADMIN_PASSWORD="votre-mot-de-passe" npm run seed:admin
```

Préférez ensuite basculer sur des migrations versionnées pour les évolutions futures.

## Vérifications HTTP

- `GET /api/health` : `ok: true` et `tables.User`, `Property`, `Agent` à `true` si le schéma est en place.
- `GET /api/debug/db` : `schemaReady: true`, `hasDatabaseUrl: true` (jamais d’exposition de `DATABASE_URL`).

## Connexion admin (après seed)

- **E-mail** : celui passé à `npm run seed:admin` — par défaut `admin@gmail.com` (surcharge possible avec `ADMIN_EMAIL=...`).
- **Mot de passe** : **exactement** la valeur de `ADMIN_PASSWORD` utilisée **au moment** du `npm run seed:admin` (pas un mot de passe défini ailleurs).

### « E-mail ou mot de passe incorrect »

1. **Mauvais compte** : le premier utilisateur inscrit via l’API **inscription** obtient le rôle **admin** s’il n’y avait personne. Dans ce cas, connectez-vous avec **cet** e-mail, pas `admin@gmail.com`.
2. **Bootstrap Railway** : si `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` sont définis, un admin est créé **sous cet e-mail** au démarrage (une seule fois s’il n’existait pas). Utilisez **cet** e-mail, ou lancez `npm run seed:admin` pour forcer le compte `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. **Seed non exécuté** : sans `npm run seed:admin` (ni bootstrap), il n’y a **aucun** utilisateur `admin@gmail.com` — l’écran d’admin refusera la connexion.
4. **Mot de passe oublié** : exécutez à nouveau sur Railway (même `DATABASE_URL`)  
   `ADMIN_PASSWORD="nouveau" npm run seed:admin`  
   (éventuellement `ADMIN_EMAIL=...` si vous n’utilisez pas l’e-mail par défaut) pour mettre à jour le hash.
