import React from 'react';
import { Building2, Plus, MapPin, Users, Settings, X } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BUILDINGS, CREATE_BUILDING, UPDATE_BUILDING, DELETE_BUILDING, type Building } from '../graphql/buildings';
import { Card } from './common/Card';
import { Button } from './common/Button';
// import { BuildingManager } from './admin/BuildingManager'; // Bude refaktorováno později
// import { BuildingEditor } from './admin/BuildingEditor'; // Bude refaktorováno později
import { useToast } from '../contexts/ToastContext';

interface BuildingSelectorProps {
  onBuildingSelect: (building: Building) => void;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({ onBuildingSelect }) => {
  // const [showBuildingManager, setShowBuildingManager] = React.useState(false); // Bude refaktorováno později
  // const [showBuildingEditor, setShowBuildingEditor] = React.useState(false); // Bude refaktorováno později
  const { showToast } = useToast();
  const [seeding, setSeeding] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [createName, setCreateName] = React.useState('');
  const [createAddress, setCreateAddress] = React.useState('');
  const [createUnits, setCreateUnits] = React.useState(0);
  const [showManage, setShowManage] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editAddress, setEditAddress] = React.useState('');
  const [editUnits, setEditUnits] = React.useState(0);
  const [createBuilding, { loading: creating }] = useMutation(CREATE_BUILDING, {
    refetchQueries: [{ query: GET_BUILDINGS }],
    onCompleted: () => {
      showToast('Budova vytvořena', 'success');
      setShowCreate(false);
      setCreateName('');
      setCreateAddress('');
      setCreateUnits(0);
    },
    onError: (e) => showToast('Chyba: ' + e.message, 'error')
  });
  const [updateBuilding, { loading: updating }] = useMutation(UPDATE_BUILDING, {
    refetchQueries: [{ query: GET_BUILDINGS }],
    onCompleted: () => {
      showToast('Budova upravena', 'success');
      setEditId(null);
    },
    onError: (e) => showToast('Chyba: ' + e.message, 'error')
  });
  const [deleteBuilding, { loading: deleting }] = useMutation(DELETE_BUILDING, {
    refetchQueries: [{ query: GET_BUILDINGS }],
    onCompleted: () => showToast('Budova smazána', 'success'),
    onError: (e) => showToast('Chyba: ' + e.message, 'error')
  });

  const startEdit = (b: Building) => {
    setEditId(b.id);
    setEditName(b.name);
    setEditAddress(b.address);
    setEditUnits(b.total_units || 0);
  };

  // Načtení budov pomocí GraphQL
  const { data, loading, error } = useQuery(GET_BUILDINGS);
  const buildings: Building[] = data?.buildings || [];

  // Seed demo data bude potřeba refaktorovat s GraphQL mutacemi
  const seedDemoData = () => {
    setSeeding(true);
    showToast('Funkce pro demo data se připravuje.', 'info');
    // Zde bude logika pro naplnění dat pomocí GraphQL
    setTimeout(() => setSeeding(false), 2000); // Simulace
  };

  /*  Bude refaktorováno později
  if (showBuildingManager) {
    return <BuildingManager onBack={() => setShowBuildingManager(false)} />;
  }

  if (showBuildingEditor) {
    return <BuildingEditor onBack={() => setShowBuildingEditor(false)} />;
  }
  */

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
            OnlineHlasovani
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Vyberte budovu pro správu hlasování a komunikace s vlastníky
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Chyba při načítání budov
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Načítám budovy...</span>
            </div>
          </div>
        )}

        {/* Buildings Grid */}
        {!loading && !error && buildings.length === 0 && (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Nebyly nalezeny žádné budovy</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Začněte tím, že přidáte první budovu.</p>
                <Button onClick={() => setShowCreate(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat novou budovu
                </Button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {buildings.map((building) => (
            <Card
              key={building.id}
              onClick={() => onBuildingSelect(building)}
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
                      {/* Informace o počtu jednotek bude přidána později, pokud bude potřeba */}
                      <span className="text-sm">Spravovat</span>
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

          {/* Add New Building Card - bude refaktorováno */}
          {buildings.length > 0 && (
      <Card 
        onClick={() => setShowCreate(true)}
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
                    <Button variant="secondary" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Nová budova
                    </Button>
                </div>
                </div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowManage(true)}
            >
              <Settings className="w-4 h-4" />
              <span>Spravovat budovy</span>
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Přidat budovu</span>
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            {/* Demo seeding is available only in non-production environments */}
            {!import.meta.env.PROD && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={seedDemoData}
                disabled={seeding}
              >
                <Users className="w-4 h-4" />
                <span>{seeding ? 'Plním demo data…' : 'Naplnit demo data'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Systém pro správu hlasování a komunikace v SVJ/BD
          </p>
        </div>
        {/* Create Building Modal */}
        {(showCreate || showManage) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 relative">
              <button onClick={() => { setShowCreate(false); setShowManage(false); setEditId(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Zavřít" title="Zavřít">
                <X className="w-5 h-5" />
              </button>
              {showCreate && !showManage && (
                <>
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Nová budova</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createBuilding({ variables: { name: createName, address: createAddress, total_units: createUnits, variables: {} } });
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">Název</label>
                      <input value={createName} onChange={(e) => setCreateName(e.target.value)} required placeholder="Např. Dům A" aria-label="Název budovy" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">Adresa</label>
                      <input value={createAddress} onChange={(e) => setCreateAddress(e.target.value)} required placeholder="Ulice 123, Město" aria-label="Adresa" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">Počet jednotek</label>
                      <input type="number" min={0} value={createUnits} onChange={(e) => setCreateUnits(parseInt(e.target.value) || 0)} placeholder="0" aria-label="Počet jednotek" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreate(false)}>Zrušit</Button>
                      <Button type="submit" disabled={creating || !createName} className="flex-1">{creating ? 'Ukládám…' : 'Vytvořit'}</Button>
                    </div>
                  </form>
                </>
              )}
              {showManage && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Správa budov</h2>
                  {buildings.length === 0 && <p className="text-sm text-gray-500">Žádné budovy</p>}
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {buildings.map((b) => (
                      <div key={b.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative group bg-white/50 dark:bg-gray-800/50">
                        {editId === b.id ? (
                          <form onSubmit={(e) => { e.preventDefault(); updateBuilding({ variables: { id: b.id, name: editName, address: editAddress, total_units: editUnits, variables: {} } }); }} className="space-y-2">
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} required placeholder="Název" aria-label="Název" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm" />
                            <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required placeholder="Adresa" aria-label="Adresa" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm" />
                            <input type="number" min={0} value={editUnits} onChange={(e) => setEditUnits(parseInt(e.target.value) || 0)} placeholder="Jednotky" aria-label="Počet jednotek" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm" />
                            <div className="flex gap-2 justify-end pt-1">
                              <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}>Zrušit</Button>
                              <Button type="submit" size="sm" disabled={updating}>{updating ? 'Ukládám…' : 'Uložit'}</Button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{b.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{b.address}</p>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={() => startEdit(b)}>Upravit</Button>
                                <Button size="sm" variant="danger" disabled={deleting} onClick={() => { if (confirm('Smazat budovu?')) deleteBuilding({ variables: { id: b.id } }); }}>Smazat</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="secondary" onClick={() => { setShowManage(false); setShowCreate(true); }}>+ Nová budova</Button>
                    <Button variant="ghost" onClick={() => { setShowManage(false); setEditId(null); }}>Zavřít</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
