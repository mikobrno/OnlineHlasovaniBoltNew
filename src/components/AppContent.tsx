import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../contexts/AppContextCompat';
import { AppHeader } from './AppHeader';
import { BuildingSelector } from './BuildingSelector';
import { MainApp } from './MainApp';
import { VotingPage } from './voting/VotingPage';

export const AppContent: React.FC = () => {
  const { selectedBuilding } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <Routes>
        <Route path="/vote/:token" element={<VotingPage />} />
        <Route path="/*" element={
          !selectedBuilding ? <BuildingSelector /> : <MainApp />
        } />
      </Routes>
    </div>
  );
};
