import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Building2, Users, Vote, Mail, Lock } from 'lucide-react';

export const LoginMock = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    
    // Simulujeme přihlášení
    setTimeout(() => {
      if (email === 'admin@onlinesprava.cz' && password === 'admin') {
        setIsSuccess(true);
      } else {
        setIsError(true);
      }
      setIsLoading(false);
    }, 1000);
  };

  // Pokud je přihlášení úspěšné, přesměrujeme uživatele na hlavní stránku
  if (isSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-12 h-12 border border-white/20 rounded-full"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Logo */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Vote className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Online Hlasování
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                Moderní správa SVJ a družstev
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Přihlášení
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Zadejte své přihlašovací údaje pro vstup do systému
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@onlinesprava.cz"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 pl-4 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-0 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Heslo
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 pl-4 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-0 transition-colors"
                />
              </div>
              
              {isError && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Chyba přihlášení</AlertTitle>
                  <AlertDescription>
                    Nesprávný email nebo heslo. (Zkuste: admin@onlinesprava.cz / admin)
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Přihlašuji se...</span>
                  </div>
                ) : (
                  'Přihlásit se'
                )}
              </Button>
            </form>
            
            {/* Test credentials */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                <strong>Demo přihlášení:</strong><br />
                Email: admin@onlinesprava.cz<br />
                Heslo: admin
              </p>
            </div>
            
            {/* Features Preview */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Funkce systému:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                    Správa SVJ
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Vote className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-green-900 dark:text-green-300">
                    Hlasování
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-purple-900 dark:text-purple-300">
                    Členové
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-white/80 mt-6">
          © 2025 Online Hlasování • Všechna práva vyhrazena
        </p>
      </div>
    </div>
  );
};
