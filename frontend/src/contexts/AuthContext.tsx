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
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { auth, db } from '../config/firebase';
import { apiService } from '../services/api';
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

  // Track the last user ID for whom we fetched roles to prevent infinite loops
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const rolesFetchAttempts = useRef<number>(0);
  const rolesLoadingRef = useRef<boolean>(false);
  const maxRolesFetchAttempts = 3;

  // Fetch all user roles from backend
  const fetchUserRoles = useCallback(async (): Promise<UserRoles> => {
    // Prevent multiple simultaneous calls
    if (rolesLoadingRef.current) {
      console.debug(
        '🔄 Roles already being fetched, skipping duplicate request',
      );
      return {}; // Return empty object instead of current userRoles to avoid dependency
    }

    // Circuit breaker: prevent excessive failed attempts
    if (rolesFetchAttempts.current >= maxRolesFetchAttempts) {
      console.warn(
        `🚫 Maximum roles fetch attempts (${maxRolesFetchAttempts}) reached. Skipping fetch.`,
      );
      return {};
    }

    try {
      rolesLoadingRef.current = true;
      rolesFetchAttempts.current += 1;

      // Use the API service which handles environment-based URLs properly
      const rolesData = await apiService.get<ProjectRole[]>('/users/roles');

      const rolesMap: UserRoles = {};
      rolesData.forEach((role) => {
        rolesMap[role.projectId] = role;
      });

      // Reset attempts counter on success
      rolesFetchAttempts.current = 0;
      setUserRoles(rolesMap);
      return rolesMap;
    } catch (error) {
      console.error(
        `❌ Error fetching user roles (attempt ${rolesFetchAttempts.current}):`,
        error,
      );

      // If we've reached max attempts, don't retry
      if (rolesFetchAttempts.current >= maxRolesFetchAttempts) {
        console.error(
          '🚫 Maximum retry attempts reached for fetching user roles',
        );
      }

      return {};
    } finally {
      rolesLoadingRef.current = false;
    }
  }, [maxRolesFetchAttempts]);

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
      // Reset circuit breaker on manual refresh
      rolesFetchAttempts.current = 0;
      lastFetchedUserIdRef.current = null; // Force refetch
      await fetchUserRoles();
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
      // Use the API service which handles environment-based URLs properly
      const userData = await apiService.post<AppUser>('/users/ensure-profile', {
        displayName: additionalData?.displayName || user.displayName,
        email: user.email,
        photoURL: additionalData?.photoURL || user.photoURL,
        ...additionalData,
      });

      setCurrentUserData(userData);
      return userData;
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

        // Only fetch user roles if we haven't fetched them for this user yet
        // This prevents infinite loops while ensuring roles are fetched for new users
        if (
          user.uid !== lastFetchedUserIdRef.current &&
          !rolesLoadingRef.current
        ) {
          lastFetchedUserIdRef.current = user.uid;
          rolesFetchAttempts.current = 0; // Reset circuit breaker for new user
          try {
            await fetchUserRoles();
          } catch (error) {
            console.error(
              'Failed to fetch user roles on auth state change:',
              error,
            );
            // Reset the ref so we can try again later
            lastFetchedUserIdRef.current = null;
          }
        }
      } else {
        setCurrentUserData(null);
        setUserRoles({}); // Clear roles when user logs out
        lastFetchedUserIdRef.current = null; // Reset the ref
        rolesFetchAttempts.current = 0; // Reset circuit breaker
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [createUserDocument, fetchUserRoles]);

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
