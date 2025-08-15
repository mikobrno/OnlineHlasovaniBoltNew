import { useState } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signInEmailPassword, isLoading, isSuccess, isError, error } = useSignInEmailPassword();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInEmailPassword(email, password);
  };

  // Pokud je přihlášení úspěšné, přesměrujeme uživatele na hlavní stránku
  if (isSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-950 to-violet-950 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Logo a název aplikace */}
      <div className="absolute top-8 md:top-12 w-full flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-3">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Online Hlasování</h1>
        <p className="text-indigo-200/70 text-sm mt-1">Systém pro elektronické hlasování SVJ</p>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="w-full border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center tracking-tight text-white">
              Přihlášení
            </CardTitle>
            <CardDescription className="text-center text-indigo-100/60">
              Přihlaste se pomocí přihlašovacích údajů
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-indigo-100">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas@email.cz"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/10 border-indigo-300/20 focus:border-indigo-400 focus:ring-indigo-400 text-white placeholder:text-indigo-200/40"
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-indigo-100">
                    Heslo
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/10 border-indigo-300/20 focus:border-indigo-400 focus:ring-indigo-400 text-white placeholder:text-indigo-200/40"
                  autoComplete="current-password"
                />
              </div>
              
              {isError && error && (
                <Alert variant="destructive" className="border border-red-500/30 bg-red-900/30 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message === 'invalid-email-password'
                      ? 'Nesprávný email nebo heslo.'
                      : 'Chyba přihlášení. Zkuste znovu.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-10 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-900/30" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/70 border-t-transparent" />
                    <span>Přihlašuji…</span>
                  </div>
                ) : (
                  'Přihlásit se'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-indigo-200/60">
                © 2025 Online Hlasování | Všechna práva vyhrazena
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
