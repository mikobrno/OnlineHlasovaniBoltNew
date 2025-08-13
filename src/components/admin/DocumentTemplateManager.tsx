import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Globe, Building, HelpCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../contexts/AppContextCompat';
import { DocumentTemplate } from '../../data/mockData';

export const DocumentTemplateManager: React.FC = () => {
  const { buildings } = useApp();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [defaults, setDefaults] = useState<Record<string, string>>({}); // key: 'global' nebo buildingId -> templateId
  const [defaultBuildingId, setDefaultBuildingId] = useState<string>('');
  const [defaultBuildingTplId, setDefaultBuildingTplId] = useState<string>('');
  const [defaultGlobalTplId, setDefaultGlobalTplId] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('document_templates');
      if (raw) {
        const parsed = JSON.parse(raw) as DocumentTemplate[];
        setTemplates(parsed);
      }
      const rawDefaults = localStorage.getItem('document_template_defaults');
      if (rawDefaults) {
        const parsedDef = JSON.parse(rawDefaults) as Record<string, string>;
        setDefaults(parsedDef);
        setDefaultGlobalTplId(parsedDef['global'] || '');
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (list: DocumentTemplate[]) => {
    setTemplates(list);
    try {
      localStorage.setItem('document_templates', JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const persistDefaults = (map: Record<string, string>) => {
    setDefaults(map);
    try {
      localStorage.setItem('document_template_defaults', JSON.stringify(map));
    } catch {
      // ignore
    }
  };

  const setGlobalDefault = (templateId: string) => {
    const next = { ...defaults, global: templateId };
    persistDefaults(next);
    setDefaultGlobalTplId(templateId);
  };

  const setBuildingDefault = (buildingId: string, templateId: string | '') => {
    const next = { ...defaults };
    if (templateId) next[buildingId] = templateId; else delete next[buildingId];
    persistDefaults(next);
    if (defaultBuildingId === buildingId) setDefaultBuildingTplId(templateId);
  };

  const handleSave = (tpl: DocumentTemplate) => {
    setTemplates((prev) => {
      const exists = prev.find((t) => t.id === tpl.id);
      const next = exists ? prev.map((t) => (t.id === tpl.id ? tpl : t)) : [...prev, tpl];
      persist(next);
      return next;
    });
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleDelete = (tpl: DocumentTemplate) => {
    if (window.confirm(`Smazat šablonu "${tpl.name}"?`)) {
      setTemplates((prev) => {
        const next = prev.filter((t) => t.id !== tpl.id);
        persist(next);
        return next;
      });
    }
  };

  const getBuildingName = (buildingId?: string) => {
    if (!buildingId) return null;
    return buildings.find(b => b.id === buildingId)?.name;
  };

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upravit dokumentovou šablonu</h2>
          <Button variant="secondary" onClick={() => { setShowEditor(false); setEditingTemplate(null); }}>Zpět</Button>
        </div>
        <DocumentTemplateEditor
          template={editingTemplate}
          onCancel={() => { setShowEditor(false); setEditingTemplate(null); }}
          onSave={handleSave}
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

      {/* Výchozí šablony */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2" id="label-default-global">Výchozí šablona – globální</h4>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={defaultGlobalTplId}
              onChange={(e) => setGlobalDefault(e.target.value)}
              aria-labelledby="label-default-global"
              title="Výchozí globální šablona"
            >
              <option value="">— Žádná —</option>
              {templates.filter(t => t.isGlobal).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
      <h4 className="font-medium mb-2" id="label-default-building">Výchozí šablona – pro budovu</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                className="px-3 py-2 border rounded-md"
                value={defaultBuildingId}
                onChange={(e) => {
                  const id = e.target.value; setDefaultBuildingId(id);
                  const current = defaults[id] || '';
                  setDefaultBuildingTplId(current);
                }}
        aria-labelledby="label-default-building"
        title="Vyberte budovu pro nastavení výchozí šablony"
              >
                <option value="">— Vyberte budovu —</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border rounded-md"
                value={defaultBuildingTplId}
                onChange={(e) => setBuildingDefault(defaultBuildingId, e.target.value)}
                disabled={!defaultBuildingId}
                aria-label="Výchozí šablona pro vybranou budovu"
                title="Výchozí šablona pro vybranou budovu"
              >
                <option value="">Použít globální výchozí</option>
                {templates
                  .filter(t => t.isGlobal || t.buildingId === defaultBuildingId)
                  .map(t => (
                    <option key={t.id} value={t.id}>{t.name}{t.isGlobal ? ' (globální)' : ''}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{template.name}</h3>
                  {template.isGlobal ? (
                    <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      <Globe className="w-3 h-3" />
                      <span>Globální</span>
                      {defaults['global'] === template.id && (
                        <span className="ml-1 text-[10px] bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded">Výchozí</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      <Building className="w-3 h-3" />
                      <span>{getBuildingName(template.buildingId)}</span>
                      {template.buildingId && defaults[template.buildingId] === template.id && (
                        <span className="ml-1 text-[10px] bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 px-1.5 py-0.5 rounded">Výchozí pro budovu</span>
                      )}
                    </div>
                  )}
                </div>
                {template.helpText && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-start gap-1">
                    <HelpCircle className="w-4 h-4 mt-0.5" />
                    <span>{template.helpText}</span>
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{template.body.substring(0, 120)}...</p>
              </div>
              <div className="flex space-x-2 ml-4">
                {template.isGlobal ? (
                  <Button size="sm" variant="secondary" onClick={() => setGlobalDefault(template.id)} title="Nastavit jako výchozí globální">
                    Nastavit jako výchozí
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => template.buildingId && setBuildingDefault(template.buildingId, template.id)} title="Nastavit jako výchozí pro budovu">
                    Nastavit výchozí
                  </Button>
                )}
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
  onCancel: () => void;
  onSave: (t: DocumentTemplate) => void;
}

const DocumentTemplateEditor: React.FC<EditorProps> = ({ template, onCancel, onSave }) => {
  const { buildings } = useApp();
  const [name, setName] = useState(template?.name || 'Hlasovací listina');
  const [scope, setScope] = useState<'global' | 'building'>(template?.isGlobal ? 'global' : 'building');
  const [buildingId, setBuildingId] = useState<string | undefined>(template?.buildingId);
  const [helpText, setHelpText] = useState<string>(template?.helpText || 'Používejte proměnné {{vote.*}}, {{building.*}}, {{member.*}} a blok {{#questions}}...{{/questions}}');
  const [body, setBody] = useState<string>(template?.body || '<h1>Hlasovací listina – {{vote.title}}</h1>\n{{#questions}}<div>{{index}}. {{question.text}} — [ ] Ano [ ] Ne [ ] Zdržel(a) jsem se</div>{{/questions}}');

  const handleSubmit = () => {
    const t: DocumentTemplate = {
      id: template?.id || Math.random().toString(36).slice(2),
      name,
      body,
      isGlobal: scope === 'global',
      buildingId: scope === 'building' ? buildingId : undefined,
      helpText,
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
          <label className="block text-sm font-medium mb-1" htmlFor="doc-tpl-scope">Rozsah</label>
          <select
            id="doc-tpl-scope"
            className="w-full px-3 py-2 border rounded-md"
            value={scope}
            onChange={(e) => setScope(e.target.value as 'global' | 'building')}
            aria-label="Rozsah šablony"
            title="Rozsah šablony"
          >
            <option value="global">Globální</option>
            <option value="building">Pro konkrétní budovu</option>
          </select>
        </div>
        {scope === 'building' && (
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
