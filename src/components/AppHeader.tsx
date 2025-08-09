import React from 'react';
import { Building2, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useApp } from '../contexts/AppContextCompat';
import { Button } from './common/Button';

export const AppHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { selectedBuilding } = useApp();

  const handleLogoClick = () => {
    window.location.reload(); // Simple solution to reset state
  };

  const handleLogout = () => {
    if (window.confirm('Opravdu se chcete odhlásit?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                OnlineSprava
              </h1>
            </button>
            {selectedBuilding && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedBuilding.name}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User info and logout */}
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Odhlásit se"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Odhlásit se</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Přepnout na tmavý režim' : 'Přepnout na světlý režim'}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="sr-only">Tmavý režim</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="sr-only">Světlý režim</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
