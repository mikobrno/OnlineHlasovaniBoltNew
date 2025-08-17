// src/modules/login/context/AuthContext.tsx
import { createContext, useContext, FC, ReactNode } from 'react';
import { useSignInEmailPassword, useAuthenticationStatus, useUserData, useSignOut } from '@nhost/react';

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any; // Zde by měl být správný typ z Nhost
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();

  const signIn = async (email: string, password: string) => {
    const { error } = await signInEmailPassword(email, password);
    if (error) {
      throw new Error(
        error.message === 'invalid-email-password' 
          ? 'Nesprávný email nebo heslo'
          : 'Přihlášení se nezdařilo'
      );
    }
  };

  const value = {
    signIn,
    signOut,
    isAuthenticated,
    isLoading,
    user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
