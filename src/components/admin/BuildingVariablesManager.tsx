import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_BUILDING_VARIABLES,
  ADD_BUILDING_VARIABLE,
  UPDATE_BUILDING_VARIABLE,
  DELETE_BUILDING_VARIABLE,
} from '../../graphql/buildingVariables';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { BuildingVariable } from '../../types';

interface Props {
  buildingId: string;
}

export const BuildingVariablesManager: React.FC<Props> = ({ buildingId }) => {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVariable, setEditingVariable] = useState<BuildingVariable | null>(null);
  
  const { data, loading, error } = useQuery(GET_BUILDING_VARIABLES);
  const [addVariableMutation] = useMutation(ADD_BUILDING_VARIABLE, {
    refetchQueries: [GET_BUILDING_VARIABLES],
  });
  const [updateVariableMutation] = useMutation(UPDATE_BUILDING_VARIABLE, {
    refetchQueries: [GET_BUILDING_VARIABLES],
  });
  const [deleteVariableMutation] = useMutation(DELETE_BUILDING_VARIABLE, {
    refetchQueries: [GET_BUILDING_VARIABLES],
  });

  // Všechny proměnné (napříč budovami)
  const allVariables: BuildingVariable[] = data?.building_variables || [];
  // Filtrované pro aktuální budovu
  const buildingVariables = allVariables.filter(v => v.building_id === buildingId);

  const [newVariable, setNewVariable] = useState({
    name: '',
    description: '',
    value: '',
  building_id: buildingId
  });

  const handleAddVariable = async () => {
    if (!newVariable.name.trim() || !newVariable.description.trim()) {
      showToast('Vyplňte název a popis proměnné', 'error');
      return;
    }

    // building_id dostáváme z prop; pokud chybí, nelze pokračovat
    if (!buildingId) {
      showToast('Není vybrána budova', 'error');
      return;
    }

    const variableName = newVariable.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    if (buildingVariables.some((v) => v.name === variableName && v.building_id === newVariable.building_id)) {
      showToast('Proměnná s tímto názvem již pro tuto budovu existuje', 'error');
      return;
    }

    const variableToInsert = {
      name: variableName,
      description: newVariable.description.trim(),
      value: newVariable.value || '',
  building_id: buildingId
    };

    try {
      await addVariableMutation({ variables: { variable: variableToInsert } });
      resetForm();
      setShowAddModal(false);
      showToast('Proměnná budovy byla přidána', 'success');
    } catch (e) {
      console.error(e);
      showToast('Chyba při přidávání proměnné', 'error');
    }
  };

  const handleEditVariable = (variable: BuildingVariable) => {
    setEditingVariable(variable);
    setNewVariable({
      name: variable.name,
      description: variable.description,
      value: variable.value || '',
  building_id: buildingId
    });
    setShowAddModal(true);
  };

  const handleUpdateVariable = async () => {
    if (!editingVariable || !newVariable.description.trim()) {
      showToast('Vyplňte popis proměnné', 'error');
      return;
    }

    const updatedVariableData = {
      description: newVariable.description.trim(),
      value: newVariable.value || '',
  building_id: buildingId
    };

    try {
      await updateVariableMutation({ 
        variables: { 
          name: editingVariable.name, 
          building_id: buildingId, 
          variable: updatedVariableData 
        } 
      });
      resetForm();
      setEditingVariable(null);
      setShowAddModal(false);
      showToast('Proměnná budovy byla aktualizována', 'success');
    } catch (e) {
      console.error(e);
      showToast('Chyba při aktualizaci proměnné', 'error');
    }
  };

  const handleDeleteVariable = (variable: BuildingVariable) => {
    if (window.confirm(`Opravdu chcete smazat proměnnou "${variable.description}"? Tato akce nelze vrátit.`)) {
      deleteVariableMutation({ 
        variables: { 
          name: variable.name, 
          building_id: buildingId 
        } 
      })
        .then(() => showToast('Proměnná budovy byla smazána', 'success'))
        .catch((e) => {
            console.error(e);
            showToast('Chyba při mazání proměnné', 'error');
        });
    }
  };

  const resetForm = () => {
  setNewVariable({ name: '', description: '', value: '', building_id: buildingId });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingVariable(null);
    resetForm();
  };

  if (loading) return <p>Načítání proměnných...</p>;
  if (error) return <p>Chyba při načítání proměnných: {error.message}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Proměnné pro budovy
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Spravujte proměnné, které jsou dostupné pro tuto budovu
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
            <div key={`${variable.name}-${variable.building_id}`} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {variable.description}
                  </h3>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                    {`{{building.${variable.name}}}`}
                  </code>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hodnota: {variable.value || <em className="text-gray-400">Není nastaveno</em>}
                </div>
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
          
          <Input
            label="Hodnota"
            value={newVariable.value}
            onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
            placeholder="Hodnota proměnné"
          />

          {/* ID budovy se nevybírá ručně – přebírá se z aktuálního kontextu */}

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
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Proměnné budovy umožňují ukládat specifické informace o budově, které mohou být použity v šablonách dokumentů a e-mailů.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            <strong>Příklad použití:</strong> Pro každou budovu můžete definovat proměnné jako IČO, adresa sídla, 
            kontaktní údaje na správce a další informace, které se často používají v komunikaci.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>V šablonách</strong> poté stačí použít zápis <code>{'{'}{'{'}"building.nazev_promenne"{'}'}{'}'}</code> a systém
            automaticky doplní uloženou hodnotu pro konkrétní budovu.
          </p>
        </div>
      </Card>
    </div>
  );
};
