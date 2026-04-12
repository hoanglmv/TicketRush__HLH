import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    // State is already initialized from localStorage, but we can keep this or sync tabs
  }, []);

  const login = (data: AuthResponse) => {
    setUser(data);
    setToken(data.accessToken);
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAdmin: user?.role === 'ROLE_ADMIN',
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
