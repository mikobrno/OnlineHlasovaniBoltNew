import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useToast } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { GET_USER_BUILDINGS } from '../graphql/buildings';
import type { Building } from '../../../shared/types/building';
import { useBuildingStore } from '../../../shared/store/buildingStore';

export function BuildingSelector() {
  const { data, loading, error } = useQuery(GET_USER_BUILDINGS);
  const { showToast } = useToast();
  const { setSelectedBuilding } = useBuildingStore();

  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        title: 'Chyba při načítání budov',
        message: error.message
      });
    }
  }, [error, showToast]);

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
  };

  if (loading) {
    return <div>Načítám seznam budov...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Vyberte budovu
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {data?.buildings.map((building: Building) => (
            <Card 
              key={building.id}
              onClick={() => handleSelectBuilding(building)}
              className="p-6 hover:border-blue-500 cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{building.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{building.address}</p>
              <div className="mt-4">
                <Button>Vybrat budovu</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
