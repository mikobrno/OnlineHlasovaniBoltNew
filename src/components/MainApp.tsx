import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { AppNavigation } from './AppNavigation';
import { VotesListView } from './voting/VotesListView';
import { MembersView } from './members/MembersView';
import { SimpleGeneratorView } from './email/SimpleGeneratorView';
import { AdminView } from './admin/AdminView';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('votes');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'votes':
        return <VotesListView />;
      case 'members':
        return <MembersView />;
      case 'emails':
        return <SimpleGeneratorView />;
      case 'admin':
        return <AdminView />;
      default:
        return <VotesListView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <AppNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>
    </div>
  );
};
