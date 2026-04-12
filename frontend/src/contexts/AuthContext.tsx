import React, { createContext, useContext, useState, useEffect } from 'react';

// Struct khớp với model ở Backend
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'BUYER' | 'SUPPLIER';
  phone?: string | null;
  avatar?: string | null;
  supplier?: {
    id: string;
    companyName: string;
    slug: string;
    isVerified: boolean;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginUser: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Eagerly load from localStorage so it's available on first render
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

  // Ensure hydration matches or any updates are tracked
  useEffect(() => {
    const storedUser = localStorage.getItem('mivn5_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Only update if it's different to prevent infinite re-renders
        if (!user || user.id !== parsed.id) {
          setUser(parsed);
        }
      } catch (err) {
        localStorage.removeItem('mivn5_user');
      }
    }
  }, []);

  const loginUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('mivn5_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mivn5_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginUser, logout }}>
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
