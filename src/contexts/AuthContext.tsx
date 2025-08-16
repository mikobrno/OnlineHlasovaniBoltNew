// src/contexts/AuthContext.tsx
import React, { createContext } from 'react';
import { useAuthenticationStatus, useUserData, useSignInEmailPassword, useSignOut } from '@nhost/react';

// Tento interface bude reprezentovat data o uživateli, která dostaneme od Nhost
interface User {
  id: string;
  email?: string;
  displayName?: string;
  // Můžeme přidat další role a vlastnosti podle potřeby
  [key: string]: unknown; 
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const nhostUser = useUserData();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();

  const login = async (email: string, password: string) => {
    const { error } = await signInEmailPassword(email, password);
    if (error) {
      return { error: { message: error.message } };
    }
    return {};
  };

  const logout = async () => {
    await signOut();
  };

  const value: AuthContextType = {
    user: nhostUser as User | null,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
