/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string; university?: string; country?: string; phone?: string; marketing_consent?: boolean; role?: 'student' | 'vendor' }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase));

  useEffect(() => {
    const supabaseClient = supabase;
    if (!supabaseClient) {
      return;
    }

    let isMounted = true;

    const initialize = async () => {
      const { data } = await supabaseClient.auth.getSession();
      if (!isMounted) {
        return;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured.' } as AuthError };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata?: { full_name?: string; university?: string; country?: string; phone?: string; marketing_consent?: boolean; role?: 'student' | 'vendor' }
  ) => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured.' } as AuthError };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata ?? {} },
    });
    return { error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured.' } as AuthError };
    }

    const redirectTo = `${window.location.origin}/auth/callback?type=recovery`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured.' } as AuthError };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: Boolean(user),
      isSupabaseReady: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [user, session, isLoading, signIn, signUp, signOut, resetPassword, updatePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
