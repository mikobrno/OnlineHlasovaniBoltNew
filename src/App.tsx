import { useAuth } from './contexts/SupabaseAuthContext';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent.tsx';
import { useToast } from './contexts/ToastContext';

function App() {
  const { isAuthenticated, login, isLoading: authLoading, user } = useAuth();
  const { showToast } = useToast();

  console.log('App render - isAuthenticated:', isAuthenticated, 'isLoading:', authLoading, 'user:', user);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const result = await login(credentials.email, credentials.password);
    if (result.success) {
      showToast('Přihlášení proběhlo úspěšně', 'success');
    } else {
      showToast(result.error || 'Neplatné přihlašovací údaje', 'error');
    }
  };

  // Pokud načítáme, zobraz loader
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Načítání...</div>
      </div>
    );
  }

  // Pokud není přihlášen, zobraz login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isLoading={authLoading} />;
  }

  // Po přihlášení zobraz hlavní obsah aplikace
  return <AppContent />;

}

export default App;
