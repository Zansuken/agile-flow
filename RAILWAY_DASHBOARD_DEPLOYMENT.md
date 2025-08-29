# 🚂 Railway Dashboard Deployment - Step by Step

## 🎯 Your Railway Project is Ready!

✅ **Project Created**: `agile-flow`  
🔗 **URL**: https://railway.com/project/a9d80ddc-5780-4d92-9727-6323cd292ace

## 📋 Next Steps: Deploy via Dashboard

### Step 1: Access Your Railway Project

1. **Go to your Railway project**: [Click here](https://railway.com/project/a9d80ddc-5780-4d92-9727-6323cd292ace)
2. **You should see your project dashboard**

### Step 2: Configure the Service

1. **Click on the existing service** (it should show as created)
2. **Go to Settings tab**
3. **Set the following:**

   **Build Settings:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

### Step 3: Add Environment Variables

**Critical**: Go to Variables tab and add these:

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
4. **Click "Generate new private key"**
5. **Download the JSON file**
6. **Extract values for Railway:**
   - Copy `project_id` → Set as `FIREBASE_PROJECT_ID`
   - Copy `client_email` → Set as `FIREBASE_CLIENT_EMAIL`  
   - Copy `private_key` → Set as `FIREBASE_PRIVATE_KEY`

### Step 5: Deploy

1. **Trigger deployment** by going to Deployments tab
2. **Click "Deploy Now" or push to your main branch**
3. **Monitor the build logs** for any errors

### Step 6: Test Your Backend

Once deployed, your backend will be available at:
```
https://agile-flow-production.up.railway.app
```

Test the health endpoint:
```
https://your-backend-url.railway.app/api/health
```

### Step 7: Update Frontend

1. **Go to your Vercel project dashboard**
2. **Settings → Environment Variables**
3. **Update `VITE_API_BASE_URL`** to your Railway URL
4. **Redeploy frontend** to connect to the backend

## 🔧 Configuration Files Ready

✅ `railway.yaml` - Updated for proper backend deployment  
✅ `backend/package.json` - Has all required scripts  
✅ Environment variables template provided

## 🚨 Important Notes

1. **Firebase Private Key**: Make sure to copy the entire private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
2. **CORS Origin**: Must exactly match your Vercel frontend URL
3. **Port**: Always use `$PORT` in Railway (they assign the port dynamically)

## ✅ Success Indicators

You'll know it's working when:
- ✅ Build completes without errors
- ✅ Service shows as "Active" 
- ✅ Health endpoint returns 200 OK
- ✅ Frontend can make API calls

## 🆘 Need Help?

If you encounter issues:
1. Check the build logs in Railway dashboard
2. Verify all environment variables are set correctly
3. Ensure Firebase service account has the right permissions
4. Test API endpoints with curl or Postman

**Your backend deployment is ready to go! 🚀**
