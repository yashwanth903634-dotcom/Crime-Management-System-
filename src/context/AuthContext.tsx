import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  username: string;
  full_name: string;
  role: 'admin' | 'police_officer';
  badge_number?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('crms_token');
    const storedUser = localStorage.getItem('crms_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Verify token is still valid
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('crms_user', JSON.stringify(res.data));
        })
        .catch(() => {
          // Token expired
          localStorage.removeItem('crms_token');
          localStorage.removeItem('crms_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token: newToken, user: newUser } = response.data;
    
    localStorage.setItem('crms_token', newToken);
    localStorage.setItem('crms_user', JSON.stringify(newUser));
    
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('crms_token');
    localStorage.removeItem('crms_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
