// Přímé použití Supabase - žádná kompatibilita s mock daty!
import { useSupabaseApp } from './useSupabaseApp';

// Export jako useApp pro kompatibilitu - pouze Supabase
export const useApp = useSupabaseApp;
