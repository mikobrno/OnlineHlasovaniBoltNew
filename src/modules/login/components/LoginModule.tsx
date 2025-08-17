// src/modules/login/components/LoginModule.tsx
import { FC } from 'react';
import { LoginForm } from './LoginForm';
import { useAuthContext } from '../context/AuthContext';

export const LoginModule: FC = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      <LoginForm />
    </div>
  );
};
