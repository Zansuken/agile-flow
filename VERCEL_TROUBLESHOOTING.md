# 🔧 Vercel Deployment Troubleshooting Guide

## ❌ Common Issues and Solutions

### Issue 1: Environment Variable References Secret Error
```
Environment Variable "VITE_API_BASE_URL" references Secret "vite_api_base_url", which does not exist.
```

**Solution:**
1. Remove the `env` section from `vercel.json` (this is now fixed)
2. Set environment variables through Vercel dashboard instead:
   - Go to your project on Vercel
   - Settings → Environment Variables
   - Add each variable manually

### Issue 2: Build Command Not Found
```
Error: Build command failed with exit code 1
```

**Solution:**
Update your Vercel project settings:
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

### Issue 3: 404 on React Routes
```
Page not found when accessing /projects or /dashboard directly
```

**Solution:**
The `vercel.json` rewrites configuration handles this:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue 4: Environment Variables Not Loading
```
Firebase: Error (auth/invalid-api-key)
```

**Solution:**
1. Double-check all environment variables are set in Vercel dashboard
2. Ensure variable names start with `VITE_`
3. Redeploy after adding variables
4. Check the deployment logs for missing variables

## ✅ Step-by-Step Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your `agile-flow` repository

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: Leave empty (project root)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

3. **Deploy First Time**
   - Click "Deploy"
   - Wait for build to complete (will fail due to missing env vars)

4. **Add Environment Variables**
   - Go to Project Dashboard
   - Settings → Environment Variables
   - Add all `VITE_*` variables from your Firebase config
   - Set `VITE_API_BASE_URL` to `http://localhost:3001` temporarily

5. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI (optional, you can use npx)
npm install -g vercel

# Deploy from project root
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? (your account)
# Link to existing project? N
# Project name? agile-flow
# Directory with code? ./
# Auto-detect settings? N
# Build Command? cd frontend && npm run build
# Output Directory? frontend/dist
```

## 🔗 Environment Variables Setup

### Firebase Configuration
Get these from your Firebase project console:

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps"
5. Click on your web app or create one
6. Copy the config values

### Vercel Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
VITE_API_BASE_URL=https://your-backend.railway.app
```

## 🚀 Quick Fix Commands

### Force Redeploy
```bash
# Using Vercel CLI
vercel --prod

# Or trigger via git
git commit --allow-empty -m "trigger deployment"
git push origin main
```

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on a deployment to see logs

### Test Local Build
```bash
cd frontend
npm run build
npm run preview
```

## 📞 Still Having Issues?

1. **Check the deployment logs** in Vercel dashboard
2. **Verify all environment variables** are set correctly
3. **Test the build locally** before deploying
4. **Check Firebase configuration** is correct
5. **Ensure backend is deployed** and accessible

## 🎯 Success Checklist

- [ ] Project imports without errors
- [ ] Build completes successfully
- [ ] All environment variables set
- [ ] Website loads at Vercel URL
- [ ] Firebase authentication works
- [ ] API calls connect to backend (after backend deployment)

Your frontend should now be successfully deployed to Vercel! 🎉
