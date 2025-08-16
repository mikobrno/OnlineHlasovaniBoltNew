// src/App.tsx
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent';
import { useToast } from './contexts/ToastContext';
import { FullPageSpinner } from './components/FullPageSpinner';

function App() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const { error } = await login(credentials.email, credentials.password);
    
    if (error) {
      showToast(error.message || 'Neplatné přihlašovací údaje', 'error');
    } else {
      showToast('Přihlášení proběhlo úspěšně', 'success');
    }
  };

  // Pokud se ověřuje stav přihlášení, zobrazíme spinner na celé stránce
  if (authLoading) {
    return <FullPageSpinner />;
  }

  // Pokud není uživatel přihlášen, zobrazíme přihlašovací formulář
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isLoading={authLoading} />;
  }

  // Po úspěšném přihlášení zobrazíme hlavní obsah aplikace
  return <AppContent />;
}

export default App;
