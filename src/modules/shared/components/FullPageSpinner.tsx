import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size])} />
  );
}

interface FullPageSpinnerProps {
  message?: string;
}

export function FullPageSpinner({ message = 'Načítám...' }: FullPageSpinnerProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spinner size="lg" />
      {message && (
        <div className="mt-4 text-gray-600 dark:text-gray-400">{message}</div>
      )}
    </div>
  );
}
