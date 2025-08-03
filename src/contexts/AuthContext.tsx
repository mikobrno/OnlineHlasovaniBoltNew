import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Testovací účty - v produkci by byly v databázi
  const testAccounts = [
    { email: 'admin@onlinesprava.cz', password: 'admin123', role: 'admin' as const },
    { email: 'spravce@budova1.cz', password: 'spravce123', role: 'manager' as const },
    { email: 'test@test.cz', password: 'test123', role: 'user' as const }
  ];

  useEffect(() => {
    // Zkusíme načíst uloženého uživatele
    const savedUser = localStorage.getItem('voting_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Chyba při načítání uživatele:', error);
        localStorage.removeItem('voting_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Najdeme účet v testovacích účtech
      const account = testAccounts.find(acc => 
        acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (account) {
        const user: User = {
          id: `user_${Date.now()}`,
          email: account.email,
          role: account.role
        };
        
        setUser(user);
        localStorage.setItem('voting_user', JSON.stringify(user));
        setIsLoading(false);
        return true;
      }

      // V budoucnu zde může být autentizace přes Supabase Auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password
      // });

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Chyba při přihlášení:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voting_user');
    
    // V budoucnu zde může být odhlášení z Supabase
    // supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
