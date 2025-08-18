// src/App.tsx
import { useState } from 'react';
import { useAuth } from './contexts/useAuth';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent';
import { BuildingSelector } from './components/BuildingSelector';
import { FullPageSpinner } from './components/FullPageSpinner';
import type { Building } from './graphql/buildings';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  if (isLoading) {
    return <FullPageSpinner message="Ověřování uživatele..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Pokud je uživatel přihlášen, ale nevybral budovu, zobrazíme výběr budov
  if (!selectedBuilding) {
    return <BuildingSelector onBuildingSelect={setSelectedBuilding} />;
  }

  // Po přihlášení a výběru budovy zobrazíme hlavní obsah aplikace
  return <AppContent selectedBuilding={selectedBuilding} onDeselectBuilding={() => setSelectedBuilding(null)} />;
}

export default App;