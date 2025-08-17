import { createContext } from 'react';
import { useSignInEmailPassword, useSignOut, useUserData } from '@nhost/react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ReturnType<typeof useUserData>;
  login: ReturnType<typeof useSignInEmailPassword>['signInEmailPassword'];
  logout: ReturnType<typeof useSignOut>['signOut'];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
