import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'ADMIN' | 'BASIC' | null;

interface AuthState {
  role: Role;
  email?: string | null;
}

interface AuthContextValue {
  state: AuthState;
  login: (email: string, role: Role) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const STORAGE_KEY = 'mockAuth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ role: null, email: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persist = (s: AuthState) => {
    setState(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {}
  };

  const login = (email: string, role: Role) => persist({ email, role });

  const logout = () => {
    setState({ role: null, email: null });
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  const isAdmin = () => state.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ state, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthProvider;
