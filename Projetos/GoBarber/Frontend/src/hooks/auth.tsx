import React, { createContext, useCallback, useState, useContext } from 'react';
import dotenv from 'dotenv';

import api from '../services/api';

dotenv.config();

interface User {
  avatar_url: string;
  email: string;
  id: string;
  name: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SigInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SigInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthState>(() => {
    const token = localStorage.getItem(`${process.env.LOCAL_STORAGE}:token`);
    const user = localStorage.getItem(`${process.env.LOCAL_STORAGE}:user`);

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

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

    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(`${process.env.LOCAL_STORAGE}:token`);
    localStorage.removeItem(`${process.env.LOCAL_STORAGE}:user`);
    setAuthData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem(
        `${process.env.LOCAL_STORAGE}:user`,
        JSON.stringify(user),
      );

      setAuthData({
        token: authData.token,
        user,
      });
    },
    [authData],
  );

  return (
    <AuthContext.Provider
      value={{ user: authData.user, signIn, signOut, updateUser }}>
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
