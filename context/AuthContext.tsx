
import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin } from '../services/userService';
import { initializeDb } from '../services/mockDb';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeDb();
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (phone: string, password: string): Promise<User | null> => {
    const loggedInUser = await apiLogin(phone, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    }
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const isAdmin = useMemo(() => user?.role === 'Admin', [user]);
  const isEmployee = useMemo(() => user?.role === 'Admin' || user?.role === 'Employee', [user]);
  
  const value = { user, login, logout, isAdmin, isEmployee };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};