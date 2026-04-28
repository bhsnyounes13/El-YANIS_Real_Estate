# Deployed Site Fix - Quick Summary

## Current Status
- ❌ Frontend on Hostinger (elyanis.com) - Needs build configuration
- ❌ Backend on Render - Needs environment variables
- ❌ API connection failing because configuration is incomplete

---

## 3-Step Fix (30 minutes)

### Step 1: Configure Render Backend (10 minutes)

**Go to**: https://dashboard.render.com → Select your service

**Set these environment variables** (click Environment tab → Add):

```
NODE_ENV = production
DATABASE_URL = [Copy from Render PostgreSQL add-on]
JWT_ACCESS_SECRET = [Generate 32+ random characters]
PORT = 3000
FRONTEND_ORIGIN = https://elyanis.com,https://www.elyanis.com
COOKIE_SAMESITE = none
COOKIE_SECURE = true
FORMS_REQUIRE_TURNSTILE = false
```

**Generate JWT_ACCESS_SECRET**:
```bash
# On your computer, run this and copy the output:
openssl rand -base64 32
```

**After saving**, Render auto-redeploys. Wait 2-3 minutes for new build.

### Step 2: Get DATABASE_URL from Render (5 minutes)

1. Go to Render dashboard
2. Select the PostgreSQL add-on (under your service)
3. Copy the **Internal Connection String** or **Database URL**
4. Paste as `DATABASE_URL` environment variable

### Step 3: Configure Hostinger Frontend Build (15 minutes)

**Go to**: Hostinger Dashboard → Your site → Build & Deploy

**Set build command**:
```
npm ci && npm run build
```

**Set output directory**:
```
dist
```

**Add environment variable** (critical!):
```
VITE_API_URL = https://elyanis-backend-standalone-production.up.railway.app
```

**Click Save** - Hostinger auto-rebuilds and deploys.

---

## Verify Everything Works

### 1. Test Backend
```bash
# Should return 200 OK
curl https://elyanis-backend-standalone-production.up.railway.app/api/health

# Expected response:
# {"status":"ok"}
```

### 2. Test CORS
```bash
curl -i -X OPTIONS \
  -H "Origin: https://elyanis.com" \
  https://elyanis-backend-standalone-production.up.railway.app/api/properties

# Should see:
# Access-Control-Allow-Origin: https://elyanis.com
# Access-Control-Allow-Credentials: true
```

### 3. Test Frontend
1. Open https://elyanis.com in browser
2. Press F12 (DevTools)
3. Go to Network tab
4. Refresh page
5. Should see API requests going to Render backend
6. No CORS errors in console

### 4. Test Admin Panel
1. Go to https://elyanis.com/admin
2. Login with:
   - Email: `admin@elyanis.com` (or what you set as `BOOTSTRAP_ADMIN_EMAIL`)
   - Password: (what you set as `BOOTSTRAP_ADMIN_PASSWORD`)
3. Try creating a property or viewing dashboard
4. Should work without errors

---

## If Something Still Fails

### Backend won't start
- Check Render logs (Dashboard → Logs tab)
- Most common: DATABASE_URL or JWT_ACCESS_SECRET missing
- Verify both are set and click Save

### Frontend shows 404
- Check Hostinger build logs
- Verify VITE_API_URL environment variable is set
- Trigger manual rebuild in Hostinger

### CORS errors in browser console
- Verify `FRONTEND_ORIGIN` on Render is exactly: `https://elyanis.com,https://www.elyanis.com`
- Verify backend `/api/health` returns 200
- Clear browser cache (Ctrl+Shift+Delete)

### API returns 401 or authentication fails
- Verify JWT_ACCESS_SECRET is set on Render
- Make sure it's ≥ 32 characters
- Redeploy backend

---

## Detailed Guides

For more detailed information:
- **Render setup**: See `RENDER_SETUP.md`
- **Hostinger setup**: See `HOSTINGER_SETUP.md`
- **Full deployment guide**: See `DEPLOYMENT_FIX.md`

---

## Environment Variables Checklist

### Render Dashboard

- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = (from PostgreSQL add-on)
- [ ] `JWT_ACCESS_SECRET` = (32+ chars)
- [ ] `PORT` = `3000`
- [ ] `FRONTEND_ORIGIN` = `https://elyanis.com,https://www.elyanis.com`
- [ ] `COOKIE_SAMESITE` = `none`
- [ ] `COOKIE_SECURE` = `true`
- [ ] Backend starts successfully (check Logs)
- [ ] `/api/health` returns 200

### Hostinger Build Settings

- [ ] Build command = `npm ci && npm run build`
- [ ] Output directory = `dist`
- [ ] `VITE_API_URL` = `https://elyanis-backend-standalone-production.up.railway.app`
- [ ] Build completes successfully (check Deployments)
- [ ] Frontend loads at https://elyanis.com (HTTP 200)

### Final Verification

- [ ] Admin panel login works
- [ ] Can create/edit properties
- [ ] Network tab shows API requests to Render backend
- [ ] No CORS or 401 errors in console

---

## Support

If you need help:
1. Check the detailed guides: `RENDER_SETUP.md`, `HOSTINGER_SETUP.md`
2. Look at application logs:
   - Render: Dashboard → Logs tab
   - Hostinger: Dashboard → Deployments → Build logs
3. Test endpoints with curl commands above
4. Check browser DevTools Network tab for error details
