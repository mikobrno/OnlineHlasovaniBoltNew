import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { nhost, apolloClient } from './lib/apolloClient';

// Bootstrap component: vyčistí případné staré tokeny pokud není platná session (prevents initial 401 spam)
// Bootstrap oddělí čištění storage před mountem providerů.
const Bootstrap: React.FC = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Jednoduše nastavíme ready na true bez mazání localStorage
    setReady(true);
  }, []);
  if (!ready) return null;
  return (
    <NhostProvider nhost={nhost}>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <ToastProvider>
              <ThemeProvider>
                <AppProvider>
                  <App />
                </AppProvider>
              </ThemeProvider>
            </ToastProvider>
          </BrowserRouter>
        </ApolloProvider>
      </AuthProvider>
    </NhostProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>
);