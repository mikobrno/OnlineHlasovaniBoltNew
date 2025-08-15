import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Vytvoříme vlastní hook pro snadné použití kontextu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
