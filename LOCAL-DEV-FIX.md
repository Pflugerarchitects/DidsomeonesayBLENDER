# Local Dev Fix - Load Projects from Bluehost

## Problem Identified
Local dev was failing to load projects because the `.env` file was missing, causing the API to default to `http://localhost/backend/api` instead of the Bluehost production API.

## Root Cause
**`src/utils/api.js:7`**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/backend/api';
```

Without `.env`, `VITE_API_URL` was undefined, so it fell back to localhost.

## Solution Applied

### 1. Created `.env` File ✅
```env
VITE_API_URL=https://vizzy.pflugerarchitects.com/api
```

### 2. Created `.env.example` for Documentation ✅
Reference file for future developers showing required environment variables.

### 3. Created `backend/config.example.php` ✅
Documents required backend configuration, particularly CORS settings.

### 4. Verified Backend Configuration ✅

**API Status:** ✅ Working
- API URL: `https://vizzy.pflugerarchitects.com/api/projects.php`
- HTTP Status: 200 OK
- Returns 10 projects with real data

**CORS Headers:** ✅ Properly Configured
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

The backend allows requests from **any origin** (including localhost:5173), so no CORS updates are needed on the server.

## How to Test

### Manual Restart Required
Stop any running dev servers and restart:

```bash
# Stop all node processes (Ctrl+C or close terminals)
# Then restart:
npm run dev
```

### Verify Connection
1. Dev server starts on `http://localhost:5173`
2. Open browser DevTools → Network tab
3. Look for requests to `https://vizzy.pflugerarchitects.com/api/projects.php`
4. Should see 200 OK status
5. Projects should load in the sidebar

### Expected Behavior
- ✅ Local dev → Bluehost API → Bluehost Database
- ✅ Production → Bluehost API → Bluehost Database
- ✅ Both environments use the same data source
- ✅ No localStorage fallback (pure API-driven)

## Files Modified

### Created
- `.env` - Environment variables (not in git)
- `.env.example` - Template for developers
- `backend/config.example.php` - Backend config template
- `LOCAL-DEV-FIX.md` - This documentation

### Already Existed
- `.gitignore` - Already excludes `.env` and `backend/config.php`
- Backend CORS is already configured correctly on Bluehost

## Technical Details

### Architecture
Both local and production use the same backend:
```
┌─────────────────┐         ┌──────────────────────┐
│  Local Dev      │         │  Production          │
│  localhost:5173 │────┐    │  vizzy.pfluger...    │
└─────────────────┘    │    └──────────────────────┘
                       │              │
                       │              │
                       ▼              ▼
              ┌─────────────────────────────┐
              │  Bluehost Backend           │
              │  vizzy.pfluger.../api       │
              │  ┌───────────────────────┐  │
              │  │ PHP API Endpoints     │  │
              │  │ - projects.php        │  │
              │  │ - images.php          │  │
              │  │ - upload.php          │  │
              │  │ - storage.php         │  │
              │  └───────────────────────┘  │
              │  ┌───────────────────────┐  │
              │  │ MySQL Database        │  │
              │  │ - vizzy_projects      │  │
              │  │ - vizzy_images        │  │
              │  └───────────────────────┘  │
              │  ┌───────────────────────┐  │
              │  │ File Storage          │  │
              │  │ /uploads/images/      │  │
              │  └───────────────────────┘  │
              └─────────────────────────────┘
```

### Why This Approach?
1. **Single Source of Truth** - All data stored on Bluehost
2. **No Sync Issues** - Local and production always have same data
3. **Multi-User Ready** - Multiple developers can work simultaneously
4. **Easy Deployment** - No data migration needed

## Troubleshooting

### If projects still don't load:

#### 1. Check .env is being read
```bash
# Restart dev server and check console output
npm run dev
# In browser console, check: import.meta.env.VITE_API_URL
```

#### 2. Check Network tab
- Open browser DevTools → Network
- Filter by "projects"
- Click the request to see details:
  - Request URL should be `https://vizzy.pflugerarchitects.com/api/projects.php`
  - Status should be 200
  - Response should contain JSON with projects array

#### 3. Check CORS
If you see CORS errors:
- Error: "No 'Access-Control-Allow-Origin' header"
- **Solution:** Backend config.php on Bluehost needs update:
  ```php
  define('ALLOWED_ORIGIN', '*');  // Allow all origins
  ```

#### 4. Check API directly
Test API in browser or curl:
```bash
curl https://vizzy.pflugerarchitects.com/api/projects.php
# Should return JSON with projects
```

## Success Indicators

✅ Dev server starts without errors
✅ Network requests go to `vizzy.pflugerarchitects.com`
✅ Projects list loads (10 projects shown)
✅ Images display from server URLs
✅ Upload, rename, delete operations work
✅ Storage meter shows usage (X GB / 10 GB)

## Next Steps

The fix is complete! Just restart your dev server:

```bash
npm run dev
```

Open http://localhost:5173 and verify projects load from Bluehost.

---

**Fixed:** 2025-11-20
**Issue:** Missing .env file causing API fallback to localhost
**Solution:** Created .env with VITE_API_URL=https://vizzy.pflugerarchitects.com/api
**Status:** ✅ Ready to test
