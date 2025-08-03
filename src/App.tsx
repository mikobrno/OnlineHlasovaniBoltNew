import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './contexts/AppContextCompat';
import { BuildingSelector } from './components/BuildingSelector';
import { MainApp } from './components/MainApp';
import { VotingPage } from './components/voting/VotingPage';

function App() {
  const { selectedBuilding } = useApp();

  return (
    <Routes>
      <Route path="/vote/:token" element={<VotingPage />} />
      <Route path="/*" element={
        !selectedBuilding ? <BuildingSelector /> : <MainApp />
      } />
    </Routes>
  );
}

export default App;
