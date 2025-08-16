import React, { useState } from 'react';
import { Plus, Edit, Trash2, Globe, Building, HelpCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useQuery, useMutation } from '@apollo/client';
import { GET_GLOBAL_VARIABLES_QUERY } from '../../graphql/globalVariables';
import {
  GET_DOCUMENT_TEMPLATES,
  ADD_DOCUMENT_TEMPLATE,
  UPDATE_DOCUMENT_TEMPLATE,
  DELETE_DOCUMENT_TEMPLATE,
} from '../../graphql/documentTemplates';
import { GET_BUILDINGS_FOR_TEMPLATES } from '../../graphql/queries';
import { DocumentTemplate, Building as BuildingType } from '../../types';
import { useToast } from '../../contexts/ToastContext';

interface DocumentTemplateManagerProps {
    buildingId: string;
}

export const DocumentTemplateManager: React.FC<DocumentTemplateManagerProps> = ({ buildingId }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const { showToast } = useToast();

  const { data, loading, error } = useQuery(GET_DOCUMENT_TEMPLATES, {
    variables: { buildingId },
    fetchPolicy: 'network-only'
  });
  const { data: buildingsData } = useQuery(GET_BUILDINGS_FOR_TEMPLATES);
  // Načtení globálních proměnných (např. pro hinty v editoru do budoucna)
  useQuery(GET_GLOBAL_VARIABLES_QUERY, { fetchPolicy: 'cache-first' });

  const commonRefetch = [{ query: GET_DOCUMENT_TEMPLATES, variables: { buildingId } }];
  const [addTemplate] = useMutation(ADD_DOCUMENT_TEMPLATE, {
    refetchQueries: commonRefetch,
    awaitRefetchQueries: true,
  });
  const [updateTemplate] = useMutation(UPDATE_DOCUMENT_TEMPLATE, {
    refetchQueries: commonRefetch,
    awaitRefetchQueries: true,
  });
  const [deleteTemplate] = useMutation(DELETE_DOCUMENT_TEMPLATE, {
    refetchQueries: commonRefetch,
    awaitRefetchQueries: true,
  });

  const templates: DocumentTemplate[] = data?.document_templates || [];
  const buildings: BuildingType[] = buildingsData?.buildings || [];

  const handleSave = async (tpl: Omit<DocumentTemplate, 'id'>) => {
    try {
      if (editingTemplate) {
        await updateTemplate({ variables: { id: editingTemplate.id, template: tpl } });
        showToast('Šablona byla aktualizována', 'success');
      } else {
        await addTemplate({ variables: { template: tpl } });
        showToast('Šablona byla přidána', 'success');
      }
      setShowEditor(false);
      setEditingTemplate(null);
    } catch (e) {
      console.error(e);
      showToast('Chyba při ukládání šablony', 'error');
    }
  };

  const handleDelete = (tpl: DocumentTemplate) => {
    if (window.confirm(`Smazat šablonu "${tpl.name}"?`)) {
      deleteTemplate({ variables: { id: tpl.id } })
        .then(() => showToast('Šablona byla smazána', 'success'))
        .catch((e) => {
            console.error(e);
            showToast('Chyba při mazání šablony', 'error');
        });
    }
  };

  const getBuildingName = (bId?: string) => {
    if (!bId) return null;
    return buildings.find(b => b.id === bId)?.name;
  };

  if (loading) return <p>Načítání šablon...</p>;
  if (error) return <p>Chyba při načítání šablon: {error.message}</p>;

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {editingTemplate ? 'Upravit' : 'Nová'} dokumentová šablona
          </h2>
          <Button variant="secondary" onClick={() => { setShowEditor(false); setEditingTemplate(null); }}>Zpět</Button>
        </div>
        <DocumentTemplateEditor
          template={editingTemplate}
          buildings={buildings}
          onCancel={() => { setShowEditor(false); setEditingTemplate(null); }}
          onSave={handleSave}
          currentBuildingId={buildingId}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Dokumentové šablony</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Šablony pro dokumenty jako „Hlasovací listina“. Podporují proměnné a blok{' '}
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
              {'{{#questions}}...{{/questions}}'}
            </code>.
          </p>
        </div>
        <Button onClick={() => { setEditingTemplate(null); setShowEditor(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nová šablona
        </Button>
      </div>

      {/* TODO: Nastavení výchozích šablon bude potřeba implementovat jinak, např. přes samostatnou tabulku v DB */}

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{template.name}</h3>
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
                {template.help_text && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-start gap-1">
                    <HelpCircle className="w-4 h-4 mt-0.5" />
                    <span>{template.help_text}</span>
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{template.body.substring(0, 120)}...</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="ghost" onClick={() => { setEditingTemplate(template); setShowEditor(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(template)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="mb-2">Zatím žádné dokumentové šablony.</p>
              <p className="mb-4 text-sm">Vytvořte např. „Hlasovací listina“ a využijte blok{' '}
                <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                  {'{{#questions}}...{{/questions}}'}
                </code>
                .
              </p>
              <Button onClick={() => { setEditingTemplate(null); setShowEditor(true); }}>Přidat první šablonu</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

interface EditorProps {
  template: DocumentTemplate | null;
  buildings: BuildingType[];
  onCancel: () => void;
  onSave: (t: Omit<DocumentTemplate, 'id'>) => void;
  currentBuildingId: string;
}

const DocumentTemplateEditor: React.FC<EditorProps> = ({ template, buildings, onCancel, onSave, currentBuildingId }) => {
  const [name, setName] = useState(template?.name || 'Hlasovací listina');
  const [isGlobal, setIsGlobal] = useState(template?.is_global ?? false);
  const [buildingId, setBuildingId] = useState<string | undefined>(template?.building_id || currentBuildingId);
  const [helpText, setHelpText] = useState<string>(template?.help_text || 'Používejte proměnné {{vote.*}}, {{building.*}}, {{member.*}} a blok {{#questions}}...{{/questions}}');
  const [body, setBody] = useState<string>(template?.body || '<h1>Hlasovací listina – {{vote.title}}</h1>\n{{#questions}}<div>{{index}}. {{question.text}} — [ ] Ano [ ] Ne [ ] Zdržel(a) jsem se</div>{{/questions}}');

  const handleSubmit = () => {
    const t: Omit<DocumentTemplate, 'id'> = {
      name,
      body,
      is_global: isGlobal,
      building_id: isGlobal ? undefined : buildingId,
      help_text: helpText,
    };
    onSave(t);
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="doc-tpl-name">Název šablony</label>
        <input
          id="doc-tpl-name"
          className="w-full px-3 py-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Název šablony"
          title="Název šablony"
          placeholder="např. Hlasovací listina"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="scope"
                    checked={isGlobal}
                    onChange={() => setIsGlobal(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Globální šablona</span>
            </label>
        </div>
        <div>
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    name="scope"
                    checked={!isGlobal}
                    onChange={() => setIsGlobal(false)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pro konkrétní budovu</span>
            </label>
        </div>
        {!isGlobal && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doc-tpl-building">Budova</label>
            <select
              id="doc-tpl-building"
              className="w-full px-3 py-2 border rounded-md"
              value={buildingId || ''}
              onChange={(e) => setBuildingId(e.target.value || undefined)}
              aria-label="Budova pro kterou platí šablona"
              title="Budova"
            >
              <option value="">— Vyberte budovu —</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="doc-tpl-help">Nápověda</label>
        <textarea
          id="doc-tpl-help"
          className="w-full h-24 px-3 py-2 border rounded-md"
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
          aria-label="Nápověda k použití šablony"
          title="Nápověda"
          placeholder="Popište speciální chování nebo dostupné proměnné..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="doc-tpl-body">HTML šablona</label>
        <textarea
          id="doc-tpl-body"
          className="w-full h-64 px-3 py-2 border rounded-md font-mono text-xs"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-label="HTML šablona dokumentu"
          title="HTML šablona"
          placeholder="Např. <h1>Hlasovací listina – {{vote.title}}</h1>\n{{#questions}}...{{/questions}}"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Zrušit</Button>
        <Button onClick={handleSubmit}>Uložit</Button>
      </div>
    </Card>
  );
};
