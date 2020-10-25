import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreateSchedule from '../pages/CreateSchedule';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import ScheduleCreated from '../pages/ScheduleCreated';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerStatusBarHeight: -35,
      headerTitle: '',
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateSchedule" component={CreateSchedule} />
    <App.Screen name="ScheduleCreated" component={ScheduleCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
