import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this would be hashed
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login after registration
    const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return true;
  };

  const login = (email: string, password: string): boolean => {
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
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
