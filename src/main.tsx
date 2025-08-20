import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NhostProvider, NhostClient } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';

const nhost = new NhostClient({
  subdomain: 'zde_doplnit_subdomain',
  region: 'zde_doplnit_region'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NhostProvider nhost={nhost}>
        <NhostApolloProvider nhost={nhost}>
          <ToastProvider>
            <ThemeProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ThemeProvider>
          </ToastProvider>
        </NhostApolloProvider>
      </NhostProvider>
    </BrowserRouter>
  </StrictMode>
);