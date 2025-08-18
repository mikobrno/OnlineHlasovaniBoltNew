import React from 'react';
import { Info } from 'lucide-react';

interface ReadOnlyAlertProps {
  message: string;
  description?: string;
}

export const ReadOnlyAlert: React.FC<ReadOnlyAlertProps> = ({ message, description }) => {
  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 border-blue-500">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
            {message}
          </h3>
          {description && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
