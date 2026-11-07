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
  switchMockRole: (role: 'super_admin' | 'staff') => void;
  staffList: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'ev_active_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState<UserProfile[]>(INITIAL_STAFF);

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
              // Fallback user from session metadata
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'Staff User',
                role: (session.user.user_metadata?.role as 'super_admin' | 'staff') || 'staff',
                is_active: true,
              });
            }
          }

          // Fetch all staff for assignment dropdowns
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
        // Load mock session from localStorage
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
      // Demo / Offline Mode login matching credentials
      const matched = INITIAL_STAFF.find(
        (s) => s.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matched || email.includes('admin') || email.includes('staff')) {
        const activeUser: UserProfile = matched || {
          id: 'u-' + Math.random().toString(36).substring(2, 7),
          email: email.trim(),
          full_name: email.includes('admin') ? 'Super Administrator' : 'Academic Counselor',
          role: email.includes('admin') ? 'super_admin' : 'staff',
          is_active: true,
        };

        setUser(activeUser);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(activeUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid credentials. You can test with admin@evcyberacademy.com or counselor@evcyberacademy.com',
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

  const switchMockRole = (role: 'super_admin' | 'staff') => {
    const updated: UserProfile = {
      id: role === 'super_admin' ? 'u-admin-1' : 'u-staff-1',
      email: role === 'super_admin' ? 'admin@evcyberacademy.com' : 'kavitha.counselor@evcyberacademy.com',
      full_name: role === 'super_admin' ? 'Super Administrator' : 'Kavitha R. (Lead Counselor)',
      role: role,
      is_active: true,
    };
    setUser(updated);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(updated));
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isSuperAdmin: user?.role === 'super_admin',
    isLoading,
    signIn,
    signOut,
    switchMockRole,
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
