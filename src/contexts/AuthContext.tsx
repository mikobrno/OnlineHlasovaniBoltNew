// src/contexts/AuthContext.tsx
import React, { createContext } from 'react';
import { useAuthenticationStatus, useUserData, useSignInEmailPassword, useSignOut } from '@nhost/react';

type LoginError = {
  message: string;
};

type LoginResult = {
  error: LoginError | null;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const result = await signInEmailPassword(email, password);
      if (result.error) {
        return { 
          error: { 
            message: result.error.message === 'invalid-email-password' 
              ? 'Nesprávný email nebo heslo' 
              : result.error.message 
          } 
        };
      }
      return { error: null };
    } catch {
      return { error: { message: 'Chyba při přihlašování' } };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
    } catch {
      console.error('Chyba při odhlašování');
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

