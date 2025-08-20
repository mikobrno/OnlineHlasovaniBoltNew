import { NavLink } from 'react-router-dom';
import { Vote, Users, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

const navigation = [
  {
    name: 'Hlasování',
    href: '/votes',
    icon: Vote
  },
  {
    name: 'Členové',
    href: '/members',
    icon: Users
  },
  {
    name: 'Nastavení',
    href: '/settings',
    icon: Settings
  }
];

export function AppNavigation() {
  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <ul className="space-y-2">
        {navigation.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              className={({ isActive }) => cn(
                'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                isActive 
                  ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-500' 
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
