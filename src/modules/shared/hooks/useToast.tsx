import { ReactNode, createContext, useContext } from 'react';

interface ToastData {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (data: ToastData) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const showToast = (data: ToastData) => {
    // Implementace zobrazení toastu...
    console.log('Toast:', data);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}
