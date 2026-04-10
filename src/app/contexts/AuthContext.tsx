import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'admin' | 'student') => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize default admin user if not exists
    const initializeAdmin = async () => {
      try {
        const users = await api.get('/users');
        const adminExists = users.some((u: any) => u.role === 'admin');
        
        if (!adminExists) {
          const defaultAdmin = {
            id: 'admin-1',
            name: 'Admin User',
            email: 'admin@workshophub.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
          };
          await api.post('/users', defaultAdmin);
          console.log('✅ Default admin user created');
        }
      } catch (error) {
        console.error('Error initializing admin user:', error);
      }
    };
    
    initializeAdmin();
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users: any[] = await api.get('/users');
      
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'student' as const,
      };

      await api.post('/users', newUser);

      const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const login = async (email: string, password: string, role: 'admin' | 'student' = 'student'): Promise<boolean> => {
    try {
      const users: any[] = await api.get('/users');
      
      const foundUser = users.find((u: any) => 
        u.email === email && 
        u.password === password &&
        (u.role || 'student') === role
      );

      if (foundUser) {
        const userWithoutPassword = { 
          id: foundUser.id, 
          name: foundUser.name, 
          email: foundUser.email,
          role: foundUser.role || 'student'
        };
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
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