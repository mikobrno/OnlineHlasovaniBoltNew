import { useContext } from 'react';
import { AppContext } from './SupabaseAppContext';

export function useSupabaseApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useSupabaseApp must be used within a SupabaseAppProvider');
  }
  return context;
}
