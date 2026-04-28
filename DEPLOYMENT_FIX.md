# Fixing the Deployed Site (Hostinger Frontend + Render Backend)

## Current Setup
- **Frontend**: Hostinger (elyanis.com) - Static SPA
- **Backend**: Render (elyanis-backend-standalone-production.up.railway.app) - Node.js API
- **Database**: Render PostgreSQL

## Issue: API Connection Failing

### Root Cause
The frontend needs to be built with the correct `VITE_API_URL` environment variable pointing to the Render backend, and the backend must have proper CORS and database configuration.

---

## Fix #1: Frontend Build on Hostinger

### Steps
1. **In Hostinger Build Settings:**
   - Set build command: `npm ci && npm run build`
   - Set output directory: `dist`
   - Add environment variable for build:
     ```
     VITE_API_URL=https://elyanis-backend-standalone-production.up.railway.app
     ```

2. **Verify .env.production exists** (it's already in the repo):
   ```
   VITE_API_URL=https://elyanis-backend-standalone-production.up.railway.app
   ```

3. **Test locally before deploying**:
   ```bash
   npm ci
   VITE_API_URL=https://elyanis-backend-standalone-production.up.railway.app npm run build
   npm run preview
   ```
   Then open http://localhost:4173 and check Network tab to see API calls.

---

## Fix #2: Render Backend Configuration

### Environment Variables (Set in Render Dashboard)

Required variables:
```
NODE_ENV=production
DATABASE_URL=postgresql://...from render dashboard...
JWT_ACCESS_SECRET=your-secret-min-32-chars
FRONTEND_ORIGIN=https://elyanis.com,https://www.elyanis.com
PORT=3000
FORMS_REQUIRE_TURNSTILE=false
SKIP_DB_MIGRATIONS=false
```

Optional but recommended:
```
LOG_LEVEL=info
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
COOKIE_SAMESITE=none
COOKIE_SECURE=true
```

### How to Set on Render
1. Go to your "elyanis" service on Render dashboard
2. Click **"Environment"** tab
3. Add each variable as a new row
4. Click **"Save"** - this will trigger a new deploy

### Health Check Setup
- Health Check Path: `/api/health`
- Health Check Protocol: `HTTP`
- Health Check Interval: `10 minutes`

---

## Fix #3: Verify Connectivity

### Test Backend Health
```bash
curl -i https://elyanis-backend-standalone-production.up.railway.app/api/health
# Should return 200 OK with JSON response
```

### Test CORS Configuration
```bash
curl -i -X OPTIONS \
  -H "Origin: https://elyanis.com" \
  -H "Access-Control-Request-Method: GET" \
  https://elyanis-backend-standalone-production.up.railway.app/api/properties

# Should return 200 with CORS headers
```

### Test API Endpoint
```bash
curl -i https://elyanis-backend-standalone-production.up.railway.app/api/properties
# Should return 200 with property list JSON
```

---

## Fix #4: Database Migrations

### One-Time Setup
If this is the first deployment, the database needs to be initialized:

1. **Option A**: Automatic (recommended)
   - Set `SKIP_DB_MIGRATIONS=false` in Render
   - Deploy - migrations run automatically before server starts

2. **Option B**: Manual
   ```bash
   # In Render shell or via Railway CLI:
   npm ci --include=dev
   npx prisma migrate deploy --schema backend/prisma/schema.prisma
   ```

### Seed Admin User
After migrations, create bootstrap admin:
```bash
# In Render shell:
NODE_ENV=production npm run seed:admin
```

Or via environment variables:
```
BOOTSTRAP_ADMIN_EMAIL=admin@yoursite.com
BOOTSTRAP_ADMIN_PASSWORD=your-secure-password
```

---

## Fix #5: CORS & Cookie Configuration

### Why CORS Fails
Cross-origin requests from `https://elyanis.com` to Render backend require:
1. Backend allows the origin (✅ Already configured via `FRONTEND_ORIGIN`)
2. Credentials cookie config (`sameSite: none`, `secure: true`)
3. Preflight requests (OPTIONS) allowed (✅ Configured in app.ts)

### Cookie Configuration for Cross-Origin
Set on Render:
```
COOKIE_SAMESITE=none
COOKIE_SECURE=true
COOKIE_DOMAIN=.elyanis.com
```

This allows refresh tokens to work across `elyanis.com` and `www.elyanis.com`.

---

## Deployment Checklist

- [ ] Frontend build configured on Hostinger with `VITE_API_URL` environment variable
- [ ] Backend environment variables set on Render dashboard
- [ ] Database URL verified (from Render dashboard)
- [ ] JWT_ACCESS_SECRET set (minimum 32 characters)
- [ ] FRONTEND_ORIGIN set to `https://elyanis.com,https://www.elyanis.com`
- [ ] `/api/health` endpoint returns 200
- [ ] CORS preflight (OPTIONS) works for frontend domain
- [ ] Database migrations deployed (`npm run db:migrate:deploy`)
- [ ] Admin user seeded or bootstrap credentials set
- [ ] Frontend deployed on Hostinger
- [ ] Test login and property creation in admin panel

---

## Troubleshooting

### 404 Error on Backend
**Solution**: Render app might not be running. Check:
1. Render service logs: https://dashboard.render.com → your service → "Logs"
2. Ensure `npm start` command is set in Render
3. Check DATABASE_URL is valid and accessible

### CORS Errors in Console
**Solution**: Verify CORS headers in response:
```bash
curl -i -H "Origin: https://elyanis.com" \
  https://elyanis-backend-standalone-production.up.railway.app/api/health
```

Should include:
```
Access-Control-Allow-Origin: https://elyanis.com
Access-Control-Allow-Credentials: true
```

### Frontend Building but No API
**Solution**: Ensure `VITE_API_URL` is set during build time on Hostinger:
1. Check build logs in Hostinger
2. Verify environment variable is saved
3. Rebuild manually if needed

### Database Connection Error
**Solution**: Verify DATABASE_URL on Render:
```bash
# Should output connection status
npm run check:db
```

---

## Quick Deploy Commands

### Deploy Frontend (Hostinger)
```bash
git push # Automatic build if webhook configured
# OR manually rebuild in Hostinger dashboard
```

### Deploy Backend (Render)
```bash
git push # Automatic redeploy if connected to GitHub
# OR manually trigger in Render dashboard
```

### Update Environment Variables
1. Go to Render dashboard service
2. Environment tab
3. Edit variable
4. Click Save → auto-redeploy
