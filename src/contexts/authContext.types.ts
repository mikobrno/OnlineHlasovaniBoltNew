import { createContext } from 'react';
import { useUserData, useSignOut } from '@nhost/react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ReturnType<typeof useUserData>;
  // wrapper used in AuthProvider: (email, password) => Promise<unknown>
  login: (email: string, password: string) => Promise<unknown>;
  logout: ReturnType<typeof useSignOut>['signOut'];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
