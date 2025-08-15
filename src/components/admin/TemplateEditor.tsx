import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ArrowLeft, Wand2, Eye, Copy, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { availableVariables, Variable } from '../../lib/variables';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_EMAIL_TEMPLATE, UPDATE_EMAIL_TEMPLATE } from '../../graphql/templates';
import { GET_BUILDINGS_FOR_TEMPLATES } from '../../graphql/queries';
import { Building, EmailTemplate } from '../../types';

interface TemplateEditorProps {
  template?: EmailTemplate | null;
  onBack: () => void;
  buildingId: string; 
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onBack,
  buildingId
}) => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    building_id: '',
    is_global: true
  });
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customVariables, setCustomVariables] = useState<Variable[]>([]);
  const [newVariableName, setNewVariableName] = useState('');
  const [newVariableDesc, setNewVariableDesc] = useState('');

  const { data: buildingsData, loading: buildingsLoading } = useQuery(GET_BUILDINGS_FOR_TEMPLATES);
  const buildings: Building[] = buildingsData?.buildings || [];

  const [addTemplateMutation] = useMutation(ADD_EMAIL_TEMPLATE, {
    refetchQueries: ['GetEmailTemplates'],
  });
  const [updateTemplateMutation] = useMutation(UPDATE_EMAIL_TEMPLATE, {
    refetchQueries: ['GetEmailTemplates'],
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        subject: template.subject || '',
        body: template.body || '',
        building_id: template.building_id || buildingId || '',
        is_global: template.is_global ?? true
      });
    } else {
        setFormData(prev => ({ ...prev, building_id: buildingId, is_global: !buildingId }));
    }
  }, [template, buildingId]);

  const addCustomVariable = () => {
    if (!newVariableName.trim() || !newVariableDesc.trim()) {
      showToast('Vyplňte název a popis proměnné', 'error');
      return;
    }

    const variableName = newVariableName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    if (availableVariables.some((v: { name: string; }) => v.name === variableName) || 
        customVariables.some(v => v.name === variableName)) {
      showToast('Proměnná s tímto názvem již existuje', 'error');
      return;
    }

    const newVariable: Variable = {
      name: variableName,
      description: newVariableDesc.trim(),
      type: 'custom'
    };

    setCustomVariables([...customVariables, newVariable]);
    setNewVariableName('');
    setNewVariableDesc('');
    showToast('Vlastní proměnná byla přidána', 'success');
  };

  const removeCustomVariable = (variableName: string) => {
    setCustomVariables(customVariables.filter(v => v.name !== variableName));
    showToast('Vlastní proměnná byla odstraněna', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      showToast('Vyplňte všechna povinná pole', 'error');
      return;
    }
    
    if (!formData.is_global && !formData.building_id) {
        showToast('Vyberte budovu pro specifickou šablonu.', 'error');
        return;
    }

    // TODO: Vlastní proměnné nejsou zatím ukládány do DB
    const templateData = {
      name: formData.name.trim(),
      subject: formData.subject.trim(),
      body: formData.body.trim(),
      building_id: formData.is_global ? null : formData.building_id,
      is_global: formData.is_global,
    };

    try {
        if (template && template.id) {
          await updateTemplateMutation({
            variables: {
              id: template.id,
              template: templateData,
            },
          });
          showToast('Šablona byla aktualizována', 'success');
        } else {
          await addTemplateMutation({
            variables: {
              template: templateData,
            },
          });
          showToast('Šablona byla přidána', 'success');
        }
        onBack();
    } catch (error) {
        console.error("Error saving template:", error);
        showToast('Chyba při ukládání šablony.', 'error');
    }
  };

  const generateWithAI = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      showToast('API klíč pro Gemini není nastaven', 'error');
      return;
    }

    if (!aiPrompt.trim()) {
      showToast('Zadejte popis e-mailu', 'error');
      return;
    }

    setIsGenerating(true);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
Vygeneruj obsah e-mailu v českém jazyce pro SVJ/BD na základě tohoto popisu: "${aiPrompt}"

