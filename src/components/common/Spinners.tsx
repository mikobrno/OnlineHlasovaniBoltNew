import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  );
};

export const FullPageSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
