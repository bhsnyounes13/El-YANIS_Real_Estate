# Hostinger (frontend) + Railway (API + Postgres)

Stack de référence : site statique sur `https://elyanis.com`, API Node sur un domaine distinct (sous-domaine `api.elyanis.com` ou URL Railway `*.up.railway.app`).

## Principes

- **Ne jamais** mettre `DATABASE_URL`, `JWT_ACCESS_SECRET` ou autres secrets **backend** dans le build Vite ou le dépôt public du front. Le navigateur ne doit voir que les variables préfixées `VITE_*` choisies explicitement.
- **Vite** : `import.meta.env.VITE_API_URL` est figé **au build**. Après toute modification de `VITE_API_URL`, lancer `npm run build` puis re-déployer le contenu de `dist/` sur Hostinger.
- **CORS + cookies** : le backend doit connaître l’URL exacte du site (`FRONTEND_ORIGIN`). Les requêtes `fetch` avec `credentials: "include"` (refresh token en cookie httpOnly) exigent CORS explicite (pas de `*`) et un cookie `SameSite=None; Secure` si le site et l’API sont sur des hôtes différents (cas Railway + elyanis.com).

## Variables (Railway — service API)

| Variable | Exemple / remarque |
|----------|---------------------|
| `DATABASE_URL` | Fourni par l’add-on PostgreSQL Railway (`${{ Postgres.DATABASE_URL }}` ou variable équivalente). **Uniquement côté serveur.** |
| `FRONTEND_ORIGIN` | `https://elyanis.com` ou liste : `https://elyanis.com,https://www.elyanis.com` (pas d’espace requis, sans `/` final). |
| `NODE_ENV` | `production` |
| `JWT_ACCESS_SECRET` | Secret aléatoire **≥ 32 caractères** (générer une valeur longue, ne pas commiter le vrai en clair). |
| `FORMS_REQUIRE_TURNSTILE` | `false` si vous n’utilisez pas Cloudflare Turnstile sur les formulaires, sinon conserver la valeur adaptée. |
| `TURNSTILE_SECRET_KEY` | (Optionnel) Si les formulaires publics exigent Turnstile en production. |
| `COOKIE_SAMESITE` | Par défaut en prod le code utilise `none` pour le cookie refresh cross-site. Réglage explicite : `none` (front et API sur des sites différents, HTTPS). |
| `COOKIE_SECURE` | En général `true` en production avec HTTPS. Avec `SameSite=none`, `Secure` doit rester `true` pour que le navigateur accepte le cookie. |
| `COOKIE_DOMAIN` | (Optionnel) Ex. partager le cookie sur plusieurs sous-domaines **uniquement** si l’API est sur le **même** domaine d’inscription (souvent laisser vide pour Railway + domaine public `*.up.railway.app`). |

**Note** : ce projet stocke les refresh tokens en base (opaque) ; il n’y a pas de `JWT_REFRESH_SECRET` distinct du flux « secret unique » `JWT_ACCESS_SECRET` pour le JWT d’accès. Ne pas confondre avec d’autres projets.

## Variables (Hostinger / build frontend)

Définir **au build** (fichier `.env.production` local ou interface CI, **pas** côté navigateur seul) :

```bash
VITE_API_URL=https://VOTRE_DOMAINE_API
```

Exemples :

- Sous-domaine : `VITE_API_URL=https://api.elyanis.com`
- Railway : `VITE_API_URL=https://VOTRE-SERVICE.up.railway.app`

Puis, sur la machine (ou le pipeline) :

```bash
npm run build
```

Déployer **tout** le dossier `dist/` (y compris `index.html`).

## Scripts npm (monorepo racine)

| Commande | Rôle |
|----------|------|
| `npm run build` | Build Vite (frontend) + écriture des redirects Netlify si configuré. |
| `npm start` | Démarrage de l’API compilée : `node backend/dist/index.js` (écoute `PORT`, défaut 3000). |
| `npm run build:api` | Compilation TypeScript du dossier `backend/`. |
| `npm run build:production` | `build` + `build:api` (monolithe API + `dist` optionnel côté Node). |

## Vérifier le backend

Dans le navigateur ou en ligne de commande :

```bash
curl -sS https://VOTRE_DOMAINE_API/api/health
```

Attendu (champs possibles) : `ok: true`, `service: "elyanis-backend"`, `env: "production"`.

## Vérifier le frontend / auth

1. Ouvrir `https://elyanis.com/admin/login` (ou votre domaine).
2. Dans les outils développeur → Réseau : les appels vers `/api/auth/refresh` ou `/api/auth/login` doivent viser le **domaine de l’API** (`VITE_API_URL`), **pas** `elyanis.com`, sauf si vous avez volontairement laissé `VITE_API_URL` vide et un reverse proxy sert l’API sur le même hôte.
3. Avant la connexion, `POST /api/auth/refresh` peut renvoyer **401** (normal sans cookie) ; il ne doit **pas** renvoyer **404** sur l’URL de l’API.
4. Après saisie de bons identifiants, la connexion doit aboutir (cookie refresh + JWT en mémoire).

## Checklist finale

- [ ] `curl https://<API>/api/health` → JSON avec `ok: true`.
- [ ] Railway : `FRONTEND_ORIGIN` = origin exacte du site (ex. `https://elyanis.com`).
- [ ] Build : `VITE_API_URL` = base HTTPS de l’API, **sans** slash final.
- [ ] Aucun secret backend dans le dépôt front ni dans le JS client.
- [ ] `npm run build` relancé après toute modification de `VITE_API_URL` ; `dist/` re-uploadé.
- [ ] Test connexion sur `/admin/login`.

## Dépannage 404 sur le domaine du site

Si le navigateur appelle `https://elyanis.com/api/...` et reçoit 404, le **build** n’embarque pas la bonne base : revérifier `.env.production` / variables CI, reconstruire et re-déployer `dist/`.

## Audit secrets (dépôt)

À la main avant mise en production :

- `JWT_ACCESS_SECRET` dans `.env` local : ne **pas** laisser `change-me-...` en production sur Railway.
- Aucun `DATABASE_URL` dans `src/` ou dans des fichiers Vite côté client.
- Aucun secret réel committé dans `.env` (déjà dans `.gitignore` — vérifier l’historique si besoin).
