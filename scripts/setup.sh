#!/bin/bash

# AgileFlow Project Setup Script
echo "🚀 Setting up AgileFlow project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install
cp .env.example .env.local
echo "✅ Frontend setup complete"
cd ..

# Setup backend
echo "⚙️ Setting up backend..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend setup complete"
cd ..

# Setup shared package
echo "📦 Building shared package..."
cd shared
npm run build
echo "✅ Shared package built"
cd ..

echo ""
echo "🎉 AgileFlow setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure Firebase:"
echo "   - Follow docs/firebase-setup.md"
echo "   - Update frontend/.env.local with your Firebase config"
echo "   - Update backend/.env with your Firebase Admin SDK config"
echo ""
echo "2. Start development servers:"
echo "   - Run 'npm run dev' to start both frontend and backend"
echo "   - Or run them separately:"
echo "     - Frontend: 'npm run dev:frontend'"
echo "     - Backend: 'npm run dev:backend'"
echo ""
echo "🌐 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001/api"
echo "   - API Docs: http://localhost:3001/api/docs"
echo ""
echo "📚 Documentation:"
echo "   - Project README: ./README.md"
echo "   - Frontend README: ./frontend/README.md"
echo "   - Backend README: ./backend/README-AGILEFLOW.md"
echo "   - Firebase Setup: ./docs/firebase-setup.md"
