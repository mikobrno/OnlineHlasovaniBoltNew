import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { BuildingSelector } from './BuildingSelector';
import { MainApp } from './MainApp';
import { VotingPage } from './voting/VotingPage';

export const AppContent: React.FC = () => {
  const { selectedBuilding } = useApp();

  return (
    <Routes>
      <Route path="/vote/:token" element={<VotingPage />} />
      <Route path="/*" element={
        !selectedBuilding ? <BuildingSelector /> : <MainApp />
      } />
    </Routes>
  );
};
