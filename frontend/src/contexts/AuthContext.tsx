import React, { createContext, useEffect, useState } from 'react';
import type {
  User,
} from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User as AppUser } from '../types';
import { UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  currentUserData: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
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

  const createUserDocument = async (user: User, additionalData?: Partial<AppUser>) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
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

      try {
        await setDoc(userDocRef, userData);
        setCurrentUserData(userData);
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    } else {
      setCurrentUserData(userDoc.data() as AppUser);
    }
  };

  const login = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await createUserDocument(user);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await createUserDocument(user, { displayName });
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
  }, []);

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
