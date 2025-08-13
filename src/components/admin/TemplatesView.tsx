import React, { useState } from 'react';
import { Mail, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { TemplateManager } from './TemplateManager';
import { DocumentTemplateManager } from './DocumentTemplateManager';

export const TemplatesView: React.FC = () => {
  const [tab, setTab] = useState<'emails' | 'docs'>('emails');

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Šablony</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Spravujte e‑mailové a dokumentové šablony.</p>
      </div>

      <Card className="p-2 mb-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded text-sm flex items-center gap-2 ${tab === 'emails' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setTab('emails')}
            aria-label="Zobrazit e‑mailové šablony"
            title="E‑maily"
          >
            <Mail className="w-4 h-4" /> E‑maily
          </button>
          <button
            className={`px-3 py-2 rounded text-sm flex items-center gap-2 ${tab === 'docs' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setTab('docs')}
            aria-label="Zobrazit dokumentové šablony"
            title="Dokumenty"
          >
            <FileText className="w-4 h-4" /> Dokumenty
          </button>
        </div>
      </Card>

      {tab === 'emails' ? <TemplateManager /> : <DocumentTemplateManager />}
    </div>
  );
};
