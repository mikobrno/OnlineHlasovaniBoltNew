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
    try {
      // Pokud nejsou klíče (nebo jsou ale prázdné), není co dělat
      const stored = localStorage.getItem('nhostRefreshToken');
      // Pokusíme se jen ověřit synchronně – nemáme session API bez provideru, takže heuristika:
      if (!stored) {
        // nic
      } else {
        // Často zůstává zastaralý refresh token => smažeme a necháme čistý start
        localStorage.removeItem('nhostRefreshToken');
        localStorage.removeItem('nhostRefreshTokenExpiresAt');
        localStorage.removeItem('nhostAnonymousUsersEnabled');
      }
  } catch {
      // ignore
    }
    setReady(true);
  }, []);
  if (!ready) return null; // krátké prázdné okno (ms) – lze nahradit spinnerem pokud vadí
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