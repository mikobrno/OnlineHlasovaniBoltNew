// src/contexts/AuthContext.tsx
import React from 'react';
import { 
  useAuthenticationStatus,
  useUserData,
  useSignInEmailPassword,
  useSignOut,
} from '@nhost/react';
import { AuthContext } from './authContext.types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const { signInEmailPassword } = useSignInEmailPassword();
  const signOutHook = useSignOut();

  const login = async (email: string, password: string) => {
    try {
      const res = await signInEmailPassword(email, password);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = signOutHook.signOut;

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