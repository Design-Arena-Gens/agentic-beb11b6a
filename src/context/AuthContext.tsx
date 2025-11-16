"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  type User
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { fetchProfile, upsertUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/types";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await upsertUserProfile({
          id: authUser.uid,
          email: authUser.email ?? "",
          displayName: authUser.displayName ?? authUser.email ?? "User"
        });
        const userProfile = await fetchProfile(authUser.uid);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      login: async (email, password) => {
        if (!auth) throw new Error("Firebase is not configured.");
        await signInWithEmailAndPassword(auth, email, password);
      },
      loginWithGoogle: async () => {
        if (!auth || !googleProvider) throw new Error("Firebase is not configured.");
        await signInWithPopup(auth, googleProvider);
      },
      register: async (email, password, displayName) => {
        if (!auth) throw new Error("Firebase is not configured.");
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(newUser, { displayName });
        await upsertUserProfile({
          id: newUser.uid,
          email: newUser.email ?? "",
          displayName
        });
        const userProfile = await fetchProfile(newUser.uid);
        setProfile(userProfile);
      },
      logout: async () => {
        if (!auth) return;
        await signOut(auth);
      },
      resetPassword: async (email) => {
        if (!auth) throw new Error("Firebase is not configured.");
        await sendPasswordResetEmail(auth, email);
      },
      refreshProfile: async () => {
        if (!user) return;
        const freshProfile = await fetchProfile(user.uid);
        setProfile(freshProfile);
      }
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
