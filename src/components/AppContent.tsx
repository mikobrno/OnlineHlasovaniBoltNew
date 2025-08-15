import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { AppHeader } from './AppHeader';
import { BuildingSelector } from './BuildingSelector';
import { MainApp } from './MainApp';
import { VotingPage } from './voting/VotingPage';

export const AppContent: React.FC = () => {
  const { state } = useApp();
  const { selectedBuilding } = state;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <Routes>
        <Route path="/vote/:token" element={<VotingPage />} />
  <Route path="/select-building" element={<BuildingSelector />} />
        <Route path="/*" element={
          !selectedBuilding ? <BuildingSelector /> : <MainApp />
        } />
      </Routes>
    </div>
  );
};
