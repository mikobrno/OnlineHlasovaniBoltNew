import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/contexts/AuthContext';
import { Button } from './Button';
import { LogOut, Sun, Moon } from 'lucide-react';
import type { Building } from '../types/building';
import { useTheme } from '../hooks/useTheme';

interface AppHeaderProps {
  selectedBuilding: Building | null;
  onDeselectBuilding: () => void;
}

export function AppHeader({ selectedBuilding, onDeselectBuilding }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            Online Hlasování
          </Link>
          {selectedBuilding && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              <Button 
                variant="ghost" 
                onClick={onDeselectBuilding}
                className="text-blue-600 dark:text-blue-500"
              >
                {selectedBuilding.name}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
