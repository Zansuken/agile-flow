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

interface AuthContextType {
  currentUser: User | null;
  currentUserData: AppUser | null;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserData, setCurrentUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('❌ Error during signup:', error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    await createUserDocument(user);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUserData(null);
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
      } else {
        setCurrentUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [createUserDocument]);

  const value: AuthContextType = {
    currentUser,
    currentUserData,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
