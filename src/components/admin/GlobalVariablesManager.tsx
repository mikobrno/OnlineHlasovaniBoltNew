import React, { useState } from 'react';
import { Save, RotateCcw, Eye, EyeOff, Plus, Trash2, Edit } from 'lucide-react';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { GlobalVariable } from '../../data/mockData';
import { generateId } from '../../lib/utils';

export const GlobalVariablesManager: React.FC = () => {
  const { globalVariables, addGlobalVariable, updateGlobalVariable, deleteGlobalVariable } = useApp();
  const { showToast } = useToast();
  const [editedVariables, setEditedVariables] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVariable, setEditingVariable] = useState<GlobalVariable | null>(null);
  const [newVariable, setNewVariable] = useState({
    name: '',
    description: '',
    value: ''
  });

  const handleVariableChange = (name: string, value: string) => {
    setEditedVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getVariableValue = (variable: GlobalVariable) => {
    return editedVariables[variable.name] !== undefined 
      ? editedVariables[variable.name] 
      : variable.value;
  };

  const hasChanges = () => {
    return Object.keys(editedVariables).some(name => {
      const original = globalVariables.find(v => v.name === name);
      return original && editedVariables[name] !== original.value;
    });
  };

  const handleSave = () => {
    Object.entries(editedVariables).forEach(([name, value]) => {
      const variable = globalVariables.find(v => v.name === name);
      if (variable && value !== variable.value) {
        updateGlobalVariable({
          ...variable,
          value
        });
      }
    });
    
    setEditedVariables({});
    showToast('Globální proměnné byly uloženy', 'success');
  };

  const handleReset = () => {
    setEditedVariables({});
    showToast('Změny byly zrušeny', 'info');
  };

  const resolveNestedVariables = (text: string): string => {
    let result = text;
    
    // Simple resolution - replace variables with their current values
    globalVariables.forEach(variable => {
      const currentValue = getVariableValue(variable);
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      result = result.replace(regex, currentValue);
    });
    
    return result;
  };

  const handleAddVariable = () => {
    if (!newVariable.name.trim() || !newVariable.description.trim()) {
      showToast('Vyplňte název a popis proměnné', 'error');
      return;
    }

    const variableName = newVariable.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    if (globalVariables.some(v => v.name === variableName)) {
      showToast('Proměnná s tímto názvem již existuje', 'error');
      return;
    }

    const variable: GlobalVariable = {
      name: variableName,
      description: newVariable.description.trim(),
      value: newVariable.value.trim(),
      isEditable: true
    };

    addGlobalVariable(variable);
    setNewVariable({ name: '', description: '', value: '' });
    setShowAddModal(false);
    showToast('Globální proměnná byla přidána', 'success');
  };

  const handleEditVariable = (variable: GlobalVariable) => {
    setEditingVariable(variable);
    setNewVariable({
      name: variable.name,
      description: variable.description,
      value: variable.value
    });
    setShowAddModal(true);
  };

  const handleUpdateVariable = () => {
    if (!editingVariable || !newVariable.description.trim()) {
      showToast('Vyplňte popis proměnné', 'error');
      return;
    }

    const updatedVariable: GlobalVariable = {
      ...editingVariable,
      description: newVariable.description.trim(),
      value: newVariable.value.trim()
    };

    updateGlobalVariable(updatedVariable);
    setEditingVariable(null);
    setNewVariable({ name: '', description: '', value: '' });
    setShowAddModal(false);
    showToast('Globální proměnná byla aktualizována', 'success');
  };

  const handleDeleteVariable = (variable: GlobalVariable) => {
    if (!variable.isEditable) {
      showToast('Tuto systémovou proměnnou nelze smazat', 'error');
      return;
    }

    if (window.confirm(`Opravdu chcete smazat proměnnou "${variable.description}"?`)) {
      deleteGlobalVariable(variable.name);
      showToast('Globální proměnná byla smazána', 'success');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingVariable(null);
    setNewVariable({ name: '', description: '', value: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Globální proměnné
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tyto proměnné jsou dostupné ve všech šablonách napříč celou aplikací
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowPreview(!showPreview)}
            size="sm"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? 'Skrýt' : 'Zobrazit'} náhled
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Přidat proměnnou
          </Button>
          {hasChanges() && (
            <>
              <Button
                variant="secondary"
                onClick={handleReset}
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Zrušit změny
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Uložit změny
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Editace proměnných
            </h3>
            <div className="space-y-4">
              {globalVariables.map((variable) => (
                <div key={variable.name} className="relative group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {variable.description}
                    {!variable.isEditable && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(systémová)</span>
                    )}
                  </label>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">
                    {`{{${variable.name}}}`}
                  </div>
                  <div className="relative">
                    {variable.name === 'podpis_spravce' || variable.name === 'pravni_upozorneni' ? (
                      <textarea
                        value={getVariableValue(variable)}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        rows={3}
                        disabled={!variable.isEditable}
                        className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          !variable.isEditable ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    ) : (
                      <Input
                        value={getVariableValue(variable)}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        disabled={!variable.isEditable}
                        className={!variable.isEditable ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                    )}
                    {variable.isEditable && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          type="button"
                          onClick={() => handleEditVariable(variable)}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                        >
                          <Edit className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariable(variable)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {showPreview && (
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Náhled s rozbalenými proměnnými
              </h3>
              <div className="space-y-4">
                {globalVariables.filter(v => v.isEditable).map((variable) => (
                  <div key={variable.name} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {variable.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">
                      {`{{${variable.name}}}`}
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                      <div className="text-gray-600 dark:text-gray-400 mb-1">Původní hodnota:</div>
                      <div className="font-mono text-xs mb-2 text-gray-800 dark:text-gray-200">
                        {variable.value}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mb-1">Po rozbalení proměnných:</div>
                      <div className="font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {resolveNestedVariables(getVariableValue(variable))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title={editingVariable ? 'Upravit globální proměnnou' : 'Přidat globální proměnnou'}
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
              Hodnota proměnné
            </label>
            <textarea
              value={newVariable.value}
              onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
              rows={3}
             className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Hodnota, která se dosadí místo proměnné"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Můžete použít i jiné globální proměnné, např. {`{{nazev_spolecnosti}}`}
            </p>
          </div>

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
          Jak používat globální proměnné
        </h3>
        <div className="prose dark:prose-invert max-w-none text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Co jsou globální proměnné?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Globální proměnné jsou hodnoty, které zůstávají stejné napříč celou aplikací, 
                bez ohledu na to, pro jakou budovu právě pracujete.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Představte si je jako "firemní razítko" - obsahují informace o vaší správcovské 
                společnosti, které se nikdy nemění.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Systémové vs. vlastní proměnné
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                <strong>Systémové proměnné</strong> (označené modře) jsou automaticky generované 
                a nelze je smazat. Například <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">datum_dnes</code>.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Vlastní proměnné</strong> můžete přidávat, upravovat a mazat podle potřeby. 
                Mohou obsahovat odkazy na jiné globální proměnné.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
