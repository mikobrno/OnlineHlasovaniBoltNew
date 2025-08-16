// src/contexts/AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuthenticationStatus, useUserData, useSignInEmailPassword, useSignOut } from '@nhost/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown;
  login: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();

  const login = async (email: string, password: string) => {
    const { error } = await signInEmailPassword(email, password);
    return { error: error ? { message: error.message } : null };
  };

  const logout = async () => { await signOut(); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
