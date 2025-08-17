// src/App.tsx
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent';
import { FullPageSpinner } from './components/FullPageSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSpinner message="Ověřování..." />;
  }

  return isAuthenticated ? <AppContent /> : <Login />;
}

export default App;