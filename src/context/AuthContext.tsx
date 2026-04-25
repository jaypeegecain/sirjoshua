import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { ERROR_MESSAGES, TIMING } from '@/src/lib/constants';
import { UserProfile, UserRole } from '@/src/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isCustomer: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.error('Profile fetch failed:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: any;

    const handleAuthChange = async (newSession: Session | null) => {
      if (!mounted) return;
      console.log('Auth state changing:', newSession ? 'User logged in' : 'No user');

      try {
        setSession(newSession);
        const newUser = newSession?.user ?? null;
        setUser(newUser);

        if (newUser) {
          const profileData = await fetchProfile(newUser.id);
          if (mounted) setProfile(profileData);
        } else {
          if (mounted) setProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        if (mounted) setError(ERROR_MESSAGES.GENERIC_ERROR);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    // Emergency fallback timeout
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚡ Auth initialization fallback triggered');
        setLoading(false);
      }
    }, TIMING.AUTH_INIT_TIMEOUT);

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await handleAuthChange(session);
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) {
          setLoading(false);
          setError(ERROR_MESSAGES.GENERIC_ERROR);
          clearTimeout(timeoutId);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleAuthChange(session);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      clearError();
      const normalizedEmail = email.toLowerCase().trim();
      const { error } = await supabase.auth.signInWithPassword({ 
        email: normalizedEmail, 
        password 
      });
      
      if (error) {
        const errorMsg = error.message === 'Invalid login credentials' 
          ? ERROR_MESSAGES.INVALID_CREDENTIALS 
          : error.message;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      clearError();
      const normalizedEmail = email.toLowerCase().trim();
      const { error } = await supabase.auth.signUp({ 
        email: normalizedEmail, 
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async () => {
    try {
      clearError();
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      setError(ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  // Primary source of truth: profile.role from DB (always accurate).
  // Fallback to app_metadata.role (JWT claim) only while profile is still loading.
  const role: UserRole = (profile?.role as UserRole) || (session?.user?.app_metadata?.role as UserRole) || 'customer';

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      role,
      isAdmin: role === 'admin',
      isCustomer: role === 'customer',
      loading, 
      error,
      signIn, 
      signUp, 
      signOut,
      refreshProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
