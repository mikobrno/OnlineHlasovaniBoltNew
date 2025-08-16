import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from './en';
import skTranslations from './sk';

export type Language = 'en' | 'sk';
export type Translations = typeof enTranslations;

const translations = {
  en: enTranslations,
  sk: skTranslations,
};

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps): JSX.Element {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'sk')) {
      setLanguage(savedLang);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    language,
    t,
    changeLanguage
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
