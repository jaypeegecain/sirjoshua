import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'customer';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  zip_code?: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isCustomer: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Better than .single() as it won't throw Error on empty
      
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
      } finally {
        if (mounted) {
          console.log('Finished auth flow, setting loading false');
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    // Emergency fallback using functional state update to always get fresh state
    timeoutId = setTimeout(() => {
      if (mounted) {
        setLoading((prev) => {
          if (prev) {
            console.warn('⚡ Auth initialization fallback triggered (5s limit)');
            return false;
          }
          return prev;
        });
      }
    }, 5000);

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await handleAuthChange(session);
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) {
          setLoading(false);
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
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const { error } = await supabase.auth.signUp({ 
      email: normalizedEmail, 
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
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
      signIn, 
      signUp, 
      signOut,
      refreshProfile
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
