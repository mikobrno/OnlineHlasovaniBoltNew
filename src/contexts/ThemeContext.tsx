import React, { useState, ReactNode, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from './useAuth';
import { GET_GLOBAL_VARIABLES_QUERY } from '../graphql/globalVariables';
import type { GlobalVariable } from '../graphql/globalVariables';
import { ThemeContext, Theme } from './ThemeContextBase.ts';

// Helper pro zjištění systémového tématu (s guardem kvůli případnému SSR/test prostředí)
const systemPrefersDark = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Flag zda uživatel ručně přepnul téma (pak nerespektujeme budoucí změny default_theme z DB dokud ručně nepřepne znovu)
  const manualOverrideRef = useRef<boolean>(false);

  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    // fallback systém
    return systemPrefersDark() ? 'dark' : 'light';
  });
  const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6');

  // Načteme globální proměnné (cache-first stačí; SettingsView je refetchuje při uložení)
  const { isAuthenticated, isLoading } = useAuth();
  const { data } = useQuery<{ global_variables: GlobalVariable[] }>(GET_GLOBAL_VARIABLES_QUERY, {
    fetchPolicy: 'cache-first',
    skip: isLoading || !isAuthenticated,
  });

  // Aplikace tématu do DOM
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Reakce na změny globálních proměnných default_theme & primary_color
  useEffect(() => {
    if (!data?.global_variables) return;
    const map: Record<string, GlobalVariable> = {};
    data.global_variables.forEach(g => { map[g.name] = g; });

    // default_theme logika: pokud není manuální override, nastav z DB
    const defaultTheme = map['default_theme']?.value; // 'light' | 'dark' | 'system'
    if (!manualOverrideRef.current && defaultTheme) {
      if (defaultTheme === 'light' || defaultTheme === 'dark') {
        if (theme !== defaultTheme) setTheme(defaultTheme);
      } else if (defaultTheme === 'system') {
        const sys = systemPrefersDark() ? 'dark' : 'light';
        if (theme !== sys) setTheme(sys);
      }
    }

    // primary_color
    const p = map['primary_color']?.value;
    if (p && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(p) && p !== primaryColor) {
      setPrimaryColor(p);
    }
  }, [data, theme, primaryColor]);

  // Aplikace primární barvy pomocí CSS var + přegenerování několika utilit (light/dark nuance necháváme na Tailwind default) 
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    // Možné budoucí doplnění kontrastní barvy
  }, [primaryColor]);

  const toggleTheme = () => {
    manualOverrideRef.current = true; // uživatel nyní ručně volí
  setTheme((prev: Theme) => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

