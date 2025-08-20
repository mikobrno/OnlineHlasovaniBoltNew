import { ReactNode, useState, useEffect } from 'react';
import { useSignInEmailPassword, useSignOut, useAuthenticationStatus, useUserData } from '@nhost/react';
import { AuthContext } from './AuthContext';
import type { User } from '../types/user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signOut } = useSignOut();
  const nhostUser = useUserData();
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (nhostUser) {
      setUser({
        id: nhostUser.id,
        email: nhostUser.email || '',
        displayName: nhostUser.displayName,
        avatarUrl: nhostUser.avatarUrl,
      });
    } else {
      setUser(null);
    }
  }, [nhostUser]);

  const signIn = async (email: string, password: string) => {
    const { error } = await signInEmailPassword(email, password);
    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
