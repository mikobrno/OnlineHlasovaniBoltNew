import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { TemplateManager } from './TemplateManager';
import { DocumentTemplateManager } from './DocumentTemplateManager';

interface TemplatesViewProps {
  buildingId: string;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ buildingId }) => {
  const [activeTab, setActiveTab] = useState('email');

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('email')}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            )}
          >
            E‑mailové šablony
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'document'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            )}
          >
            Dokumentové šablony
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'email' && <TemplateManager buildingId={buildingId} />}
        {activeTab === 'document' && <DocumentTemplateManager buildingId={buildingId} />}
      </div>
    </div>
  );
};
