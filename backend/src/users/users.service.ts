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

export interface ProjectRole {
  projectId: string;
  projectName: string;
  role: string;
  joinedAt: string;
  updatedAt: string;
}

interface ProjectMember {
  userId: string;
  role: string;
  joinedAt: Date;
  updatedAt?: Date;
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

  async findUsersByDisplayNames(displayNames: string[]): Promise<User[]> {
    if (displayNames.length === 0) return [];

    const firestore = this.firebaseService.getFirestore();

    try {
      // Get all users and filter by display name in memory
      // (Firestore doesn't support 'in' operator with case-insensitive search)
      const snapshot = await firestore.collection(this.collection).get();

      const users: User[] = [];
      const lowerDisplayNames = displayNames.map((name) => name.toLowerCase());

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        const email = (data?.email as string) || '';
        const displayName = (data?.displayName as string) || '';

        // Check if display name matches any of the requested names
        if (
          displayName &&
          lowerDisplayNames.includes(displayName.toLowerCase())
        ) {
          users.push({
            id: doc.id,
            email,
            displayName,
            photoURL: (data?.photoURL as string) || undefined,
            role: (data?.role as string) || 'developer',
            createdAt: this.convertTimestamp(data?.createdAt),
            updatedAt: this.convertTimestamp(data?.updatedAt),
          });
        }
      });

      console.log(
        `🔍 [UsersService] Found ${users.length} users for display names:`,
        displayNames,
      );
      users.forEach((user) => {
        console.log(`  - ${user.displayName} -> ${user.id}`);
      });

      return users;
    } catch (error) {
      console.error('Error finding users by display names:', error);
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

  async getUserRoles(userId: string): Promise<ProjectRole[]> {
    try {
      const firestore = this.firebaseService.getFirestore();

      // Query all projects where user is a member
      const projectsRef = firestore.collection('projects');
      const projectsSnapshot = await projectsRef
        .where('memberIds', 'array-contains', userId)
        .get();

      const userRoles: ProjectRole[] = [];

      // Check each project for this user's membership details
      for (const projectDoc of projectsSnapshot.docs) {
        const projectData = projectDoc.data();
        const members = (projectData.members || []) as ProjectMember[];

        // Find this user's member record in the members array
        const userMember = members.find(
          (member: ProjectMember) => member.userId === userId,
        );

        if (userMember) {
          userRoles.push({
            projectId: projectDoc.id,
            projectName: (projectData?.name as string) || 'Unknown Project',
            role: userMember.role || 'developer',
            joinedAt: this.convertTimestamp(userMember.joinedAt).toISOString(),
            updatedAt: this.convertTimestamp(
              userMember.updatedAt || userMember.joinedAt,
            ).toISOString(),
          });
        }
      }

      return userRoles;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw new Error('Failed to fetch user roles');
    }
  }

  async getUsersByIds(userIds: string[]): Promise<User[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }

    const firestore = this.firebaseService.getFirestore();

    try {
      // Firestore has a limit of 10 documents per `in` query
      // If we have more than 10 IDs, we'll need to batch them
      const batches: string[][] = [];
      for (let i = 0; i < userIds.length; i += 10) {
        batches.push(userIds.slice(i, i + 10));
      }

      const users: User[] = [];

      for (const batch of batches) {
        const snapshot = await firestore
          .collection(this.collection)
          .where('__name__', 'in', batch)
          .get();

        snapshot.docs.forEach((doc) => {
          const userData = doc.data();
          users.push({
            id: doc.id,
            email: (userData?.email as string) || '',
            displayName: (userData?.displayName as string) || '',
            photoURL: (userData?.photoURL as string) || undefined,
            role: (userData?.role as string) || 'developer',
            createdAt: this.convertTimestamp(userData?.createdAt),
            updatedAt: this.convertTimestamp(userData?.updatedAt),
          });
        });
      }

      return users;
    } catch (error) {
      console.error('Error getting users by IDs:', error);
      return [];
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
