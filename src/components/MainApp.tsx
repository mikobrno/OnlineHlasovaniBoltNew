import React, { useState } from 'react';
import { AppNavigation } from './AppNavigation';
import { VotesListView } from './voting/VotesListView';
import { MembersView } from './members/MembersView';
import { EmailTestView } from './email/EmailTestView';
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
        return <EmailTestView />;
      case 'admin':
        return <AdminView />;
      default:
        return <VotesListView />;
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
