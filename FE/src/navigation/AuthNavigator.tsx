// src/navigation/AuthNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { COLORS, SCREEN_NAMES } from '../constants';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      id={undefined} // PHẢI LÀ undefined
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
      <Stack.Screen 
        name={SCREEN_NAMES.REGISTER} 
        component={RegisterScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.text,
          headerTitle: 'Đăng ký',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack.Navigator>
  );
}