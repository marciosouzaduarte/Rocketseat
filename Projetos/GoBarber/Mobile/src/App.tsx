import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import AppProvider from './hooks';
import Routes from './routes';
import { View } from './styles/GlobalStyle';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />

    <AppProvider>
      <View>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;
