#!/usr/bin/env node

/**
 * Firebase Configuration Validator
 * Tests Firebase setup for both frontend and backend
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Configuration Validator');
console.log('===================================\n');

// Check if environment files exist
const frontendEnv = path.join(__dirname, '../frontend/.env.local');
const backendEnv = path.join(__dirname, '../backend/.env');

let errors = 0;

// Validate frontend configuration
console.log('📱 Checking Frontend Configuration...');
if (!fs.existsSync(frontendEnv)) {
  console.log('❌ Missing: frontend/.env.local');
  console.log('   Copy frontend/.env.local.example to frontend/.env.local\n');
  errors++;
} else {
  const frontendConfig = fs.readFileSync(frontendEnv, 'utf8');
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  let missing = [];
  requiredVars.forEach(varName => {
    if (!frontendConfig.includes(varName) || frontendConfig.includes(`${varName}=your_`)) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Frontend config incomplete:');
    missing.forEach(v => console.log(`   Missing: ${v}`));
    errors++;
  } else {
    console.log('✅ Frontend configuration looks good');
  }
}

console.log('');

// Validate backend configuration
console.log('🔧 Checking Backend Configuration...');
if (!fs.existsSync(backendEnv)) {
  console.log('❌ Missing: backend/.env');
  console.log('   Copy backend/.env.example to backend/.env\n');
  errors++;
} else {
  const backendConfig = fs.readFileSync(backendEnv, 'utf8');
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID'
  ];
  
  let missing = [];
  requiredVars.forEach(varName => {
    if (!backendConfig.includes(varName) || backendConfig.includes(`${varName}=your_`)) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Backend config incomplete:');
    missing.forEach(v => console.log(`   Missing: ${v}`));
    errors++;
  } else {
    console.log('✅ Backend configuration looks good');
  }
}

console.log('');

if (errors === 0) {
  console.log('🎉 All Firebase configurations are ready!');
  console.log('🚀 You can now run: npm run dev');
} else {
  console.log(`❌ Found ${errors} configuration issue(s)`);
  console.log('📖 See docs/firebase-setup.md for detailed setup instructions');
}

console.log('');
console.log('🔗 Useful Links:');
console.log('   Firebase Console: https://console.firebase.google.com/');
console.log('   Setup Guide: docs/firebase-setup.md');
console.log('');
