// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../contexts/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Lock, Shield, Mail, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@onlinesprava.cz');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      if (result?.error) {
        throw result.error;
      }
      showToast('Přihlášení úspěšné!', 'success');
    } catch (error: any) {
      const errorMessage = error.message || 'Přihlášení se nezdařilo';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-2xl">
        <CardHeader className="space-y-2 pb-6 pt-8">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-2xl mx-auto mb-4 border border-white/20">
            <Shield className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Online Hlasování SVJ
          </CardTitle>
          <CardDescription className="text-center text-indigo-100/70 text-base">
            Zadejte své přihlašovací údaje
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mailová adresa
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@onlinesprava.cz"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 bg-white/10 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder:text-indigo-200/50 rounded-xl text-base transition-all duration-200"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Heslo
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 bg-white/10 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder:text-indigo-200/50 rounded-xl text-base pr-12 transition-all duration-200"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-300/60 hover:text-indigo-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border border-red-400/30 bg-red-500/10 backdrop-blur-sm rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 border-0 shadow-xl shadow-blue-900/50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/70 border-t-transparent" />
                  <span>Přihlašuji se...</span>
                </div>
              ) : (
                'Přihlásit se'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-indigo-200/80 text-center font-medium mb-2">
              Testovací účty:
            </p>
            <div className="text-xs text-indigo-200/60 text-center space-y-1">
              <div><strong>Admin:</strong> admin@onlinesprava.cz / admin123</div>
              <div><strong>Správce:</strong> spravce@budova1.cz / spravce123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};