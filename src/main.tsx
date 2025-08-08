import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Podmíněné načítání Supabase provideru
const USE_SUPABASE = true; // AKTIVNÍ Supabase připojení

const AppWithProviders = () => {
  if (USE_SUPABASE) {
    // Dynamický import pro Supabase
    const { SupabaseAppProvider } = require('./contexts/SupabaseAppContext');
    return (
      <AppProvider>
        <SupabaseAppProvider>
          <App />
        </SupabaseAppProvider>
      </AppProvider>
    );
  }
  
  // Pouze mock data
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppWithProviders />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
