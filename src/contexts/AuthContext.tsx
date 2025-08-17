// src/contexts/AuthContext.tsx
import React from 'react';
import { 
  useAuthenticationStatus,
  useUserData,
  useSignInEmailPassword,
  useSignOut,
} from '@nhost/react';
import { AuthContext } from './authContext.types';
import { setAuthReady } from '../lib/authSessionFlag';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Must call Nhost hooks unconditionally to respect React Hooks rules
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const signInHook = useSignInEmailPassword();
  const signOutHook = useSignOut();

  // useSignInEmailPassword may return a function or an object with signInEmailPassword
  // Normalize sign-in function shape
  let signInFn: ((email: string, password: string) => Promise<Record<string, unknown>>) | undefined;
  if (typeof signInHook === 'function') {
    signInFn = signInHook as (email: string, password: string) => Promise<Record<string, unknown>>;
  } else if (signInHook && typeof (signInHook as unknown as { signInEmailPassword?: unknown }).signInEmailPassword === 'function') {
    signInFn = (signInHook as unknown as { signInEmailPassword: (email: string, password: string) => Promise<Record<string, unknown>> }).signInEmailPassword;
  } else {
    signInFn = undefined;
  }

  const login = async (email: string, password: string) => {
    // wrapper keeping same signature as before
    if (!signInFn) {
      throw new Error('Nhost sign-in hook is not available');
    }
    const res = await signInFn(email, password);
    return res;
  };

  const logout = signOutHook.signOut;

  // Side effect: when loading switches to false (first determination), set readiness flag
  React.useEffect(() => {
    if (!isLoading) {
      // readiness reflects that we now know whether a user exists; auth link can start attaching tokens
      setAuthReady(true);
    }
  }, [isLoading]);

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