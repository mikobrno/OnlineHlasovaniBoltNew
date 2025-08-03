import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent';
import { useToast } from './contexts/ToastContext';

function App() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const success = await login(credentials.email, credentials.password);
    if (success) {
      showToast('Přihlášení proběhlo úspěšně', 'success');
    } else {
      showToast('Neplatné přihlašovací údaje', 'error');
    }
  };

  // Pokud není přihlášen, zobraz login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isLoading={authLoading} />;
  }

  // Po přihlášení zobraz hlavní obsah aplikace
  return <AppContent />;

}

export default App;
