import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import * as api from '../services/api';
import { getStoredToken } from '../services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    api
      .getMe()
      .then((u) => {
        setUser(u);
        setToken(storedToken);
      })
      .catch((err: { status?: number }) => {
        // Only drop the session when the server says the token is invalid
        if (err?.status === 401 || err?.status === 404) api.logout();
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.register(name, email, password);
    setUser(res.user);
    setToken(res.token);
  }

  function logout() {
    api.logout();
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
