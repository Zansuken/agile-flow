#!/bin/bash

# Firebase Setup Helper Script for AgileFlow
# This script helps you set up Firebase configuration step by step

echo "🔥 AgileFlow Firebase Setup Helper"
echo "=================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI is not installed."
    echo "📦 Install it by running: npm install -g firebase-tools"
    echo ""
    read -p "Do you want to install Firebase CLI now? (y/n): " install_cli
    if [[ $install_cli == "y" || $install_cli == "Y" ]]; then
        npm install -g firebase-tools
    else
        echo "Please install Firebase CLI and run this script again."
        exit 1
    fi
fi

echo "✅ Firebase CLI is installed"
echo ""

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://console.firebase.google.com/"
echo "2. Create a new project (or select existing)"
echo "3. Enable Authentication (Email/Password + Google)"
echo "4. Create Firestore database (test mode)"
echo "5. Get your web app config"
echo "6. Download service account key"
echo ""

echo "📁 Configuration Files to Create:"
echo "- frontend/.env.local (copy from frontend/.env.local.example)"
echo "- backend/.env (copy from backend/.env.example)"
echo ""

read -p "Press Enter to continue when you have your Firebase project ready..."

# Initialize Firebase project
echo "🚀 Initializing Firebase in your project..."
firebase init

echo ""
echo "✅ Firebase setup complete!"
echo ""
echo "📖 Next Steps:"
echo "1. Copy frontend/.env.local.example to frontend/.env.local"
echo "2. Copy backend/.env.example to backend/.env"
echo "3. Fill in your Firebase configuration values"
echo "4. Run: npm run dev"
echo ""
echo "📚 For detailed instructions, see: docs/firebase-setup.md"
