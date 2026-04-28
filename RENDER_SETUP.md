# Render Dashboard Configuration Guide

## Service Name
`elyanis-backend-standalone-production`

## Build Command
```
npm ci --include=dev && npm run build:production
```

## Start Command
```
npm start
```

## Health Check
- Path: `/api/health`
- Protocol: `HTTP`
- Interval: `10 minutes`

## Environment Variables (Set in Render Dashboard)

### Required Variables

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Enables production mode validation |
| `DATABASE_URL` | `postgresql://username:password@hostname:port/dbname?schema=public` | Get from Render PostgreSQL add-on |
| `JWT_ACCESS_SECRET` | (generate: min 32 chars) | Use strong random string |
| `PORT` | `3000` | Default HTTP port |
| `FRONTEND_ORIGIN` | `https://elyanis.com,https://www.elyanis.com` | Comma-separated, no spaces |

### CORS & Cookie Configuration

| Key | Value | Purpose |
|-----|-------|---------|
| `COOKIE_SAMESITE` | `none` | Allow cross-origin cookies |
| `COOKIE_SECURE` | `true` | HTTPS only cookies |
| `COOKIE_DOMAIN` | `.elyanis.com` | Share cookies across subdomains |

### Optional but Recommended

| Key | Value | Purpose |
|-----|-------|---------|
| `LOG_LEVEL` | `info` | Log verbosity (debug/info/warn/error) |
| `FORMS_REQUIRE_TURNSTILE` | `false` | Disable CAPTCHA requirement (for testing) |
| `SKIP_DB_MIGRATIONS` | `false` | Run migrations on startup |
| `TURNSTILE_SECRET_KEY` | (your key) | Cloudflare Turnstile for forms |

### Bootstrap Admin (for first login)

| Key | Value |
|-----|-------|
| `BOOTSTRAP_ADMIN_EMAIL` | `admin@elyanis.com` |
| `BOOTSTRAP_ADMIN_PASSWORD` | (secure password) |

## Steps to Configure on Render

1. **Go to Dashboard**: https://dashboard.render.com
2. **Select Service**: `elyanis-backend-standalone-production`
3. **Click "Environment"** tab
4. **Add Variables**: For each variable above, click **Add Environment Variable**
5. **Key**: Exact name from table
6. **Value**: Exact value from table
7. **Click "Save"** - This triggers automatic redeploy

## Verify Configuration

### After Deploy Completes:

1. **Check Health Endpoint**:
   ```bash
   curl https://elyanis-backend-standalone-production.up.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Check CORS Headers**:
   ```bash
   curl -i -X OPTIONS \
     -H "Origin: https://elyanis.com" \
     https://elyanis-backend-standalone-production.up.railway.app/api/properties
   ```
   Should include:
   ```
   Access-Control-Allow-Origin: https://elyanis.com
   Access-Control-Allow-Credentials: true
   ```

3. **Check Logs** (in Render dashboard → Logs tab):
   - Should see: `[APP_START]` with configuration details
   - Should NOT see database connection errors

## Troubleshooting

### Service Won't Start
- **Check Logs**: Dashboard → Logs tab, look for error messages
- **Most Common**: Missing `DATABASE_URL` or `JWT_ACCESS_SECRET`
- **Fix**: Add missing variables, click Save

### Database Connection Error
- **Error**: `Can't reach database server at...`
- **Cause**: DATABASE_URL is wrong or PostgreSQL add-on not provisioned
- **Fix**: In Render dashboard → **Add-ons** → Create new PostgreSQL → Copy DATABASE_URL

### JWT_ACCESS_SECRET Too Short
- **Error**: `JWT_ACCESS_SECRET trop court` (< 32 characters)
- **Fix**: Generate strong 32+ character string
  ```bash
  # On your computer:
  openssl rand -base64 32
  # Then copy and paste into Render
  ```

### CORS Errors in Frontend Console
- **Error**: `Access to XMLHttpRequest blocked by CORS policy`
- **Check**: FRONTEND_ORIGIN is set to `https://elyanis.com,https://www.elyanis.com`
- **Verify**: Run the curl command above to test CORS headers

## First Time Deploy Checklist

- [ ] All 5 required variables set (NODE_ENV, DATABASE_URL, JWT_ACCESS_SECRET, PORT, FRONTEND_ORIGIN)
- [ ] JWT_ACCESS_SECRET is ≥ 32 characters
- [ ] DATABASE_URL points to valid PostgreSQL (test with `psql` command if available)
- [ ] FRONTEND_ORIGIN matches your Hostinger domain
- [ ] Service deploy completes successfully (check Logs)
- [ ] `/api/health` returns 200 OK
- [ ] CORS preflight request succeeds
- [ ] Frontend on Hostinger is built with correct `VITE_API_URL`
- [ ] Admin panel login works

## One-Time Setup: Database Initialization

After first successful deployment, initialize the database:

### Option 1: Via Render Shell
1. Go to service → **Shell** tab
2. Run:
   ```bash
   npm ci --include=dev
   npx prisma migrate deploy --schema backend/prisma/schema.prisma
   npx prisma db seed --schema backend/prisma/schema.prisma
   ```

### Option 2: Via Node Shell with Migration Command
In environment, set:
- `SKIP_DB_MIGRATIONS=false` (default)

This runs migrations automatically on next deploy.

### Create Admin User
After migrations, create bootstrap admin:
1. Set variables:
   - `BOOTSTRAP_ADMIN_EMAIL=admin@elyanis.com`
   - `BOOTSTRAP_ADMIN_PASSWORD=YourSecurePassword`
2. Redeploy (click Save)
3. Login at `https://elyanis.com/admin` with these credentials

## Security Notes

- Never commit `.env` files with secrets
- Rotate `JWT_ACCESS_SECRET` if compromised
- Use strong passwords for `BOOTSTRAP_ADMIN_PASSWORD`
- Enable `TURNSTILE_SECRET_KEY` for production (prevents spam)
- Keep `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none` for production
