import React, { useState } from 'react';
import { AppNavigation } from './AppNavigation';
import { VotesListView } from './voting/VotesListView';
import { MembersView } from './members/MembersView';
import { SimpleGeneratorView } from './email/SimpleGeneratorView';
import { AdminView } from './admin/AdminView';
import type { Building } from '../graphql/buildings';

interface MainAppProps {
  selectedBuilding: Building;
}

export const MainApp: React.FC<MainAppProps> = ({ selectedBuilding }) => {
  const [activeTab, setActiveTab] = useState('votes');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'votes':
        return <VotesListView buildingId={selectedBuilding.id} />;
      case 'members':
        return <MembersView buildingId={selectedBuilding.id} />;
      case 'emails':
        return <SimpleGeneratorView buildingId={selectedBuilding.id} />;
      case 'admin':
        return <AdminView buildingId={selectedBuilding.id} />;
      default:
        return <VotesListView buildingId={selectedBuilding.id} />;
    }
  };

  return (
    <div>
      <AppNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>
    </div>
  );
};
