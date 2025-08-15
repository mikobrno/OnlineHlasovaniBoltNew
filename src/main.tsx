import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { nhost, apolloClient } from './lib/apolloClient'; // Nhost + Apollo klient

// Rychlá kontrola, zda jsou k dispozici povinné env proměnné
const requiredEnv = ['VITE_NHOST_SUBDOMAIN', 'VITE_NHOST_REGION'];
const missing = requiredEnv.filter((k) => !import.meta.env[k as keyof ImportMetaEnv]);
if (missing.length) {
  console.error('Chybějící env proměnné:', missing.join(', '));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NhostProvider nhost={nhost}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </ApolloProvider>
      </NhostProvider>
    </BrowserRouter>
  </StrictMode>
);
