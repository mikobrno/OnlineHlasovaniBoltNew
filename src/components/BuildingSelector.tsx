import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, MapPin, Users, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContextCompat';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { BuildingManager } from './admin/BuildingManager';
import { BuildingEditor } from './admin/BuildingEditor';
import { useToast } from '../contexts/ToastContext';
import { buildingService, memberService, observerService, voteService } from '../lib/supabaseServices';
import type { Building, Member, Observer, Vote } from '../data/mockData';

export const BuildingSelector: React.FC = () => {
  const { buildings, selectBuilding, loadBuildings } = useApp();
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
      for (const b of demoBuildings) {
        const exists = buildings.find(x => x.name === b.name);
        if (exists) {
          createdBuildings.push(exists);
          continue;
        }
        const nb = await buildingService.create(b);
        createdBuildings.push(nb);
      }

      // For each building, create members, observers and one active vote
      for (const b of createdBuildings) {
        // Members
        const existingMembers = await memberService.getByBuildingId(b.id);
        if (existingMembers.length < 5) {
        const basePhone = b.name.includes('Vinohradská') ? '+4206010000' : '+4206020000';
        const members: Array<Omit<Member, 'id'>> = [
          { name: 'Jan Novák', email: 'jan.novak+demo@example.com', phone: basePhone + '01', unit: '1.01', voteWeight: 1.0, buildingId: b.id },
          { name: 'Marie Svobodová', email: 'marie.svobodova+demo@example.com', phone: basePhone + '02', unit: '1.02', voteWeight: 1.2, buildingId: b.id },
          { name: 'Petr Dvořák', email: 'petr.dvorak+demo@example.com', phone: basePhone + '03', unit: '2.01', voteWeight: 0.8, buildingId: b.id },
          { name: 'Lucie Procházková', email: 'lucie.prochazkova+demo@example.com', phone: basePhone + '04', unit: '2.02', voteWeight: 1.0, buildingId: b.id },
          { name: 'Karel Černý', email: 'karel.cerny+demo@example.com', phone: basePhone + '05', unit: '3.01', voteWeight: 1.5, buildingId: b.id },
          { name: 'Eva Králová', email: 'eva.kralova+demo@example.com', phone: basePhone + '06', unit: '3.02', voteWeight: 1.1, buildingId: b.id },
          { name: 'Tomáš Pokorný', email: 'tomas.pokorny+demo@example.com', phone: basePhone + '07', unit: '4.01', voteWeight: 0.9, buildingId: b.id },
          { name: 'Alena Jelínková', email: 'alena.jelinkova+demo@example.com', phone: basePhone + '08', unit: '4.02', voteWeight: 1.3, buildingId: b.id },
          { name: 'Milan Beneš', email: 'milan.benes+demo@example.com', phone: basePhone + '09', unit: '5.01', voteWeight: 1.0, buildingId: b.id },
          { name: 'Hana Fialová', email: 'hana.fialova+demo@example.com', phone: basePhone + '10', unit: '5.02', voteWeight: 1.0, buildingId: b.id }
        ];
        await memberService.importMembers(members);
        }

        const existingObservers = await observerService.getByBuildingId(b.id);
        if (existingObservers.length === 0) {
          const observers: Array<Omit<Observer, 'id'>> = [
            { name: 'Ing. Pavel Správce', email: 'spravce+' + (b.id.slice(0, 4)) + '@onlinesprava.cz', buildingId: b.id, createdAt: new Date().toISOString() },
            { name: 'Bc. Jana Kontrolorka', email: 'kontrolor+' + (b.id.slice(0, 4)) + '@onlinesprava.cz', buildingId: b.id, createdAt: new Date().toISOString() }
          ];
          for (const o of observers) {
            await observerService.create(o);
          }
        }

        const existingVotes = await voteService.getByBuildingId(b.id);
        const hasActive = existingVotes.some(v => v.status === 'active');
        if (!hasActive) {
          const now = new Date();
          const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const vote: Omit<Vote, 'id'> = {
            title: 'Schválení ročního rozpočtu',
            description: 'Hlasování per rollam o rozpočtu a příspěvcích do fondů.',
            buildingId: b.id,
            status: 'active',
            questions: [
              { id: 'q1', text: 'Schvalujete navržený rozpočet?', quorumType: 'qualified' },
              { id: 'q2', text: 'Souhlasíte se zvýšením příspěvků o 5%?', quorumType: 'simple' }
            ],
            createdAt: now.toISOString(),
            startDate: now.toISOString(),
            endDate: in7.toISOString(),
            attachments: [],
            memberVotes: {},
            observers: []
          };
          await voteService.create(vote);
        }
      }

      // Refresh buildings in context
      await loadBuildings();
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
