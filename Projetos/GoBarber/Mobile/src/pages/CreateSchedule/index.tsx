import React from 'react';
import { Button, View } from 'react-native';
import { useAuth } from '../../hooks/auth';

const CreateSchedule: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
};

export default CreateSchedule;
