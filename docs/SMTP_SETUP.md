# Configuration SMTP (production, Railway, Hostinger, etc.)

Le transport est centralisé dans `backend/src/services/mailer.ts` (Nodemailer). Aucun secret n’est écrit dans les réponses API ni dans les logs applicatifs (hors message d’erreur réseau fournisseur, sans mot de passe).

## Variables d’environnement (Railway / `.env` serveur)

| Variable | Obligatoire pour l’envoi | Rôle |
|----------|-------------------------|------|
| `SMTP_HOST` | Oui | Hôte (ex. `smtp.hostinger.com`) |
| `SMTP_PORT` | Non | défaut **465** ; mettre `587` si 465 est bloqué |
| `SMTP_USER` | Oui | **Adresse e-mail complète** du compte |
| `SMTP_PASS` | Oui | Mot de passe de la boîte ou **mot de passe d’application** (Gmail) |
| `SMTP_FROM` | Oui | En-tête `From`, ex. `"EL-YANIS <contact@elyanis.com>"` |
| `SMTP_NOTIFY_TO` | Recommandé | Destinataire des **notifications** formulaire contact + demande bien. Sans cela, l’e-mail d’alerte n’est pas envoyé (l’enregistrement en base a lieu quand même). |
| `DEBUG_EMAIL_TOKEN` | Optionnel (prod) | Long jeton aléatoire. Requis en **production** pour `GET /api/debug/smtp` et `POST /api/debug/send-test-email` (sauf si `NODE_ENV` ≠ `production`) |

**Ne jamais** mettre `SMTP_PASS` ou `DEBUG_EMAIL_TOKEN` dans le frontend Vite (`.env` client).

### Hostinger (e-mail hébergé)

Port **465** (TLS) :

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@elyanis.com
SMTP_PASS=le_mot_de_passe_reel_ou_mot_d_application
SMTP_FROM="EL-YANIS <contact@elyanis.com>"
SMTP_NOTIFY_TO=contact@elyanis.com
```

Si **465** échoue (timeout, connexion) depuis Railway, testez le port **587** (STARTTLS, `secure: false` géré quand le port n’est pas 465) :

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
```

### Dépannage côté logs Railway

- **`EAUTH` / 535** : mauvais `SMTP_USER` / `SMTP_PASS` (ou mot de passe expiré).
- **`ENOTFOUND`** : `SMTP_HOST` incorrect ou DNS.
- **`ETIMEDOUT`** : le réseau Railway n’atteint pas l’hôte:port. Essayez le port 587, ou un autre fournisseur.
- **`ECONNREFUSED` / `ECONNRESET` / `ECONNECTION`** : pare-feu, port fermé, ou incompatibilité TLS.
- **Certificat / TLS** : mauvais couple host/port, ou politique stricte côté fournisseur. N’enlevez le contrôle des certificats en prod qu’en dernier recours (non implémenté ici par défaut).

Dans l’onglet **Logs** du service, recherchez `[SMTP_ERROR]`, `[SMTP_DEBUG_ERROR]`, `smtp_notification_failed`.

## Routes de test (développement et debug prod)

- **`GET /api/debug/smtp`** : `transporter.verify()` + résumé non confidentiel.  
- **`POST /api/debug/send-test-email`** : body JSON `{ "to": "vous@exemple.com" }`.

**Production** : ajouter l’en-tête  
`x-debug-token: <valeur de DEBUG_EMAIL_TOKEN>`.  
Sans jeton, réponse **403**.  
**Développement** : pas de jeton requis.

Exemples (curl) :

```bash
curl -sS "https://<votre-api>.up.railway.app/api/debug/smtp" -H "x-debug-token: $DEBUG_EMAIL_TOKEN"

curl -sS -X POST "https://<votre-api>.up.railway.app/api/debug/send-test-email" \
  -H "Content-Type: application/json" \
  -H "x-debug-token: $DEBUG_EMAIL_TOKEN" \
  -d '{"to":"vous@exemple.com"}'
```

Avec la **CLI Railway** (déployé à jour) :

```bash
railway variable set DEBUG_EMAIL_TOKEN="$(openssl rand -hex 32)"
# puis test depuis votre machine si l’URL publique est autorisée en CORS (GET /api/debug/smtp côté navigateur requiert l’en-tête ; curl est plus simple).
```

## Démarrage

Au boot, l’API journalise (sans mot de passe) :

```text
[SMTP_CONFIG] { host, port, userExists, passExists, from }
```

## Si le SMTP hébergeur reste instable

Les fournisseurs **transactionnels** (API HTTP, relais fiables) limitent souvent les problèmes depuis PaaS : **Resend**, **Brevo**, **Mailgun**, **SendGrid** — générer un SMTP / token dans leur interface et remplir les mêmes variables. Pas de code multi-fournisseur ici : remplacez seulement host/port/credentials.

## Comportement des formulaires publics

Si `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` et `SMTP_NOTIFY_TO` sont **tous** définis, une **notification** est envoyée après l’enregistrement. Si l’envoi **échoue**, l’API répond **503** avec un corps du type `{ "ok": false, "error": "EMAIL_SEND_FAILED", "message": "Email could not be sent", "id": "<id enregistré>" }` (la ligne existe déjà en base). Si SMTP n’est **pas** configuré, la réponse reste **201** sans tenter l’e-mail.
