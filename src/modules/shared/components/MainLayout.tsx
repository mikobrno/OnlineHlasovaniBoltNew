import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { AppNavigation } from './AppNavigation';
import { useBuildingStore } from '../store/buildingStore';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { selectedBuilding, setSelectedBuilding } = useBuildingStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader 
        selectedBuilding={selectedBuilding} 
        onDeselectBuilding={() => setSelectedBuilding(null)} 
      />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AppNavigation />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
