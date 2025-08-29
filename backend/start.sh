#!/bin/bash

# Check if dist/main.js exists
if [ ! -f "dist/main.js" ]; then
    echo "❌ dist/main.js not found. Running build..."
    npm run build
fi

# Check again
if [ ! -f "dist/main.js" ]; then
    echo "❌ Build failed or main.js still not found"
    echo "📁 Contents of current directory:"
    ls -la
    echo "📁 Contents of dist directory (if exists):"
    ls -la dist/ 2>/dev/null || echo "dist directory does not exist"
    exit 1
fi

echo "✅ Starting application..."
node dist/main.js
