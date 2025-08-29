# 🚀 AgileFlow - Free Hosting Deployment Guide

This guide covers the best free hosting solutions for your full-stack AgileFlow project.

## 🏗️ Project Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS + TypeScript
- **Database**: Firebase Firestore (already free tier)
- **Authentication**: Firebase Auth (already free tier)

## 🆓 Best Free Hosting Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
- **Cost**: 100% Free
- **Features**: 
  - Automatic deployments from GitHub
  - Global CDN
  - Custom domains
  - Serverless functions
  - 100GB bandwidth/month

#### Backend (Railway)
- **Cost**: $5/month free credit (covers ~512MB RAM)
- **Features**:
  - Automatic deployments from GitHub
  - Built-in databases (PostgreSQL, MySQL, etc.)
  - Environment variables
  - Custom domains
  - Monitoring and logs

### Option 2: Netlify + Render

#### Frontend (Netlify)
- **Cost**: 100% Free
- **Features**:
  - 100GB bandwidth/month
  - Automatic deployments
  - Form handling
  - Functions (serverless)

#### Backend (Render)
- **Cost**: Free tier available
- **Features**:
  - 512MB RAM
  - Automatic deployments
  - Custom domains
  - SSL certificates

### Option 3: GitHub Pages + Heroku

#### Frontend (GitHub Pages)
- **Cost**: 100% Free
- **Features**:
  - Direct deployment from repository
  - Custom domains
  - HTTPS by default

#### Backend (Heroku)
- **Cost**: Free tier (550-1000 dyno hours/month)
- **Features**:
  - Automatic deployments
  - Add-ons ecosystem
  - Environment variables

## 🎯 Recommended Solution: Vercel + Railway

### Why This Combination?
1. **Vercel**: Best-in-class frontend hosting with excellent React support
2. **Railway**: Modern, developer-friendly backend hosting with generous free tier
3. **Firebase**: Already provides free database and auth
4. **Total Cost**: ~$0-5/month depending on usage

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Repository

First, let's add the necessary configuration files:

```bash
# Already done - your project is ready for deployment!
```

### Step 2: Deploy Frontend to Vercel

1. **Sign up at [vercel.com](https://vercel.com)**
2. **Connect your GitHub account**
3. **Import your repository**
4. **Configure build settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

### Step 3: Deploy Backend to Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Connect your GitHub account**
3. **Create new project from GitHub repo**
4. **Configure build settings**:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

### Step 4: Configure Environment Variables

#### Vercel (Frontend)
```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

#### Railway (Backend)
```env
NODE_ENV=production
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
CORS_ORIGIN=https://your-frontend.vercel.app
```

## 🔧 Configuration Files Needed

### Frontend (Vercel) - `vercel.json`
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend (Railway) - Update `package.json`
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

## 🌐 Alternative Free Solutions

### For Simpler Setup: Netlify Full-Stack

If you want everything in one place:
1. **Deploy both frontend and backend to Netlify**
2. **Use Netlify Functions for API endpoints**
3. **100% free with generous limits**

### For Learning: Heroku (Legacy Free Tier)

Note: Heroku ended their free tier in November 2022, but offers student credits.

## 💡 Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel (Frontend) | 100GB bandwidth | $20/month team |
| Railway (Backend) | $5 credit/month | $0.000463/GB-hour |
| Firebase (Database) | 1GB storage | Pay as you use |
| **Total** | **~$0-5/month** | **Scales with usage** |

## 🚀 Quick Start Commands

I'll create the necessary configuration files for you to get started immediately.
