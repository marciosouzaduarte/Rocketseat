import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Breakline from '../../components/Breakline';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  Container,
  Header,
  HeaderTitle,
  ProfileButton,
  ProviderAvatar,
  ProviderContainer,
  ProviderInfo,
  ProviderList,
  ProviderMeta,
  ProviderMetaText,
  ProviderName,
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
        renderItem={({ item: provider }) => (
          <ProviderContainer onPress={() => {}}>
            <ProviderAvatar src={{ uri: provider.avatar_url }} />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à Sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
