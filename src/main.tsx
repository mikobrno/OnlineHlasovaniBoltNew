import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { SupabaseAppProvider } from './contexts/SupabaseAppContext';

// POUZE SUPABASE - žádné mock data!
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <SupabaseAuthProvider>
            <SupabaseAppProvider>
              <App />
            </SupabaseAppProvider>
          </SupabaseAuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
