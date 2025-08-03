import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import { Login } from './components/Login';
import { BuildingSelector } from './components/BuildingSelector';
import { MainApp } from './components/MainApp';
import { VotingPage } from './components/voting/VotingPage';
import { useToast } from './contexts/ToastContext';

function App() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const { selectedBuilding } = useApp();
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

  return (
    <Routes>
      <Route path="/vote/:token" element={<VotingPage />} />
      <Route path="/*" element={
        !selectedBuilding ? <BuildingSelector /> : <MainApp />
      } />
    </Routes>
  );
}

export default App;
