import { useAuth } from './modules/auth/contexts/AuthContext';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent';
import { FullPageSpinner } from './components/FullPageSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSpinner message="Ověřování..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <AppContent />;
}

export default App;