import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  Container,
  Description,
  OkButton,
  OkButtonText,
  Title,
} from './styles';

interface IRouteParams {
  date: number;
}

const ScheduleCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();
  const routeParams = params as IRouteParams;

  const handleOkButton = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const formatedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      { locale: ptBR },
    );
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>{formatedDate}</Description>

      <OkButton onPress={handleOkButton}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default ScheduleCreated;
