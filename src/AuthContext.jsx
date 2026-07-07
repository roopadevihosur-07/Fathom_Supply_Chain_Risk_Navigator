import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fathomUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const validUsers = {
      'admin@fathom.com': { email: 'admin@fathom.com', password: 'admin123', role: 'admin', name: 'Admin' },
      'manager@fathom.com': { email: 'manager@fathom.com', password: 'manager123', role: 'manager', name: 'Manager' },
      'user@fathom.com': { email: 'user@fathom.com', password: 'user123', role: 'user', name: 'User' },
    };

    const foundUser = validUsers[email];
    if (foundUser && foundUser.password === password) {
      const userData = { email: foundUser.email, role: foundUser.role, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('fathomUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fathomUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
