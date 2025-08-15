import { useState } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-xs">
        <Card className="w-full border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center tracking-tight text-white">
              Online Hlasování
            </CardTitle>
            <CardDescription className="text-center text-slate-400 text-xs">
              Přihlášení
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800/60 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Heslo"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800/60 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              {isError && error && (
                <Alert variant="destructive" className="border-red-700 bg-red-900/30 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message === 'invalid-email-password'
                      ? 'Nesprávný email nebo heslo.'
                      : 'Chyba přihlášení. Zkuste znovu.'}
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full h-9 text-sm font-medium bg-indigo-600 hover:bg-indigo-500" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/70 border-t-transparent" />
                    <span>Přihlašuji…</span>
                  </div>
                ) : (
                  'Přihlásit'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
