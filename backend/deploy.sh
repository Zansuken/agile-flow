#!/bin/bash
# Simple deployment script for Railway

echo "Starting AgileFlow Backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Starting production server..."
npm run start:prod
