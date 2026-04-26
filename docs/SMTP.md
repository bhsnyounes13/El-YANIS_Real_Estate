# Envoi d’e-mails (SMTP)

Guide complet (Hostinger, erreurs, Railway, routes de test) : **[SMTP_SETUP.md](SMTP_SETUP.md)**.

L’API peut envoyer une **notification** lorsqu’un visiteur soumet le formulaire **Contact** ou une **demande liée à un bien**. Le transport est implémenté dans `backend/src/services/mailer.ts`. Si la notification est **activée** (toutes les variables SMTP + `SMTP_NOTIFY_TO`) et que l’envoi **échoue**, l’API répond **503** avec `EMAIL_SEND_FAILED` (l’enregistrement en base est déjà fait).

## Variables (Railway ou `.env`)

| Variable | Exemple | Rôle |
|----------|---------|------|
| `SMTP_HOST` | `smtp.gmail.com` | Serveur sortant |
| `SMTP_PORT` | `465` (défaut) ou `587` | 465 = TLS direct (`secure: true`) ; 587 = STARTTLS |
| `SMTP_USER` | adresse du compte mail | Authentification |
| `SMTP_PASS` | mot de passe d’application | **Ne jamais commiter** |
| `SMTP_FROM` | `"EL-YANIS <noreply@votredomaine.com>"` | Expéditeur (From) |
| `SMTP_NOTIFY_TO` | `contact@votredomaine.com` | Destinataire des alertes |

Si l’une des variables `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` manque, **aucun** e-mail n’est envoyé. Sans `SMTP_NOTIFY_TO`, pas d’envoi non plus (évite d’envoyer sans cible claire).

## Gmail (compte Google)

1. Activez la **validation en deux étapes** sur le compte Google.
2. Créez un **mot de passe d’application** : [Compte Google → Sécurité → Mots de passe des applications](https://myaccount.google.com/apppasswords).
3. Utilisez ce mot de passe (16 caractères) dans `SMTP_PASS`, **pas** le mot de passe du compte web.

Exemple :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votrecompte@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM="EL-YANIS <votrecompte@gmail.com>"
SMTP_NOTIFY_TO=votrecompte@gmail.com
```

## Autres fournisseurs

- **Brevo (ex-Sendinblue), Mailgun, Postmark** : suivez leur doc « SMTP » (host, port, user, mot de passe API).
- **Outlook / Microsoft 365** : souvent `smtp.office365.com`, port `587`, `SMTP_SECURE=false`.

## Débogage

En cas d’échec d’envoi lorsque la notification est activée, l’API renvoie **503** et journalise l’échec ; voir [SMTP_SETUP.md](SMTP_SETUP.md). Routes ` /api/debug/smtp` et `/api/debug/send-test-email` pour tester la connexion.

Ne commitez jamais `SMTP_PASS` ; définissez-le uniquement dans les **variables d’environnement** du service (Railway, etc.).

---

## Configuration avec la CLI Railway

Prérequis : [Railway CLI](https://docs.railway.com/develop/cli) installée (`npm i -g @railway/cli` ou binaire officiel).

### 1. Connexion et projet

Dans le dossier du dépôt (racine `package.json`) :

```bash
railway login
railway link
```

`railway link` associe le répertoire courant à un projet / service / environnement Railway. Vérifiez avec :

```bash
railway status
```

Si vous avez **plusieurs services** (ex. API seule), ciblez le service API :

```bash
railway link -s "<nom-du-service-api>"
```

### 2. Définir les variables SMTP (sans exposer le secret dans l’historique)

**Recommandé pour `SMTP_PASS`** : lire la valeur depuis l’entrée standard (évite de la coller en clair dans l’historique du terminal) :

**PowerShell (Windows)** — saisie masquée puis envoi via stdin (recommandé pour `SMTP_PASS`) :

```powershell
$p = Read-Host "Mot de passe d'application (Gmail, etc.)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($p)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
$plain | railway variable set SMTP_PASS --stdin
```

Autres clés (pas de secret dans l’exemple) :

```powershell
railway variable set SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_SECURE=false
railway variable set SMTP_USER=votrecompte@gmail.com
railway variable set "SMTP_FROM=EL-YANIS <votrecompte@gmail.com>"
railway variable set SMTP_NOTIFY_TO=contact@elyanis.com
```

> **Attention** : `SMTP_PASS=...` en une seule commande enregistre le secret dans l’**historique** du terminal. Préférez `--stdin` pour le mot de passe.

**Bash / zsh (macOS, Linux, Git Bash)** :

```bash
railway variable set SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_SECURE=false
railway variable set SMTP_USER=votrecompte@gmail.com
railway variable set 'SMTP_FROM=EL-YANIS <votrecompte@gmail.com>'
railway variable set SMTP_NOTIFY_TO=contact@elyanis.com
printf '%s' 'votre_mot_de_passe_application' | railway variable set SMTP_PASS --stdin
```

**Service explicite** (si l’API n’est pas le service lié par défaut) :

```bash
railway variable set -s "<nom-service-api>" SMTP_HOST=smtp.gmail.com
```

**Environnement** (production / staging) :

```bash
railway variable set -e production SMTP_HOST=smtp.gmail.com
```

### 3. Lister et vérifier (les valeurs sensibles peuvent être masquées)

```bash
railway variable list
```

### 4. Déploiement

Chaque `variable set` déclenche en général un **redéploiement** du service. Pour enregistrer plusieurs clés sans un déploiement à chaque fois :

```bash
railway variable set --skip-deploys SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_USER=...
# … puis une dernière fois sans --skip-deploys, ou déclenchez un deploy depuis le dashboard.
```

### 5. PostgreSQL

`DATABASE_URL` est en principe injectée par le **plugin PostgreSQL** Railway (service lié) ; ne la remplacez pas par des variables SMTP. Gardez SMTP et la base sur le **même service API** si l’app Node est ce service.

> La CLI doit être exécutée sur **votre machine** (ou CI avec `RAILWAY_TOKEN`) : personne d’autre ne peut appliquer les variables à votre place sans accès au compte.