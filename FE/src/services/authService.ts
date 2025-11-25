// src/services/authService.ts
import { User, AuthResponse } from '../types';
import { STORAGE_KEYS, COLORS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  async login(email: string, password: string): Promise<User> {
    // Mock authentication - sẽ thay bằng API thật sau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    const mockToken = `mock_jwt_${Math.random().toString(36).substr(2, 9)}`;
    
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
    
    return mockUser;
  }

  async register(email: string, password: string, username: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!email || !password || !username) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      createdAt: new Date().toISOString(),
    };

    const mockToken = `mock_jwt_${Math.random().toString(36).substr(2, 9)}`;
    
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
    
    return mockUser;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();