#!/bin/bash

# Development utility to test deployment readiness
echo "🧪 Testing deployment readiness..."

# Check if backend is built
if [ ! -f "backend/dist/main.js" ]; then
    echo "📦 Building backend..."
    cd backend
    npm run build
    cd ..
fi

# Start backend in the background
echo "🚀 Starting backend..."
cd backend
npm run start:prod &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Test health endpoints
echo "🏥 Testing health endpoints..."
curl -f http://localhost:3001/api/health || echo "❌ Health check failed"
curl -f http://localhost:3001/api/ready || echo "❌ Ready check failed"

# Kill the backend
echo "🛑 Stopping backend..."
kill $BACKEND_PID 2>/dev/null || true

echo "✅ Deployment readiness test complete"
