import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function SupabaseAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Získat aktuální session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Poslouchat změny auth stavu
  const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Chyba při přihlášení:', error);
      setIsLoading(false);
      return { success: false, error: 'Neočekávaná chyba při přihlášení' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Dev: pokud není user a běžíme lokálně, pokus se o anonymní přihlášení (pokud je povoleno)
  useEffect(() => {
    const ensureDevAuth = async () => {
      if (import.meta.env.DEV && !user && !isLoading) {
        try {
          // signInAnonymously je dostupné, pokud je v projektu povoleno
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { error } = await supabase.auth.signInAnonymously?.();
          if (error) {
            // v případě, že anonymní režim není povolen, jen log
            console.warn('Anonymous auth not enabled:', error.message);
          }
        } catch (e) {
          console.warn('Anonymous auth attempt failed:', e);
        }
      }
    };
    ensureDevAuth();
  }, [user, isLoading]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
