import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  primaryColor: string;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
