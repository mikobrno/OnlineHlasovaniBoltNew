import { createContext, useContext, ReactNode } from 'react';
import { useAuthenticationStatus, useUserData, useSignOut } from '@nhost/react';
import type { User } from '@nhost/nhost-js';
import { FullPageSpinner } from '../components/common/Spinners';

// Definujeme typ pro náš kontext
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signOut: () => Promise<void>;
}

// Vytvoříme kontext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Vytvoříme Provider komponentu
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Použijeme Nhost hooky pro získání stavu autentizace a dat uživatele
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const { signOut } = useSignOut();

  // Během načítání stavu z Nhost zobrazíme spinner na celé stránce
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Hodnota, kterou poskytneme všem komponentám v aplikaci
  const value = {
    isAuthenticated,
    isLoading,
    user,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Vytvoříme vlastní hook pro snadné použití kontextu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
