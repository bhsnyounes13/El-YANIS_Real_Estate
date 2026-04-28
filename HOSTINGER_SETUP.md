# Hostinger Frontend Deployment Guide

## Configuration Overview

- **Build Command**: `npm ci && npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite (SPA - Single Page Application)
- **API Backend**: Render (`https://elyanis-backend-standalone.onrender.com`)

## Hostinger Build Settings

### 1. Access Build Settings
1. Log in to **Hostinger Dashboard**
2. Select your website (elyanis.com)
3. Go to **Website Settings** → **Build & Deploy** (or **Dev Tools**)
4. Find **Build Settings** section

### 2. Set Build Command
```
npm ci && npm run build
```

This command:
- `npm ci` - Clean install dependencies (recommended for CI/CD)
- `npm run build` - Build the SPA with Vite

### 3. Set Output Directory
```
dist
```

This is where Vite outputs the compiled static files.

### 4. Add Environment Variables

**Critical**: Add this environment variable for the build to inject the API URL:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://elyanis-backend-standalone.onrender.com` |

**Optional (add if needed)**:

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_BASE_PATH` | `/` | (Keep default unless app is in subdirectory) |
| `NODE_ENV` | `production` | Production build mode |

#### How to Add Environment Variables in Hostinger:
1. In **Build Settings**, find **Environment Variables** section
2. Click **+ Add Variable**
3. Enter `VITE_API_URL` as the key
4. Enter `https://elyanis-backend-standalone.onrender.com` as the value
5. Click **Save** or **Save Environment Variable**

### 5. Save Build Configuration
- Click **Save** button
- Hostinger should automatically trigger a rebuild

## Verify Frontend Build Works

### Check Build Logs
1. Go to **Deployments** tab in Hostinger
2. Click latest deployment
3. Check logs for:
   - `npm ci` output (dependencies)
   - `vite build` output (bundling)
   - Should end with: `✓ built in XXXms`
   - Should have NO errors

### Test Frontend Locally (Before Committing)
```bash
# From project root
npm ci
VITE_API_URL=https://elyanis-backend-standalone.onrender.com npm run build
npm run preview
```

Then open http://localhost:4173 in your browser and:
1. Click on properties or try to load any page that uses the API
2. Open DevTools → Network tab
3. Check that API requests go to `https://elyanis-backend-standalone-production.up.railway.app`
4. Should see 200 OK responses

### Test on Hostinger After Deploy
1. Open https://elyanis.com
2. Open DevTools → Network tab
3. Refresh the page (Ctrl+Shift+R for hard refresh)
4. Look for API calls - they should be going to Render backend
5. No CORS errors should appear

## Enable Auto-Deploy from Git (Optional but Recommended)

### Method 1: GitHub Webhook
1. In Hostinger → **Build & Deploy** → **Connect Repository**
2. Connect to your GitHub account
3. Select your repository and branch (main/master)
4. Enable "Auto Deploy"
5. Now: Every push to main automatically triggers a build on Hostinger

### Method 2: Manual Rebuild
1. Push code to GitHub
2. In Hostinger → **Deployments**
3. Click **Deploy** or **Rebuild**

## Frontend File Structure

After build completes, Hostinger serves these files:

```
dist/
├── index.html          # Entry point (served for all routes)
├── assets/
│   ├── index-*.js      # Main React app bundle
│   ├── vendor-*.js     # Dependencies (React, TanStack Query, etc)
│   └── index-*.css     # Styles
└── ...other static files
```

**Important**: The `index.html` file is served for all routes (SPA routing) - this is configured in Hostinger automatically.

## Environment Variables Reference

### VITE_API_URL
- **What**: Full URL to the backend API (no trailing slash)
- **Example**: `https://elyanis-backend-standalone-production.up.railway.app`
- **When**: Must be set during build time (cannot be changed after deploy)
- **Frontend Uses**: To make API requests to backend

### VITE_BASE_PATH
- **What**: Base path if app is served from a subdirectory
- **Default**: `/` (root)
- **Example**: `/app/` if served at domain.com/app/
- **When**: Only needed if not serving from root

## Troubleshooting

### Frontend Builds but Shows 404
- **Cause**: Hostinger not serving `index.html` for all routes
- **Fix**: Check that **SPA fallback** is enabled (usually automatic for Vite)
- **Or**: Deploy fails silently - check build logs

### API Calls Return 404
- **Cause**: Frontend built without `VITE_API_URL` environment variable
- **Fix**:
  1. Verify `VITE_API_URL` is set in Hostinger Build Settings
  2. Redeploy or rebuild manually
  3. Check build logs - should see API URL being used

### CORS Errors in Console
```
Access to XMLHttpRequest blocked by CORS policy
```
- **Cause**: Backend not allowing requests from elyanis.com
- **Check**:
  1. Backend `/api/health` endpoint returns 200
  2. CORS preflight returns correct headers
  3. `FRONTEND_ORIGIN` set correctly on Render

### Blank Page or Errors on Load
1. **Check**: https://elyanis.com works (HTTP 200)
2. **DevTools**: Check for JavaScript errors
3. **Network Tab**: Check if `assets/` files load (200 OK)
4. **Console**: Look for error messages

### Build Command Fails
Common errors:
- **`npm ci` fails**: Check Node version (should be ≥ 20)
- **`npm run build` fails**: Check build logs for specific error
- **TypeScript errors**: Usually compilation issues in source code

## Optimization (Optional)

### Enable Caching
In Hostinger (if available):
- Set cache headers for `/assets/*` files
- Recommended: `public, max-age=31536000, immutable`

### Monitor Performance
1. Use Google PageSpeed Insights: https://pagespeed.web.dev/?url=https%3A%2F%2Felyanis.com
2. Check asset sizes in Network tab
3. Monitor Core Web Vitals

## Security Headers

Hostinger should be serving these headers (already configured in `vercel.json` if using CF Workers):

```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

These are configured in frontend code but Hostinger may override.

## Debugging Build Issues

### View Full Build Output
1. Go to **Deployments** → Latest deployment
2. Click to expand logs
3. Search for:
   - `ERROR` - Build failures
   - `Warning` - Non-critical issues
   - `dist/` - Size and file count

### Local Reproduction
If build fails on Hostinger, reproduce locally:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci

# Set environment variable
export VITE_API_URL=https://elyanis-backend-standalone-production.up.railway.app

# Build
npm run build

# Check output
ls -la dist/
```

If this works locally but fails on Hostinger:
- Check Node version on Hostinger (should match `.nvmrc`)
- Check if all dependencies installed correctly
- Try clearing Hostinger build cache and rebuilding
