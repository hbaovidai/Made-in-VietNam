import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, SupplierStatus } from '../lib/enums';

// Struct khớp với model ở Backend
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  supplier?: {
    id: string;
    companyName: string;
    slug: string;
    status: SupplierStatus;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (userData: User, token: string) => void;
  updateUser: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('mivn5_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('mivn5_token');
  });

  // Ensure hydration matches
  useEffect(() => {
    const storedUser = localStorage.getItem('mivn5_user');
    const storedToken = localStorage.getItem('mivn5_token');
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        if (!user || user.id !== parsed.id) {
          setUser(parsed);
          setToken(storedToken);
        }
      } catch (err) {
        localStorage.removeItem('mivn5_user');
        localStorage.removeItem('mivn5_token');
      }
    }
  }, []);

  const loginUser = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('mivn5_user', JSON.stringify(userData));
    localStorage.setItem('mivn5_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mivn5_user');
    localStorage.removeItem('mivn5_token');
    window.location.href = '/';
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('mivn5_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user && !!token, loginUser, updateUser, logout }}>
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
