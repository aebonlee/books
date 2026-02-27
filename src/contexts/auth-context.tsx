'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { getProfile, signOut as authSignOut, type UserProfile } from '@/lib/auth';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'aebon@kakao.com,aebon@kyonggi.ac.kr')
  .split(',')
  .map((e) => e.trim().toLowerCase());

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const p = await getProfile(authUser.id);
    setProfile(p as UserProfile | null);
  }, []);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      const client = getSupabase();
      if (!client) {
        setIsLoading(false);
        return;
      }

      const result = client.auth.onAuthStateChange((event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          loadProfile(u);
        } else {
          setProfile(null);
        }
        if (event === 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      });
      subscription = result.data.subscription;

      // 안전장치: INITIAL_SESSION이 5초 내 안 오면 loading 해제
      fallbackTimer = setTimeout(() => {
        setIsLoading((prev) => {
          if (prev) console.warn('Auth: INITIAL_SESSION timeout, forcing loading=false');
          return false;
        });
      }, 5000);
    } catch (err) {
      console.error('Auth initialization failed:', err);
      setIsLoading(false);
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (subscription) subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  // admin 판별
  const allEmails = [
    user?.email,
    profile?.email,
  ].filter(Boolean).map((e) => (e as string).toLowerCase());
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isLoggedIn: !!user,
        isAdmin,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
