import React from 'react';

interface FullPageSpinnerProps {
  message?: string;
}

export const FullPageSpinner: React.FC<FullPageSpinnerProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50 p-4 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
      {message && <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm whitespace-pre-line">{message}</p>}
    </div>
  );
};

export default FullPageSpinner;
