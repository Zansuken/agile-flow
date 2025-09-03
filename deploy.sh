#!/bin/bash

# 🚀 AgileFlow - One-Click Deployment Script

echo "🚀 AgileFlow Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the AgileFlow project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Choose your deployment platform:${NC}"
echo "1. Vercel (Frontend) + Railway (Backend) [Recommended]"
echo "2. Netlify (Frontend) + Render (Backend)"
echo "3. Docker Deployment (Self-hosted)"
echo "4. Setup environment files only"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}🎯 Setting up Vercel + Railway deployment...${NC}"
        
        # Install Vercel CLI if not present
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Install Railway CLI if not present
        if ! command -v railway &> /dev/null; then
            echo "📦 Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        echo -e "${YELLOW}📝 Next steps:${NC}"
        echo "1. Run 'vercel' in the project root to deploy frontend"
        echo "2. Run 'railway login' and 'railway deploy' to deploy backend"
        echo "3. Configure environment variables in both platforms"
        ;;
        
    2)
        echo -e "${GREEN}🎯 Setting up Netlify + Render deployment...${NC}"
        
        # Install Netlify CLI if not present
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo -e "${YELLOW}📝 Next steps:${NC}"
        echo "1. Run 'netlify deploy' in the project root"
        echo "2. Create a new service on Render.com connected to your GitHub repo"
        echo "3. Configure environment variables in both platforms"
        ;;
        
    3)
        echo -e "${GREEN}🐳 Setting up Docker deployment...${NC}"
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
            exit 1
        fi
        
        echo "🏗️ Building Docker images..."
        docker-compose build
        
        echo -e "${YELLOW}📝 To run the application:${NC}"
        echo "docker-compose up -d"
        ;;
        
    4)
        echo -e "${GREEN}📁 Setting up environment files...${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

# Create environment file templates
echo -e "\n${YELLOW}📝 Creating environment file templates...${NC}"

# Frontend environment template
cat > frontend/.env.example << EOF
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF

# Backend environment template
cat > backend/.env.example << EOF
# Backend Environment Variables
NODE_ENV=development
PORT=3001

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

EOF

echo -e "${GREEN}✅ Environment file templates created!${NC}"
echo -e "${YELLOW}📝 Don't forget to:${NC}"
echo "1. Copy .env.example to .env in both frontend and backend directories"
echo "2. Fill in your actual Firebase configuration values"
echo "3. Update CORS_ORIGIN and API_BASE_URL for production"
echo "4. Keep your .env files secure and never commit them to git"

echo -e "\n${GREEN}🎉 Deployment setup complete!${NC}"
echo -e "📖 Check DEPLOYMENT_GUIDE.md for detailed instructions"
