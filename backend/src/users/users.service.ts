import { Injectable } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  private readonly collection = 'users';

  constructor(private firebaseService: FirebaseService) {}

  async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    const firestore = this.firebaseService.getFirestore();

    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    try {
      // Get all users (in a real app, you'd implement pagination and better indexing)
      const snapshot = await firestore.collection(this.collection).get();

      const users: User[] = [];

      snapshot.docs.forEach((doc) => {
        const userData = doc.data();

        // Skip the current user
        if (doc.id === currentUserId) {
          return;
        }

        const email = (userData?.email as string) || '';
        const displayName = (userData?.displayName as string) || '';

        // Search in email and display name
        if (
          email.toLowerCase().includes(searchTerm) ||
          displayName.toLowerCase().includes(searchTerm)
        ) {
          users.push({
            id: doc.id,
            email,
            displayName,
            photoURL: (userData?.photoURL as string) || undefined,
            role: (userData?.role as string) || 'developer',
            createdAt: this.convertTimestamp(userData?.createdAt),
            updatedAt: this.convertTimestamp(userData?.updatedAt),
          });
        }
      });

      // Limit results to prevent overwhelming the UI
      return users.slice(0, 20);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async ensureUserProfile(
    authUser: DecodedIdToken,
    profileData?: { displayName?: string; photoURL?: string },
  ): Promise<User> {
    const firestore = this.firebaseService.getFirestore();
    const userId = authUser.uid;

    try {
      const userDocRef = firestore.collection(this.collection).doc(userId);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        // Create new user document
        const newUser: User = {
          id: userId,
          email: authUser.email || '',
          displayName:
            profileData?.displayName ||
            (authUser.name as string) ||
            'Anonymous User',
          photoURL: profileData?.photoURL || authUser.picture || undefined,
          role: 'developer', // Default role
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await userDocRef.set(newUser);
        return newUser;
      } else {
        // Return existing user
        const userData = userDoc.data();
        const existingUser: User = {
          id: userDoc.id,
          email: (userData?.email as string) || '',
          displayName: (userData?.displayName as string) || '',
          photoURL: (userData?.photoURL as string) || undefined,
          role: (userData?.role as string) || 'developer',
          createdAt: this.convertTimestamp(userData?.createdAt),
          updatedAt: this.convertTimestamp(userData?.updatedAt),
        };

        return existingUser;
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      throw new Error('Failed to ensure user profile');
    }
  }

  private convertTimestamp(timestamp: any): Date {
    if (
      timestamp &&
      typeof timestamp === 'object' &&
      '_seconds' in timestamp &&
      '_nanoseconds' in timestamp
    ) {
      // Firestore Timestamp object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const seconds = timestamp['_seconds'] as number;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const nanoseconds = timestamp['_nanoseconds'] as number;
      return new Date(seconds * 1000 + nanoseconds / 1000000);
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date();
  }
}
