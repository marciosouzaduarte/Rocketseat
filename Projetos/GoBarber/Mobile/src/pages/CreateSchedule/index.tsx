import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  BackButton,
  Calendar,
  CalendarTitle,
  Container,
  Content,
  CreateScheduleButton,
  CreateScheduleButtonText,
  Header,
  HeaderTitle,
  Hour,
  HourText,
  OpenDatePickerButton,
  OpenDatePickerText,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
  ProvidersList,
  ProvidersListContainer,
  Schedule,
  Section,
  SectionContent,
  SectionTitle,
  UserAvatar,
} from './styles';

interface IRouteParams {
  providerID: string;
}

export interface IProviders {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateSchedule: React.FC = () => {
  const { user, signOut } = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { providerID } = route.params as IRouteParams;

  const [providers, setProviders] = useState<IProviders[]>([]);
  const [selectedProviders, setSelectedProviders] = useState(providerID);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [selectedData, setSelectedData] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [daysAvailables, setDaysAvailables] = useState<AvailabilityItem[]>([]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  useEffect(() => {
    const buscarDados = async () => {
      const response = await api.get('/providers');
      setProviders(response.data);
    };

    buscarDados();
  }, []);

  useEffect(() => {
    const buscarDados = async () => {
      const response = await api.get(
        `/providers/${selectedProviders}/day-availability`,
        {
          params: {
            year: selectedData.getFullYear(),
            month: selectedData.getMonth() + 1,
            day: selectedData.getDate(),
          },
        },
      );
      setDaysAvailables(response.data);
    };

    buscarDados();
  }, [selectedData, selectedProviders]);

  const handlSelectProvider = useCallback((id: string) => {
    setSelectedProviders(id);
  }, []);

  const handleOpen = useCallback(() => {
    setShowDatepicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatepicker(false);
    }

    if (date) {
      setSelectedData(date);
    }
  }, []);

  const moorningAvailability = useMemo(() => {
    return daysAvailables
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          hourFomataed: format(new Date().setHours(hour), 'HH:00'),
          available,
        };
      });
  }, [daysAvailables]);

  const afternoonAvailability = useMemo(() => {
    return daysAvailables
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          hourFomataed: format(new Date().setHours(hour), 'HH:00'),
          available,
        };
      });
  }, [daysAvailables]);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateSchedule = useCallback(async () => {
    try {
      const date = new Date(selectedData);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/schedules', {
        provider_id: selectedProviders,
        date,
      });

      navigate('ScheduleCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar criar o agendamento');
    }
  }, [selectedProviders, selectedData, selectedHour, navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProviders}
                onPress={() => handlSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProviders}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <CalendarTitle>Escolha um dia:</CalendarTitle>
          <OpenDatePickerButton onPress={handleOpen}>
            <OpenDatePickerText>Selecionar outra Data</OpenDatePickerText>
          </OpenDatePickerButton>
          {showDatepicker && (
            <DateTimePicker
              value={selectedData}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <CalendarTitle>Escolha um horário:</CalendarTitle>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {moorningAvailability.map(({ hourFomataed, available, hour }) => (
                <Hour
                  enabled={available}
                  available={available}
                  selected={available && selectedHour === hour}
                  key={hourFomataed}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={available && selectedHour === hour}>
                    {hourFomataed}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFomataed, available, hour }) => (
                  <Hour
                    enabled={available}
                    available={available}
                    selected={available && selectedHour === hour}
                    key={hourFomataed}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={available && selectedHour === hour}>
                      {hourFomataed}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateScheduleButton onPress={handleCreateSchedule}>
          <CreateScheduleButtonText>Agendar</CreateScheduleButtonText>
        </CreateScheduleButton>
      </Content>
    </Container>
  );
};

export default CreateSchedule;
