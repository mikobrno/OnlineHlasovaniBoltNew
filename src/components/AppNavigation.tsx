import React from 'react';
import { Vote, Users, Mail, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface AppNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: NavigationTab[] = [
  { id: 'votes', label: 'Hlasování', icon: <Vote className="w-4 h-4" /> },
  { id: 'members', label: 'Členové', icon: <Users className="w-4 h-4" /> },
  { id: 'emails', label: 'E-maily', icon: <Mail className="w-4 h-4" /> },
  { id: 'admin', label: 'Administrace', icon: <Settings className="w-4 h-4" /> }
];

export const AppNavigation: React.FC<AppNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
