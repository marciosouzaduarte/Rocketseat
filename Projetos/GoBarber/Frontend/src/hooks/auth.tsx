import React, { createContext, useCallback, useState, useContext } from 'react';
import dotenv from 'dotenv';

import api from '../services/api';

dotenv.config();

interface AuthState {
  token: string;
  user: Record<string, unknown>;
}

interface SigInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: Record<string, unknown>;
  signIn(credentials: SigInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthState>(() => {
    const token = localStorage.getItem(`${process.env.LOCAL_STORAGE}:token`);
    const user = localStorage.getItem(`${process.env.LOCAL_STORAGE}:user`);

    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem(`${process.env.LOCAL_STORAGE}:token`, token);
    localStorage.setItem(
      `${process.env.LOCAL_STORAGE}:user`,
      JSON.stringify(user),
    );

    setAuthData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(`${process.env.LOCAL_STORAGE}:token`);
    localStorage.removeItem(`${process.env.LOCAL_STORAGE}:user`);
    setAuthData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: authData.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado com um AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
