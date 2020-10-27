import AsyncStorage from '@react-native-community/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../services/api';

interface IUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: IUser;
}

interface SigInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: IUser;
  loading: boolean;
  signIn(credentials: SigInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const [token, user] = await AsyncStorage.multiGet([
        `@GoBarberMobile:token`,
        `@GoBarberMobile:user`,
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setAuthData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    };

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      [`@GoBarberMobile:token`, token],
      [`@GoBarberMobile:user`, JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      `@GoBarberMobile:token`,
      `@GoBarberMobile:user`,
    ]);
    setAuthData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: IUser) => {
      await AsyncStorage.setItem(`@GoBarberMobile:user`, JSON.stringify(user));

      setAuthData({
        token: authData.token,
        user,
      });
    },
    [authData],
  );

  return (
    <AuthContext.Provider
      value={{ user: authData.user, signIn, signOut, updateUser, loading }}
    >
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
