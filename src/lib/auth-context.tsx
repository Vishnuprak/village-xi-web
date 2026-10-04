'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

export interface UserProfile {
  id: string;
  phone: string;
  name?: string;
  avatarUrl?: string;
  roles: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string; user: UserProfile }) => void;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('village_xi_access_token');
    const storedUser = localStorage.getItem('village_xi_user');

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data: { accessToken: string; refreshToken: string; user: UserProfile }) => {
    localStorage.setItem('village_xi_access_token', data.accessToken);
    localStorage.setItem('village_xi_refresh_token', data.refreshToken);
    localStorage.setItem('village_xi_user', JSON.stringify(data.user));

    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await api.post('/auth/logout');
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('village_xi_access_token');
      localStorage.removeItem('village_xi_refresh_token');
      localStorage.removeItem('village_xi_user');
      setAccessToken(null);
      setUser(null);
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.roles.includes(role) || user.roles.includes('SUPER_ADMIN');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
