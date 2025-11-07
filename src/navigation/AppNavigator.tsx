// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { COLORS } from '../constants';
import MovieDetailScreen from '../screens/movie/MovieDetailScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MovieDetail: { movieId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="MovieDetail" 
              component={MovieDetailScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                title: 'Chi tiết phim',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}