// src/modules/login/hooks/useAuth.ts
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuthContext();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Přihlášení se nezdařilo');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error
  };
};
