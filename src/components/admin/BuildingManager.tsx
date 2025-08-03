import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { BuildingEditor } from './BuildingEditor';
import { Building } from '../../data/mockData';

interface BuildingManagerProps {
  onBack?: () => void;
}

export const BuildingManager: React.FC<BuildingManagerProps> = ({ onBack }) => {
  const { buildings, deleteBuilding } = useApp();
  const [showEditor, setShowEditor] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setShowEditor(true);
  };

  const handleDelete = (building: Building) => {
    if (window.confirm(`Opravdu chcete smazat budovu "${building.name}"? Tato akce smaže i všechny související členy a hlasování.`)) {
      deleteBuilding(building.id);
    }
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingBuilding(null);
  };

  if (showEditor) {
    return (
      <BuildingEditor
        building={editingBuilding}
        onBack={closeEditor}
      />
    );
  }

  return (
    <div>
      {onBack && (
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na výběr budov
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Správa budov
        </h2>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nová budova
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {buildings.map((building) => (
          <Card key={building.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {building.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {building.address}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {building.totalUnits} jednotek
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(building)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(building)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {buildings.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="mb-4">Žádné budovy nejsou definovány</p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Přidat první budovu
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};