Požadavky:
- Formální, ale přátelský ton
- Struktura: úvodní oslovení, hlavní obsah, závěr, podpis
- Použij relevantní proměnné ze seznamu: ${availableVariables.map((v: { name: string; }) => `{{${v.name}}}`).join(', ')}
- Odpověz pouze obsahem e-mailu bez dalšího textu
- Nepoužívej markdown formátování
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setFormData(prev => ({ ...prev, body: text }));
      setAiPrompt('');
      showToast('Obsah e-mailu byl vygenerován', 'success');
    } catch (error) {
      console.error('Error generating AI content:', error);
      showToast('Chyba při generování obsahu', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    const textarea = document.querySelector('textarea[name="body"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = formData.body.substring(0, start) + variable + formData.body.substring(end);
      setFormData(prev => ({ ...prev, body: newBody }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      setFormData(prev => ({ ...prev, body: prev.body + variable }));
    }
  };

  // Funkce náhledu je dočasně zjednodušena, protože nemáme přístup k členům a globálním proměnným
  const getPreviewData = () => {
    const previewSubject = formData.subject.replace(/{{.*?}}/g, '[proměnná]');
    const previewBody = formData.body.replace(/{{.*?}}/g, '[proměnná]');
    
    return {
      subject: previewSubject,
      body: previewBody
    };
  };

  const previewData = getPreviewData();

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na přehled
        </Button>
      </div>

      <div className="max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {template ? 'Upravit šablonu' : 'Nová e-mailová šablona'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Základní informace
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Název šablony *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="např. Pozvánka na hlasování"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="scope"
                          checked={formData.is_global}
                          onChange={() => setFormData({ ...formData, is_global: true })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Globální šablona
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="scope"
                          checked={!formData.is_global}
                          onChange={() => setFormData({ ...formData, is_global: false })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Pro konkrétní budovu
                        </span>
                      </label>
                    </div>
                  </div>

                  {!formData.is_global && (
                    <div>
                      <label htmlFor="building-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Budova
                      </label>
                      <select
                        id="building-select"
                        value={formData.building_id}
                        onChange={(e) => setFormData({ ...formData, building_id: e.target.value })}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={buildingsLoading}
                      >
                        <option value="">Vyberte budovu</option>
                        {buildings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Obsah e-mailu
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Předmět *"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="např. Pozvánka k hlasování - {{nazev_hlasovani}}"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tělo e-mailu *
                    </label>
                    <textarea
                      name="body"
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      rows={12}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="Obsah e-mailu..."
                      required
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      AI Generátor obsahu
                    </h4>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Popište, jaký e-mail chcete vygenerovat..."
                        className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button
                        type="button"
                        onClick={generateWithAI}
                        disabled={isGenerating}
                        size="sm"
                      >
                        {isGenerating ? (
                          <>Generuje se...</>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Vygenerovat
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary" onClick={onBack}>
                  Zrušit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Skrýt' : 'Zobrazit'} náhled
                </Button>
                <Button type="submit">
                  {template ? 'Aktualizovat' : 'Vytvořit'} šablonu
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Systémové proměnné
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {availableVariables.map((variable: { name: string; description: string; }) => (
                  <button
                    key={variable.name}
                    type="button"
                    onClick={() => insertVariable(variable.name)}
                    className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition-colors group"
                  >
                    <div className="font-mono text-blue-600 dark:text-blue-400">
                      {`{{${variable.name}}}`}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-1 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                      {variable.description}
                    </div>
                  </button>
                ))}
              </div>

              {customVariables.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Vlastní proměnné
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
                    {customVariables.map((variable) => (
                      <div key={variable.name} className="relative group">
                        <button
                          type="button"
                          onClick={() => insertVariable(variable.name)}
                          className="w-full text-left p-2 text-xs bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 rounded border border-purple-200 dark:border-purple-700 transition-colors"
                        >
                          <div className="font-mono text-purple-600 dark:text-purple-400">
                            {`{{${variable.name}}}`}
                          </div>
                          <div className="text-purple-700 dark:text-purple-300 mt-1">
                            {variable.description}
                          </div>
                        </button>
                        <button
                          type="button"
                          title={`Smazat proměnnou ${variable.name}`}
                          onClick={() => removeCustomVariable(variable.name)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Přidat vlastní proměnnou
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="název_proměnné"
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                     className="w-full text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Popis proměnné"
                    value={newVariableDesc}
                    onChange={(e) => setNewVariableDesc(e.target.value)}
                     className="w-full text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addCustomVariable}
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Přidat
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {showPreview && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Náhled šablony
              </h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(`Předmět: ${previewData.subject}\n\n${previewData.body}`);
                  showToast('Náhled zkopírován do schránky', 'success');
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Kopírovat
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Předmět
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-medium">
                  {previewData.subject}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tělo e-mailu
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm whitespace-pre-wrap border max-h-64 overflow-y-auto">
                  {previewData.body}
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Náhled je zjednodušený. Proměnné budou nahrazeny při odeslání.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
