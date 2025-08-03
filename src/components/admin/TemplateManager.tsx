import React, { useState } from 'react';
import { Plus, Edit, Trash2, Globe, Building, Copy } from 'lucide-react';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TemplateEditor } from './TemplateEditor';
import { EmailTemplate } from '../../data/mockData';

export const TemplateManager: React.FC = () => {
  const { templates, buildings, deleteTemplate, addTemplate } = useApp();
  const { showToast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDelete = (template: EmailTemplate) => {
    if (window.confirm(`Opravdu chcete smazat šablonu "${template.name}"?`)) {
      deleteTemplate(template.id);
    }
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const duplicatedTemplate: EmailTemplate = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      name: `${template.name} (kopie)`
    };
    addTemplate(duplicatedTemplate);
    showToast('Šablona byla zkopírována', 'success');
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const getBuildingName = (buildingId?: string) => {
    if (!buildingId) return null;
    return buildings.find(b => b.id === buildingId)?.name;
  };

  if (showEditor) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onBack={closeEditor}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          E-mailové šablony
        </h2>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nová šablona
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h3>
                  {template.isGlobal ? (
                    <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      <Globe className="w-3 h-3" />
                      <span>Globální</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      <Building className="w-3 h-3" />
                      <span>{getBuildingName(template.buildingId)}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Předmět: {template.subject}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                  {template.body.substring(0, 100)}...
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDuplicate(template)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(template)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(template)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="mb-4">Žádné e-mailové šablony nejsou definovány</p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Přidat první šablonu
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
