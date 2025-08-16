import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './common/Button';
import { LogOut, Sun, Moon } from 'lucide-react';
import type { Building } from '../graphql/buildings';
import { useTheme } from '../contexts/useTheme';

interface AppHeaderProps {
  selectedBuilding?: Building;
  onDeselectBuilding?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ selectedBuilding, onDeselectBuilding }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    if (window.confirm('Opravdu se chcete odhlásit?')) {
  logout();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              OnlineHlasovani
            </Link>
            {selectedBuilding && (
              <div className="ml-6 hidden sm:flex items-baseline space-x-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {selectedBuilding.name}
                </span>
                {onDeselectBuilding && (
                <Button variant="secondary" size="sm" onClick={onDeselectBuilding}>
                  Změnit SVJ
                </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="mr-2 text-gray-600 dark:text-gray-300"
              title={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm" title="Odhlásit se">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {selectedBuilding && (
          <div className="sm:hidden pt-2 pb-4">
            <div className="flex items-center justify-between">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {selectedBuilding.name}
              </span>
              {onDeselectBuilding && (
                <Button variant="secondary" size="sm" onClick={onDeselectBuilding}>
                  Změnit SVJ
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
