import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_STAFF } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  staffList: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'ev_active_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState<UserProfile[]>(() => isSupabaseConfigured() ? [] : INITIAL_STAFF);

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as UserProfile);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'Staff User',
                role: (session.user.user_metadata?.role as 'super_admin' | 'staff') || 'staff',
                is_active: true,
              });
            }
          }

          // Fetch active staff for assignments
          const { data: staffMembers } = await supabase
            .from('profiles')
            .select('*')
            .eq('is_active', true);

          if (staffMembers && staffMembers.length > 0) {
            setStaffList(staffMembers as UserProfile[]);
          }
        } catch (err) {
          console.error('Supabase auth initialization error:', err);
        }
      } else {
        const stored = localStorage.getItem(LOCAL_AUTH_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem(LOCAL_AUTH_KEY);
          }
        }
      }

      setIsLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as UserProfile);
          }
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser(profile as UserProfile);
          } else {
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              full_name: data.user.user_metadata?.full_name || 'Staff User',
              role: (data.user.user_metadata?.role as 'super_admin' | 'staff') || 'staff',
              is_active: true,
            });
          }
        }

        setIsLoading(false);
        return { success: true };
      } catch (err) {
        setIsLoading(false);
        return { success: false, error: (err as Error).message };
      }
    } else {
      // Local development fallback
      const cleanEmail = email.trim().toLowerCase();
      const matched = INITIAL_STAFF.find(
        (s) => s.email.toLowerCase() === cleanEmail
      );

      if (matched) {
        setUser(matched);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(matched));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid credentials. Please contact your system administrator.',
      };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isSuperAdmin: user?.role === 'super_admin',
    isLoading,
    signIn,
    signOut,
    staffList,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
