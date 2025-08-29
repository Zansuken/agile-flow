import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = path.join(
  __dirname,
  '../../../agileflow-service-account.json',
);

try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const serviceAccount = require(serviceAccountPath);
  initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    credential: cert(serviceAccount),
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

const firestore = getFirestore();

// Test users data
const testUsers = [
  {
    id: 'test-user-1',
    email: 'alice.johnson@example.com',
    displayName: 'Alice Johnson',
    role: 'developer',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test-user-2',
    email: 'bob.wilson@example.com',
    displayName: 'Bob Wilson',
    role: 'designer',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test-user-3',
    email: 'carol.davis@example.com',
    displayName: 'Carol Davis',
    role: 'project_manager',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test-user-4',
    email: 'david.brown@example.com',
    displayName: 'David Brown',
    role: 'tester',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test-user-5',
    email: 'emma.lee@example.com',
    displayName: 'Emma Lee',
    role: 'developer',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedUsers() {
  console.log('Starting to seed test users...');

  try {
    const batch = firestore.batch();

    for (const user of testUsers) {
      const userRef = firestore.collection('users').doc(user.id);
      batch.set(userRef, user);
      console.log(`Added user: ${user.displayName} (${user.email})`);
    }

    await batch.commit();
    console.log('✅ Successfully seeded all test users!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }

  process.exit(0);
}

void seedUsers();
