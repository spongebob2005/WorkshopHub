import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (name: string, email: string, password: string): boolean => {
    // Get existing users
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    // Create new user (role user)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this would be hashed
      role: 'user' as const,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after registration
    const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return true;
  };

  const login = (email: string, password: string): boolean => {
    // Admin static credentials
    if (email.toLowerCase() === 'admin@workshophub.com' && password === 'admin123') {
      const adminUser = { id: 'admin-1', name: 'Admin', email: 'admin@workshophub.com', role: 'admin' as const };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || 'user',
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
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
