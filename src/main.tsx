// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NhostProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { nhost } from './lib/nhostClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <BrowserRouter>
          <ToastProvider>
            <ThemeProvider>
              <AuthProvider>
                <AppProvider>
                  <App />
                </AppProvider>
              </AuthProvider>
            </ThemeProvider>
          </ToastProvider>
        </BrowserRouter>
      </NhostApolloProvider>
    </NhostProvider>
  </StrictMode>
);
