// src/contexts/AuthContext.tsx
import React from 'react';
import { 
  useAuthenticationStatus,
  useUserData,
  useSignInEmailPassword,
  useSignOut,
  useSignUpEmailPassword,
  useResetPassword,
} from '@nhost/react';
import { AuthContext } from './authContext.types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const { signInEmailPassword } = useSignInEmailPassword();
  const signOutHook = useSignOut();
  const { signUpEmailPassword } = useSignUpEmailPassword();
  const { resetPassword } = useResetPassword();

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

  const register = async (email: string, password: string) => {
    try {
      const res = await signUpEmailPassword(email, password);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const resetUserPassword = async (email: string) => {
    try {
      const res = await resetPassword(email);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      register,
      resetUserPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};