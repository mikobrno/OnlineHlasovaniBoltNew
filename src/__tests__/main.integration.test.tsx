beforeAll(() => {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };
});
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { ThemeProvider } from '../modules/shared/hooks/useTheme';
import { ToastProvider } from '../modules/shared/hooks/useToast';
import { AuthProvider } from '../modules/auth/contexts/AuthContext';
import { AppProvider } from '../modules/shared/contexts';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { nhost, apolloClient } from '../lib/apolloClient';
import { BrowserRouter } from 'react-router-dom';

describe('Integrace hlavní aplikace', () => {
  it('Aplikace se načte a zobrazí základní části', async () => {
    render(
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

    await waitFor(() => {
      expect(screen.getByText(/Online Hlasování/i)).toBeInTheDocument();
    });
  });

  it('Zobrazí se chybová hláška při špatné autentizaci', async () => {
    // Zde můžeš nasimulovat špatný token nebo chybu v provideru
    // a ověřit, že se zobrazí chybová hláška nebo redirect
  });
});
