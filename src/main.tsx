import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext'; // Ponecháme, pokud řeší jen UI stav přihlášení
import { AppProvider } from './contexts/AppContext';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/nhostClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NhostProvider nhost={nhost}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppProvider>
                <App />
              </AppProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </NhostProvider>
    </BrowserRouter>
  </StrictMode>
);
