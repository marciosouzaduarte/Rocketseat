import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';
import Breakline from '../../components/Breakline';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  Container,
  Header,
  HeaderTitle,
  ProfileButton,
  ProviderList,
  UserAvatar,
  UserName,
} from './styles';

export interface IProviders {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<IProviders[]>([]);
  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    const buscarDados = async () => {
      const response = await api.get('/providers');
      setProviders(response.data);
    };

    buscarDados();
  }, []);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo,
          <Breakline />
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>

      <ProviderList
        data={providers}
        keyExtractor={provider => provider.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </Container>
  );
};

export default Dashboard;
