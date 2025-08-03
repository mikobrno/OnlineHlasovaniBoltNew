import React from 'react';
import { Building2, Plus, MapPin, Users, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContextCompat';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { BuildingManager } from './admin/BuildingManager';
import { BuildingEditor } from './admin/BuildingEditor';

export const BuildingSelector: React.FC = () => {
  const { buildings, selectBuilding } = useApp();
  const [showBuildingManager, setShowBuildingManager] = React.useState(false);
  const [showBuildingEditor, setShowBuildingEditor] = React.useState(false);

  if (showBuildingManager) {
    return <BuildingManager onBack={() => setShowBuildingManager(false)} />;
  }

  if (showBuildingEditor) {
    return <BuildingEditor onBack={() => setShowBuildingEditor(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            OnlineHlasování
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Vyberte budovu pro správu hlasování a komunikace s vlastníky
          </p>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {buildings.map((building) => (
            <Card
              key={building.id}
              onClick={() => selectBuilding(building)}
              className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white dark:bg-gray-800"
            >
              <div className="p-8">
                {/* Building Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Building Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {building.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{building.address}</span>
                    </div>
                    
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{building.totalUnits} jednotek</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="w-full">
                      Vybrat budovu
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Add New Building Card */}
          <Card 
            onClick={() => setShowBuildingEditor(true)}
            className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                Přidat budovu
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Vytvořte novou budovu pro správu
              </p>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" className="w-full" onClick={(e) => {
                  e?.stopPropagation();
                  setShowBuildingEditor(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nová budova
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowBuildingManager(true)}
            >
              <Settings className="w-4 h-4" />
              <span>Spravovat budovy</span>
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowBuildingEditor(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Přidat budovu</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Systém pro správu hlasování a komunikace v SVJ/BD
          </p>
        </div>
      </div>
    </div>
  );
};
