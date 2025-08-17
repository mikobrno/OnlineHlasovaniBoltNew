// src/contexts/AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuthenticationStatus, useSignInEmailPassword, useSignOut } from '@nhost/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthenticationStatus();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login: signInEmailPassword,
      logout: signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};