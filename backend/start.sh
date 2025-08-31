#!/bin/bash
set -e

echo "🚀 Starting Railway deployment..."
echo "📁 Current directory: $(pwd)"
echo "📂 Directory contents:"
ls -la

echo "🔍 Checking for package.json..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found! Wrong directory?"
    exit 1
fi

echo "🔍 Checking for dist directory..."
if [ ! -d "dist" ]; then
    echo "📦 dist directory not found. Running build..."
    npm run build
fi

echo "🔍 Checking for dist/main.js..."
if [ ! -f "dist/main.js" ]; then
    echo "❌ dist/main.js not found after build!"
    echo "📁 Contents of dist directory:"
    ls -la dist/ 2>/dev/null || echo "dist directory is empty or doesn't exist"
    echo "🔧 Trying to build again..."
    npm install
    npm run build
fi

echo "🔍 Final check for dist/main.js..."
if [ ! -f "dist/main.js" ]; then
    echo "❌ FATAL: dist/main.js still not found!"
    echo "📁 Full directory structure:"
    find . -name "*.js" -type f | head -20
    exit 1
fi

echo "✅ dist/main.js found! Starting application..."
node dist/main.js
