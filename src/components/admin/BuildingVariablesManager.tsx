import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { BuildingVariable } from '../../data/mockData';

export const BuildingVariablesManager: React.FC = () => {
  const { buildingVariables, addBuildingVariable, updateBuildingVariable, deleteBuildingVariable } = useApp();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVariable, setEditingVariable] = useState<BuildingVariable | null>(null);
  const [newVariable, setNewVariable] = useState({
    name: '',
    description: '',
    type: 'text' as 'text' | 'textarea' | 'select',
    required: false,
    placeholder: '',
    options: ['']
  });

  const handleAddVariable = () => {
    if (!newVariable.name.trim() || !newVariable.description.trim()) {
      showToast('Vyplňte název a popis proměnné', 'error');
      return;
    }

    const variableName = newVariable.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    if (buildingVariables.some(v => v.name === variableName)) {
      showToast('Proměnná s tímto názvem již existuje', 'error');
      return;
    }

    const variable: BuildingVariable = {
      name: variableName,
      description: newVariable.description.trim(),
      type: newVariable.type,
      required: newVariable.required,
      placeholder: newVariable.placeholder.trim() || undefined,
      options: newVariable.type === 'select' 
        ? newVariable.options.filter(opt => opt.trim()).map(opt => opt.trim())
        : undefined
    };

    addBuildingVariable(variable);
    resetForm();
    setShowAddModal(false);
    showToast('Proměnná budovy byla přidána', 'success');
  };

  const handleEditVariable = (variable: BuildingVariable) => {
    setEditingVariable(variable);
    setNewVariable({
      name: variable.name,
      description: variable.description,
      type: variable.type,
      required: variable.required || false,
      placeholder: variable.placeholder || '',
      options: variable.options || ['']
    });
    setShowAddModal(true);
  };

  const handleUpdateVariable = () => {
    if (!editingVariable || !newVariable.description.trim()) {
      showToast('Vyplňte popis proměnné', 'error');
      return;
    }

    const updatedVariable: BuildingVariable = {
      ...editingVariable,
      description: newVariable.description.trim(),
      type: newVariable.type,
      required: newVariable.required,
      placeholder: newVariable.placeholder.trim() || undefined,
      options: newVariable.type === 'select' 
        ? newVariable.options.filter(opt => opt.trim()).map(opt => opt.trim())
        : undefined
    };

    updateBuildingVariable(updatedVariable);
    resetForm();
    setEditingVariable(null);
    setShowAddModal(false);
    showToast('Proměnná budovy byla aktualizována', 'success');
  };

  const handleDeleteVariable = (variable: BuildingVariable) => {
    if (window.confirm(`Opravdu chcete smazat proměnnou "${variable.description}"? Tato akce ovlivní všechny budovy.`)) {
      deleteBuildingVariable(variable.name);
      showToast('Proměnná budovy byla smazána', 'success');
    }
  };

  const resetForm = () => {
    setNewVariable({
      name: '',
      description: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: ['']
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingVariable(null);
    resetForm();
  };

  const addOption = () => {
    setNewVariable({
      ...newVariable,
      options: [...newVariable.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newVariable.options];
    newOptions[index] = value;
    setNewVariable({
      ...newVariable,
      options: newOptions
    });
  };

  const removeOption = (index: number) => {
    if (newVariable.options.length > 1) {
      const newOptions = newVariable.options.filter((_, i) => i !== index);
      setNewVariable({
        ...newVariable,
        options: newOptions
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Proměnné pro budovy
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Definujte, jaké proměnné budou dostupné pro každou budovu
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Přidat proměnnou
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {buildingVariables.map((variable) => (
            <div key={variable.name} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {variable.description}
                  </h3>
                  {variable.required && (
                    <span className="text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                      Povinné
                    </span>
                  )}
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    {variable.type === 'text' && 'Text'}
                    {variable.type === 'textarea' && 'Dlouhý text'}
                    {variable.type === 'select' && 'Výběr'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                    {`{{${variable.name}}}`}
                  </code>
                </div>
                {variable.placeholder && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Placeholder: {variable.placeholder}
                  </div>
                )}
                {variable.options && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Možnosti: {variable.options.join(', ')}
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditVariable(variable)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteVariable(variable)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {buildingVariables.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="mb-4">Žádné proměnné pro budovy nejsou definovány</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Přidat první proměnnou
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title={editingVariable ? 'Upravit proměnnou budovy' : 'Přidat proměnnou budovy'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Název proměnné"
            value={newVariable.name}
            onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
            placeholder="nazev_promenne"
            disabled={!!editingVariable}
            helperText={editingVariable ? 'Název proměnné nelze změnit' : 'Použijte pouze malá písmena, číslice a podtržítka'}
          />
          
          <Input
            label="Popis proměnné"
            value={newVariable.description}
            onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
            placeholder="Popis toho, co proměnná obsahuje"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Typ pole
            </label>
            <select
              value={newVariable.type}
              onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="text">Textové pole</option>
              <option value="textarea">Dlouhý text (textarea)</option>
              <option value="select">Výběr z možností</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={newVariable.required}
              onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="required" className="text-sm text-gray-700 dark:text-gray-300">
              Povinné pole
            </label>
          </div>

          <Input
            label="Placeholder text"
            value={newVariable.placeholder}
            onChange={(e) => setNewVariable({ ...newVariable, placeholder: e.target.value })}
            placeholder="Nápověda pro uživatele"
            helperText="Nepovinný text, který se zobrazí jako nápověda v poli"
          />

          {newVariable.type === 'select' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Možnosti výběru
              </label>
              <div className="space-y-2">
                {newVariable.options.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Možnost ${index + 1}`}
                      className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {newVariable.options.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Přidat možnost
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={closeModal}>
              Zrušit
            </Button>
            <Button onClick={editingVariable ? handleUpdateVariable : handleAddVariable}>
              {editingVariable ? 'Aktualizovat' : 'Přidat'} proměnnou
            </Button>
          </div>
        </div>
      </Modal>

      <Card className="p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Jak fungují proměnné pro budovy
        </h3>
        <div className="prose dark:prose-invert max-w-none text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Dvoufázový systém
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                <strong>1. Definice šablony:</strong> Zde vytvoříte "prázdný rámeček" pro informaci. 
                Řeknete systému: "Každá budova bude mít proměnnou {"{{ico}}"}".
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>2. Vyplnění hodnoty:</strong> Při editaci konkrétní budovy systém zobrazí 
                pole pro všechny definované proměnné a vy vyplníte konkrétní hodnoty.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Typy polí
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                <strong>Text:</strong> Krátké textové informace jako IČO, telefon, název.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                <strong>Dlouhý text:</strong> Víceřádkové texty jako poznámky nebo adresy.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Výběr:</strong> Dropdown s přednastavenými možnostmi jako způsob oslovení.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};