import { useContext } from 'react';
import { AppContext } from '../contexts/SupabaseAppContext';

export const useSupabaseApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useSupabaseApp must be used within a SupabaseAppProvider');
  }
  return context;
};
