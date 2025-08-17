// src/modules/buildings/components/BuildingList.tsx
import { FC } from 'react';
import { Building } from '../types';
import { useBuildingContext } from '../context/BuildingContext';
import { Button } from '@/components/ui/button';
import { useQuery } from '@apollo/client';
import { GET_BUILDINGS } from '../graphql/queries';
import { buildingsLogger } from '../utils/logger';

interface BuildingListProps {
  onAddBuilding: () => void;
}

export const BuildingList: FC<BuildingListProps> = ({ onAddBuilding }) => {
  const { setSelectedBuilding, setEditingBuilding, openForm } = useBuildingContext();
  const { data, loading, error } = useQuery(GET_BUILDINGS);

  if (loading) {
    buildingsLogger.info('Načítání seznamu budov...');
    return <div>Načítání...</div>;
  }
  
  if (error) {
    buildingsLogger.error('Chyba při načítání seznamu budov', error);
    return <div>Chyba: {error.message}</div>;
  }

  const buildings = data?.buildings || [];
  buildingsLogger.debug('Načteno budov:', buildings.length);

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    openForm();
  };

  const handleSelect = (building: Building) => {
    setSelectedBuilding(building);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seznam budov</h2>
        <Button onClick={onAddBuilding}>Přidat budovu</Button>
      </div>

      <div className="grid gap-4">
        {buildings.map((building: Building) => (
          <div
            key={building.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => handleSelect(building)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{building.name}</h3>
                <p className="text-sm text-gray-600">{building.address}</p>
                <p className="text-sm">Počet jednotek: {building.total_units}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleEdit(building);
                }}
              >
                Upravit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
