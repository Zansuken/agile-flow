# ✅ AgileFlow Deployment Checklist

## 🚀 Pre-Deployment Setup

- [ ] **Firebase Project Setup**
  - [ ] Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
  - [ ] Enable Authentication (Email/Password, Google)
  - [ ] Enable Firestore Database
  - [ ] Create service account key
  - [ ] Download configuration

- [ ] **Repository Preparation**
  - [ ] Code committed to GitHub
  - [ ] Environment files created (but not committed)
  - [ ] Build commands tested locally
  - [ ] All dependencies up to date

## 🎯 Recommended: Vercel + Railway

### Frontend Deployment (Vercel)

- [ ] **Account Setup**
  - [ ] Sign up at [vercel.com](https://vercel.com)
  - [ ] Connect GitHub account
  - [ ] Install Vercel CLI: `npm install -g vercel`

- [ ] **Deploy Frontend**
  - [ ] Run `vercel` in project root
  - [ ] Select "Import Git Repository"
  - [ ] Choose your AgileFlow repository
  - [ ] Configure build settings:
    - Build Command: `cd frontend && npm run build`
    - Output Directory: `frontend/dist`
    - Install Command: `cd frontend && npm install`

- [ ] **Environment Variables (Vercel)**
  - [ ] Go to your project dashboard on Vercel
  - [ ] Navigate to Settings → Environment Variables
  - [ ] Add these variables (get values from your Firebase project):
    - [ ] `VITE_API_BASE_URL` = `https://your-backend.railway.app` (add after deploying backend)
    - [ ] `VITE_FIREBASE_API_KEY` = `your_firebase_api_key`
    - [ ] `VITE_FIREBASE_AUTH_DOMAIN` = `your_project.firebaseapp.com`
    - [ ] `VITE_FIREBASE_PROJECT_ID` = `your_firebase_project_id`
    - [ ] `VITE_FIREBASE_STORAGE_BUCKET` = `your_project.appspot.com`
    - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = `your_sender_id`
    - [ ] `VITE_FIREBASE_APP_ID` = `your_app_id`
  - [ ] Click "Save" and redeploy the project

### Backend Deployment (Railway)

- [ ] **Account Setup**
  - [ ] Sign up at [railway.app](https://railway.app)
  - [ ] Connect GitHub account
  - [ ] Install Railway CLI: `npm install -g @railway/cli`

- [ ] **Deploy Backend**
  - [ ] Run `railway login`
  - [ ] Run `railway init` in project root
  - [ ] Select "Deploy from GitHub repo"
  - [ ] Choose your AgileFlow repository
  - [ ] Set root directory to `backend`

- [ ] **Environment Variables (Railway)**
  - [ ] Add `NODE_ENV=production`
  - [ ] Add `PORT=3001`
  - [ ] Add `FIREBASE_PROJECT_ID`
  - [ ] Add `FIREBASE_CLIENT_EMAIL`
  - [ ] Add `FIREBASE_PRIVATE_KEY` (include newlines)
  - [ ] Add `CORS_ORIGIN` (your Vercel frontend URL)

## 🔄 Alternative: Netlify + Render

### Frontend Deployment (Netlify)

- [ ] **Account Setup**
  - [ ] Sign up at [netlify.com](https://netlify.com)
  - [ ] Connect GitHub account
  - [ ] Install Netlify CLI: `npm install -g netlify-cli`

- [ ] **Deploy Frontend**
  - [ ] Run `netlify init` in project root
  - [ ] Configure build settings:
    - Build command: `cd frontend && npm run build`
    - Publish directory: `frontend/dist`

- [ ] **Environment Variables (Netlify)**
  - [ ] Add all VITE_ environment variables
  - [ ] Configure production URLs

### Backend Deployment (Render)

- [ ] **Account Setup**
  - [ ] Sign up at [render.com](https://render.com)
  - [ ] Connect GitHub account

- [ ] **Deploy Backend**
  - [ ] Create new "Web Service"
  - [ ] Connect to your GitHub repository
  - [ ] Configure:
    - Root Directory: `backend`
    - Build Command: `npm install && npm run build`
    - Start Command: `npm run start:prod`

- [ ] **Environment Variables (Render)**
  - [ ] Add all backend environment variables
  - [ ] Set auto-deploy on git push

## 🧪 Testing Deployment

- [ ] **Frontend Tests**
  - [ ] Website loads correctly
  - [ ] Authentication works
  - [ ] API calls connect to backend
  - [ ] All routes accessible
  - [ ] Responsive design works

- [ ] **Backend Tests**
  - [ ] Health check endpoint responds
  - [ ] Authentication middleware works
  - [ ] Database connections successful
  - [ ] CORS configured correctly
  - [ ] API endpoints return data

- [ ] **Integration Tests**
  - [ ] Login/signup flow complete
  - [ ] Project creation works
  - [ ] Team management functions
  - [ ] Role-based access controls work
  - [ ] Data persists correctly

## 🔧 Post-Deployment Configuration

- [ ] **Custom Domain (Optional)**
  - [ ] Configure custom domain in hosting platform
  - [ ] Update CORS_ORIGIN for backend
  - [ ] Update API_BASE_URL for frontend
  - [ ] Test SSL certificate

- [ ] **Monitoring Setup**
  - [ ] Enable application monitoring
  - [ ] Set up error tracking
  - [ ] Configure performance monitoring
  - [ ] Set up uptime monitoring

- [ ] **Security Checklist**
  - [ ] Environment variables secured
  - [ ] HTTPS enabled
  - [ ] CORS properly configured
  - [ ] Firebase security rules updated
  - [ ] No sensitive data in client code

## 🚀 Go Live!

- [ ] **Final Checks**
  - [ ] All features working in production
  - [ ] Performance acceptable
  - [ ] Security measures in place
  - [ ] Monitoring active

- [ ] **Documentation**
  - [ ] Update README with live URLs
  - [ ] Document deployment process
  - [ ] Create user guide
  - [ ] Set up maintenance procedures

## 📞 Support Resources

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Render**: [render.com/docs](https://render.com/docs)
- **Firebase**: [firebase.google.com/docs](https://firebase.google.com/docs)

## 🎉 Congratulations!

Your AgileFlow application is now live and accessible to users worldwide! 🌍

**Estimated Setup Time**: 30-60 minutes
**Total Cost**: $0-5/month
**Scalability**: Excellent
