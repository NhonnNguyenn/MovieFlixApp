// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import MovieDetailScreen from '../screens/movie/MovieDetailScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MovieDetail: { movieId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('🧭 AppNavigator - Loading:', loading);
  console.log('🧭 AppNavigator - isAuthenticated:', isAuthenticated);
  console.log('🧭 AppNavigator - User:', user ? user.username : 'No user');

  if (loading) {
    console.log('⏳ AppNavigator - Showing loading state');
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: COLORS.background 
      }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ 
          color: COLORS.text, 
          marginTop: 16,
          fontSize: 16 
        }}>
          Đang tải...
        </Text>
      </View>
    );
  }

  console.log('🎯 AppNavigator - Rendering navigation stack');

  return (
    <NavigationContainer>
      <Stack.Navigator 
        id={undefined} // PHẢI LÀ undefined
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
          headerBackTitle: 'Quay lại',
          headerTintColor: COLORS.text,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
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
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                title: 'Chi tiết phim',
                headerBackTitle: 'Quay lại',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}