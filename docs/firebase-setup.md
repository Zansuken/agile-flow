# Firebase Setup Guide

This guide will help you set up Firebase for the AgileFlow application.

## 🔥 Prerequisites

- Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

## 📋 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `agile-flow` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project dashboard, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and configure OAuth consent screen

### 3. Set up Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 4. Configure Security Rules

Replace the default Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects - users can only access projects they're members of
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.memberIds;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.ownerId;
    }
    
    // Tasks - users can only access tasks in projects they're members of
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        request.auth.uid in get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.memberIds;
    }
    
    // Sprints - users can only access sprints in projects they're members of
    match /sprints/{sprintId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        request.auth.uid in get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.memberIds;
    }
  }
}
```

### 5. Get Web App Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Web" (</> icon)
5. Enter app nickname: "AgileFlow Web"
6. Check "Also set up Firebase Hosting" (optional)
7. Click "Register app"
8. Copy the configuration object

### 6. Get Admin SDK Service Account

1. In Project Settings, go to "Service accounts" tab
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure - it contains sensitive credentials

### 7. Configure Environment Variables

#### Frontend (.env.local)
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF123
```

#### Backend (.env)
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=key_id_from_service_account
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
```

## 🧪 Testing Setup

### Firebase Emulators (Optional for Local Development)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   
   Select:
   - Firestore
   - Authentication
   - Emulators

4. Start emulators:
   ```bash
   firebase emulators:start
   ```

## 🔐 Security Best Practices

1. **Never commit service account keys** to version control
2. **Use environment variables** for all sensitive data
3. **Enable App Check** in production for additional security
4. **Review Firestore security rules** regularly
5. **Enable audit logs** in Firebase Console
6. **Use least privilege principle** for user permissions

## 🚀 Production Deployment

### Additional Security for Production

1. **Update Firestore Rules**: Make them more restrictive
2. **Enable App Check**: Add reCAPTCHA verification
3. **Set up monitoring**: Enable Firebase Analytics and Crashlytics
4. **Configure authorized domains**: Only allow your production domain

### Environment-Specific Configuration

Create separate Firebase projects for:
- Development
- Staging  
- Production

## 🔧 Troubleshooting

### Common Issues

1. **"Permission denied" errors**: Check Firestore security rules
2. **"Auth domain not authorized"**: Add your domain to authorized domains
3. **"Invalid credentials"**: Verify service account key format
4. **CORS errors**: Check Firebase configuration and domain settings

### Debug Tools

- Firebase Console logs
- Browser developer tools
- Firebase Debug View (for Analytics)

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
