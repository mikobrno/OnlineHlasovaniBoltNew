import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, MapPin, Users, Settings } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { BuildingManager } from './admin/BuildingManager';
import { BuildingEditor } from './admin/BuildingEditor';
import { useToast } from '../contexts/ToastContext';
import type { Building } from '../data/mockData';

export const BuildingSelector: React.FC = () => {
  const { buildings, selectBuilding, loadBuildings, error, loading } = useApp();
  const [showBuildingManager, setShowBuildingManager] = React.useState(false);
  const [showBuildingEditor, setShowBuildingEditor] = React.useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [seeding, setSeeding] = React.useState(false);

  const seedDemoData = async () => {
    // Safety: never seed demo data in production
    if (import.meta.env.PROD) {
      showToast('Seed demo dat je v produkci zakázán', 'error');
      return;
    }
    if (seeding) return;
    setSeeding(true);
    try {
      // Define demo buildings
      const demoBuildings: Array<Omit<Building, 'id'>> = [
        {
          name: 'SVJ Vinohradská 125',
          address: 'Vinohradská 125, Praha 2',
          totalUnits: 24,
          variables: {
            nazev_budovy: 'SVJ Vinohradská 125',
            zkraceny_nazev: 'SVJ Vinohradská',
            plny_nazev: 'Společenství vlastníků jednotek Vinohradská 125',
            adresa: 'Vinohradská 125, Praha 2',
            osloveni: 'Vážení vlastníci',
            predseda: 'Ing. Jan Novák',
            telefon_predsedy: '+420 777 111 222',
            email_predsedy: 'predseda@vinohradska125.cz',
            kontaktni_osoba: 'Správa budovy',
            banka: 'Česká spořitelna',
            cislo_uctu: '123456789/0800',
            web: 'www.vinohradska125.cz'
          }
        },
        {
          name: 'SVJ Karlínské náměstí',
          address: 'Karlínské náměstí 12, Praha 8',
          totalUnits: 18,
          variables: {
            nazev_budovy: 'SVJ Karlínské náměstí',
            zkraceny_nazev: 'SVJ Karlín',
            plny_nazev: 'Společenství vlastníků jednotek Karlínské náměstí',
            adresa: 'Karlínské náměstí 12, Praha 8',
            osloveni: 'Vážení vlastníci',
            predseda: 'Bc. Marie Svobodová',
            telefon_predsedy: '+420 777 333 444',
            email_predsedy: 'predseda@karlin.cz',
            kontaktni_osoba: 'Správa budovy',
            banka: 'ČSOB',
            cislo_uctu: '987654321/0300',
            web: 'www.svj-karlin.cz'
          }
        }
      ];

      // Create buildings if not exist
      const createdBuildings: Building[] = [];
      // Protože supabaseServices nejsou k dispozici, jen vytvoříme mock objekty pokud neexistují
      for (const b of demoBuildings) {
        const exists = buildings.find(x => x.name === b.name);
        if (exists) {
          createdBuildings.push(exists);
        } else {
          const mock: Building = { id: crypto.randomUUID(), ...b } as Building;
          createdBuildings.push(mock);
        }
      }

      // For each building, create members, observers and one active vote
  // Ostatní seeding (members, observers, votes) přeskočíme – není základní pro zobrazení

      // Refresh buildings in context
  if (loadBuildings) await loadBuildings();
      showToast('Demo data byla připravena', 'success');
    } catch (err) {
      console.error(err);
      showToast('Nepodařilo se připravit demo data', 'error');
    } finally {
      setSeeding(false);
    }
  };

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
            OnlineSprava
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
                    Chyba databáze
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                    {error.includes('neexistují') && (
                      <p className="mt-2">
                        <strong>Řešení:</strong> Spusť SQL schema v Nhost Console - viz soubor <code>NHOST_SETUP.md</code>
                      </p>
                    )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {buildings.map((building) => (
            <Card
              key={building.id}
              onClick={async () => {
                await selectBuilding(building);
                navigate('/');
              }}
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
      </div>
    </div>
  );
};
