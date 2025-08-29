# 🚂 Railway Backend Deployment Guide

## 🎯 Deploy Your NestJS Backend to Railway

### Step 1: Sign up for Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Create New Railway Project

#### Method A: Deploy from Dashboard (Recommended)

1. **Login to Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Click "Login" and connect with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `agile-flow` repository

3. **Configure Service**
   - Service name: `agile-flow-backend`
   - Root directory: `backend`
   - Build command: `npm run build`
   - Start command: `npm run start:prod`

#### Method B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to project root
cd /Users/rekhamuralidharan/Documents/code/agile-flow

# Initialize Railway project
railway link

# Deploy
railway up
```

### Step 3: Configure Environment Variables

**CRITICAL**: You need to set these environment variables in Railway:

1. **Go to your Railway project dashboard**
2. **Click on your service → Variables tab**
3. **Add these variables:**

```bash
NODE_ENV=production
PORT=$PORT
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Step 4: Get Firebase Service Account

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Select your project**
3. **Project Settings (gear icon) → Service accounts**
4. **Generate new private key**
5. **Download the JSON file**
6. **Extract these values:**
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Step 5: Update CORS_ORIGIN

**Important**: Set `CORS_ORIGIN` to your Vercel frontend URL:
```bash
CORS_ORIGIN=https://your-frontend-name.vercel.app
```

### Step 6: Deploy and Test

1. **Deploy the backend**
   - Railway will automatically build and deploy
   - Check the deployment logs for any errors

2. **Test the API**
   - Your backend will be available at: `https://your-service.railway.app`
   - Test health endpoint: `https://your-service.railway.app/api/health`

3. **Update Frontend Environment Variables**
   - Go to your Vercel project dashboard
   - Update `VITE_API_BASE_URL` to your Railway URL
   - Redeploy frontend to pick up the changes

## 🔧 Railway Configuration Files

### railway.yaml (Already created)
```yaml
version: 2
build:
  commands:
    - cd backend && npm install
    - cd backend && npm run build
start:
  command: cd backend && npm run start:prod
environment:
  NODE_ENV: production
  PORT: $PORT
```

## 🚨 Troubleshooting

### Build Issues
- Ensure `npm run build` works locally
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds

### Environment Variables
- Double-check Firebase service account JSON format
- Ensure `CORS_ORIGIN` matches your Vercel URL exactly
- Use Railway's `$PORT` variable for the port

### CORS Issues
- Make sure `CORS_ORIGIN` is set correctly
- Test API endpoints with your frontend URL

## ✅ Success Checklist

- [ ] Railway project created and linked to GitHub
- [ ] Root directory set to `backend`
- [ ] All environment variables configured
- [ ] Firebase service account keys added
- [ ] CORS_ORIGIN set to Vercel frontend URL
- [ ] Backend deployed successfully
- [ ] Health endpoint accessible
- [ ] Frontend updated with backend URL

## 🔗 Helpful Links

- [Railway Documentation](https://docs.railway.app)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)
- [NestJS Production Guide](https://docs.nestjs.com)

## 🎉 Next Steps

After successful deployment:

1. **Update your frontend** with the Railway backend URL
2. **Test the full application** end-to-end
3. **Monitor the logs** for any issues
4. **Set up custom domain** (optional)

Your AgileFlow application will then be fully deployed! 🚀
