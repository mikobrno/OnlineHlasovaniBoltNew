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
import { nhost, apolloClient } from './lib/apolloClient'; // Import nového klienta

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
