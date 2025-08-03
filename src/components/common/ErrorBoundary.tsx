import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  error: string;
  onRetry?: () => void;
  onReset?: () => void;
}

export function ErrorBoundary({ error, onRetry, onReset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Došlo k chybě
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error || 'Něco se pokazilo. Zkuste to prosím znovu.'}
        </p>
        
        <div className="flex flex-col gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="w-full"
              variant="primary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Zkusit znovu
            </Button>
          )}
          
          {onReset && (
            <Button 
              onClick={onReset}
              className="w-full"
              variant="outline"
            >
              Resetovat aplikaci
            </Button>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Pokud problém přetrvává, kontaktujte podporu.</p>
        </div>
      </div>
    </div>
  );
}
