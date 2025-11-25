// App.tsx - FILE CHÍNH
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { MovieProvider } from './src/context/MovieContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </MovieProvider>
    </AuthProvider>
  );
}