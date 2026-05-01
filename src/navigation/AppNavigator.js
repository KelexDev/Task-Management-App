import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import AddEditTask from '../screens/AddEditTask';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Agenda' }}
        />
        <Stack.Screen
          name="AddEditTask"
          component={AddEditTask}
          options={{ title: 'Nueva Tarea' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
