import React, { createContext, useContext } from 'react';
import { useAuthenticationStatus, useSignInEmailPassword, useSignOut, useUserData } from '@nhost/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();
  const user = useUserData();

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    signIn: signInEmailPassword,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
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
