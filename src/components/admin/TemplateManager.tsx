import React, { useState } from 'react';
import { Plus, Edit, Trash2, Globe, Building, Copy } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TemplateEditor } from './TemplateEditor';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_EMAIL_TEMPLATES, 
  DELETE_EMAIL_TEMPLATE, 
  ADD_EMAIL_TEMPLATE,
  type EmailTemplate 
} from '../../graphql/templates';
import { GET_BUILDINGS, type Building as BuildingType } from '../../graphql/buildings';

interface TemplateManagerProps {
  buildingId: string;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ buildingId }) => {
  const { showToast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Načtení dat
  const { data: templatesData, loading: templatesLoading, refetch: refetchTemplates } = useQuery(GET_EMAIL_TEMPLATES, {
    variables: { buildingId },
    skip: !buildingId,
  });
  const { data: buildingsData } = useQuery(GET_BUILDINGS);

  const templates: EmailTemplate[] = templatesData?.email_templates || [];
  const buildings: BuildingType[] = buildingsData?.buildings || [];

  // Mutace
  const [deleteTemplateMutation] = useMutation(DELETE_EMAIL_TEMPLATE, {
    onCompleted: () => {
      showToast('Šablona byla smazána', 'success');
      refetchTemplates();
    },
    onError: (error) => showToast(`Chyba při mazání šablony: ${error.message}`, 'error'),
  });

  const [addTemplateMutation] = useMutation(ADD_EMAIL_TEMPLATE, {
    onCompleted: () => {
      showToast('Šablona byla zkopírována', 'success');
      refetchTemplates();
    },
    onError: (error) => showToast(`Chyba při kopírování šablony: ${error.message}`, 'error'),
  });

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDelete = (template: EmailTemplate) => {
    if (window.confirm(`Opravdu chcete smazat šablonu "${template.name}"?`)) {
      deleteTemplateMutation({ variables: { id: template.id } });
    }
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const { id, created_at, updated_at, ...restOfTemplate } = template;
    const duplicatedTemplate = {
      ...restOfTemplate,
      name: `${template.name} (kopie)`,
    };
    addTemplateMutation({ variables: { template: duplicatedTemplate } });
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingTemplate(null);
    refetchTemplates();
  };

  const getBuildingName = (bId?: string) => {
    if (!bId) return null;
    return buildings.find(b => b.id === bId)?.name;
  };

  if (showEditor) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onBack={closeEditor}
        buildingId={buildingId}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          E-mailové šablony
        </h2>
        <Button onClick={() => { setEditingTemplate(null); setShowEditor(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nová šablona
        </Button>
      </div>

      <div className="mb-4 p-3 rounded border border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20 text-sm text-yellow-800 dark:text-yellow-200">
        Tip: Šablony podporují proměnné ve tvaru <span className="font-mono">{'{{nazev}}'}</span>.
        U speciálních šablon s opakováním seznamu (např. seznam otázek) použijte blok
        {' '}<code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{'{{#questions}}...{{/questions}}'}</code>.
      </div>

      {templatesLoading ? (
        <p>Načítání šablon...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {template.name}
                    </h3>
                    {template.is_global ? (
                      <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        <Globe className="w-3 h-3" />
                        <span>Globální</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        <Building className="w-3 h-3" />
                        <span>{getBuildingName(template.building_id)}</span>
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
                <p className="mb-4">Žádné e-mailové šablony nejsou definovány pro tuto budovu.</p>
                <Button onClick={() => { setEditingTemplate(null); setShowEditor(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Přidat první šablonu
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
