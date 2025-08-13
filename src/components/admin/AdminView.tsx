import React, { useState } from 'react';
import { Building, Settings, Globe, Database, TestTube, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { BuildingManager } from './BuildingManager';
import { TemplatesView } from './TemplatesView';
import { GlobalVariablesManager } from './GlobalVariablesManager';
import { BuildingVariablesManager } from './BuildingVariablesManager';
import { SettingsView } from './SettingsView';
import { EmailTestPanel } from './EmailTestPanel';

export const AdminView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'buildings' | 'templates' | 'email-test' | 'global-variables' | 'building-variables' | 'settings'>('buildings');

  const sections = [
  { id: 'buildings' as const, label: 'Budovy', icon: <Building className="w-5 h-5" />, component: BuildingManager },
  { id: 'templates' as const, label: 'Šablony', icon: <FileText className="w-5 h-5" />, component: TemplatesView },
    { id: 'email-test' as const, label: 'Test Email Systému', icon: <TestTube className="w-5 h-5" />, component: EmailTestPanel },
    { id: 'global-variables' as const, label: 'Globální proměnné', icon: <Globe className="w-5 h-5" />, component: GlobalVariablesManager },
    { id: 'building-variables' as const, label: 'Proměnné budov', icon: <Database className="w-5 h-5" />, component: BuildingVariablesManager },
    { id: 'settings' as const, label: 'Nastavení', icon: <Settings className="w-5 h-5" />, component: SettingsView }
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || (() => null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Administrace
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Správa budov, šablon a globálních nastavení
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};
