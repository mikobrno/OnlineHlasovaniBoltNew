import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';

const CREATE_BUILDING = gql`
  mutation CreateBuilding($name: String!, $address: String!, $total_units: Int!, $variables: jsonb) {
    insert_buildings_one(object: {
      name: $name,
      address: $address,
      total_units: $total_units,
      variables: $variables
    }) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($id: uuid!, $name: String!, $address: String!, $total_units: Int!, $variables: jsonb) {
    update_buildings_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        address: $address,
        total_units: $total_units,
        variables: $variables
      }
    ) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

const GET_BUILDING_VARIABLES = gql`
  query GetBuildingVariables {
    building_variables {
      name
      description
      type
      required
      placeholder
      options
    }
  }
`;

interface Building {
  id: string;
  name: string;
  address: string;
  total_units: number;
  variables?: Record<string, string>;
}

interface BuildingVariable {
  name: string;
  description: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface BuildingEditorProps {
  building?: Building | null;
  onBack: () => void;
}

export const BuildingEditor: React.FC<BuildingEditorProps> = ({
  building,
  onBack
}) => {
  const { showToast } = useToast();
  const [createBuilding] = useMutation(CREATE_BUILDING);
  const [updateBuildingMutation] = useMutation(UPDATE_BUILDING);
  const { data: variablesData } = useQuery(GET_BUILDING_VARIABLES);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalUnits: 1,
    variables: {} as Record<string, string>
  });

  const buildingVariables = React.useMemo(() => 
    variablesData?.building_variables || [], 
    [variablesData?.building_variables]
  );

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        address: building.address,
        totalUnits: building.total_units,
        variables: building.variables || {}
      });
    } else {
      // Initialize with default variables
      const defaultVariables: Record<string, string> = {};
      if (buildingVariables) {
        buildingVariables.forEach((variable: BuildingVariable) => {
          defaultVariables[variable.name] = '';
        });
      }
      
      setFormData({
        name: '',
        address: '',
        totalUnits: 1,
        variables: defaultVariables
      });
    }
  }, [building, buildingVariables]);

  const handleVariableChange = (variableName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [variableName]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      showToast('Vyplňte název a adresu budovy', 'error');
      return;
    }

    const buildingData = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      total_units: formData.totalUnits,
      variables: formData.variables
    };

    try {
      if (building) {
        await updateBuildingMutation({
          variables: {
            id: building.id,
            ...buildingData
          },
          refetchQueries: ['GetBuildings']
        });
        showToast('Budova byla aktualizována', 'success');
      } else {
        await createBuilding({
          variables: buildingData,
          refetchQueries: ['GetBuildings']
        });
        showToast('Budova byla přidána', 'success');
      }
      
      onBack();
    } catch (error) {
      console.error('Chyba při ukládání budovy:', error);
      showToast('Nepodařilo se uložit budovu', 'error');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na přehled
        </Button>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {building ? 'Upravit budovu' : 'Nová budova'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Základní informace
            </h3>
            <div className="space-y-4">
              <Input
                label="Název budovy *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="např. Bytový dům Vinohradská 125"
                required
              />
              
              <Input
                label="Adresa *"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="např. Vinohradská 125, Praha 2"
                required
              />
              
              <Input
                label="Počet jednotek"
                type="number"
                min="1"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 1 })}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Informace specifické pro budovu
            </h3>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Tyto proměnné budou dostupné ve všech e-mailových šablonách 
                pro tuto budovu. Vyplňte je pečlivě - ušetří vám to čas při psaní e-mailů.
              </p>
            </div>
            <div className="space-y-4">
              {buildingVariables.map((variable: BuildingVariable) => (
                <div key={variable.name}>
                  {variable.type === 'select' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {variable.description}
                        {variable.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <select
                        value={formData.variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={variable.required}
                        aria-label={variable.description}
                      >
                        <option value="">Vyberte možnost</option>
                        {variable.options?.map((option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Proměnná: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{`{{${variable.name}}}`}</code>
                      </p>
                    </div>
                  ) : variable.type === 'textarea' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {variable.description}
                        {variable.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <textarea
                        value={formData.variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        rows={3}
                        placeholder={variable.placeholder}
                        required={variable.required}
                       className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Proměnná: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{`{{${variable.name}}}`}</code>
                      </p>
                    </div>
                  ) : (
                    <Input
                      label={variable.description}
                      value={formData.variables[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      helperText={`Proměnná: {{${variable.name}}}`}
                      placeholder={variable.placeholder}
                      required={variable.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onBack}>
              Zrušit
            </Button>
            <Button type="submit">
              {building ? 'Aktualizovat' : 'Vytvořit'} budovu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
