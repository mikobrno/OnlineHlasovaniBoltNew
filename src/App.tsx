import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AppContent } from './components/AppContent';
import { BuildingSelector } from './components/BuildingSelector';
import type { Building } from './graphql/buildings';

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Pokud načítáme stav autentizace, zobrazíme loader
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Načítání...</div>
      </div>
    );
  }

  // Pokud uživatel není přihlášen, zobrazíme přihlašovací formulář
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
