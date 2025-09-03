import type { User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import type { User as AppUser } from '../types';
import { UserRole } from '../types';

// Enhanced types for role management
interface ProjectRole {
  projectId: string;
  projectName: string;
  role: UserRole;
  joinedAt: string;
  updatedAt: string;
}

interface UserRoles {
  [projectId: string]: ProjectRole;
}

interface AuthContextType {
  currentUser: User | null;
  currentUserData: AppUser | null;
  userRoles: UserRoles;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  getUserRole: (projectId: string) => UserRole | null;
  refreshUserRoles: () => Promise<void>;
  invalidateProjectRole: (projectId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserData, setCurrentUserData] = useState<AppUser | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoles>({});
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Fetch all user roles from backend
  const fetchUserRoles = useCallback(
    async (user: User): Promise<UserRoles> => {
      // Prevent multiple simultaneous calls
      if (rolesLoading) {
        console.debug(
          '🔄 Roles already being fetched, skipping duplicate request',
        );
        return userRoles;
      }

      try {
        setRolesLoading(true);
        const idToken = await user.getIdToken();
        const response = await fetch('http://localhost:3001/api/users/roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const rolesData = (await response.json()) as ProjectRole[];

          // Convert array to object for easier lookup
          const rolesMap: UserRoles = {};
          rolesData.forEach((roleInfo) => {
            rolesMap[roleInfo.projectId] = roleInfo;
          });

          setUserRoles(rolesMap);
          return rolesMap;
        } else {
          console.warn('Failed to fetch user roles:', response.status);
          return {};
        }
      } catch (error) {
        console.error('❌ Error fetching user roles:', error);
        return {};
      } finally {
        setRolesLoading(false);
      }
    },
    [rolesLoading, userRoles],
  );

  // Helper function to get user role for a specific project
  const getUserRole = useCallback(
    (projectId: string): UserRole | null => {
      return userRoles[projectId]?.role || null;
    },
    [userRoles],
  );

  // Function to refresh user roles (call when roles might have changed)
  const refreshUserRoles = useCallback(async () => {
    if (currentUser) {
      await fetchUserRoles(currentUser);
    }
  }, [currentUser, fetchUserRoles]);

  // Function to invalidate a specific project role (for optimistic updates)
  const invalidateProjectRole = useCallback((projectId: string) => {
    setUserRoles((prev) => {
      const updated = { ...prev };
      delete updated[projectId];
      return updated;
    });
  }, []);

  const ensureUserProfileViaAPI = async (
    user: User,
    additionalData?: Partial<AppUser>,
  ) => {
    try {
      // Get the user's ID token for authentication
      const idToken = await user.getIdToken();

      const response = await fetch(
        'http://localhost:3001/api/users/ensure-profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            displayName: additionalData?.displayName || user.displayName,
            photoURL: additionalData?.photoURL || user.photoURL,
          }),
        },
      );

      if (response.ok) {
        const userData = (await response.json()) as AppUser;
        setCurrentUserData(userData);
        return userData;
      } else {
        throw new Error(`Backend API error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backend API fallback failed:', error);
      throw error;
    }
  };

  const createUserDocument = useCallback(
    async (user: User, additionalData?: Partial<AppUser>) => {
      if (!user) {
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      try {
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const userData: AppUser = {
            id: user.uid,
            email: user.email!,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || undefined,
            role: UserRole.DEVELOPER, // Default role
            createdAt: new Date(),
            updatedAt: new Date(),
            ...additionalData,
          };

          await setDoc(userDocRef, userData);
          setCurrentUserData(userData);
        } else {
          const existingData = userDoc.data() as AppUser;
          setCurrentUserData(existingData);
        }
      } catch (error) {
        console.error('❌ Error in createUserDocument:', error);

        // Try backend API as fallback
        try {
          await ensureUserProfileViaAPI(user, additionalData);
        } catch (apiError) {
          console.error('❌ Backend API fallback also failed:', apiError);

          // Still set some basic user data so the app doesn't break
          const fallbackUserData: AppUser = {
            id: user.uid,
            email: user.email!,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || undefined,
            role: UserRole.DEVELOPER,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...additionalData,
          };
          setCurrentUserData(fallbackUserData);
        }
      }
    },
    [],
  );

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(user);
      // Roles will be fetched in useEffect when currentUser changes
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(user, { displayName });

      await createUserDocument(user, { displayName });
      // Roles will be fetched in useEffect when currentUser changes
    } catch (error) {
      console.error('❌ Error during signup:', error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    await createUserDocument(user);
    // Roles will be fetched in useEffect when currentUser changes
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUserData(null);
    setUserRoles({}); // Clear user roles on logout
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!currentUser) return;

    await updateProfile(currentUser, { displayName, photoURL });

    if (currentUserData) {
      const updatedUserData = {
        ...currentUserData,
        displayName,
        photoURL,
        updatedAt: new Date(),
      };

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, updatedUserData, { merge: true });
      setCurrentUserData(updatedUserData);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await createUserDocument(user);
        // Only fetch user roles once when user state changes
        if (!rolesLoading && Object.keys(userRoles).length === 0) {
          await fetchUserRoles(user);
        }
      } else {
        setCurrentUserData(null);
        setUserRoles({}); // Clear roles when user logs out
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [createUserDocument, fetchUserRoles, rolesLoading, userRoles]);

  const value: AuthContextType = {
    currentUser,
    currentUserData,
    userRoles,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
    getUserRole,
    refreshUserRoles,
    invalidateProjectRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
