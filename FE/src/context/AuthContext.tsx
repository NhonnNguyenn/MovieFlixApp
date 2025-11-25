// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { backendAPI } from '../services/backendAPI';

interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    console.log('🔄 AuthProvider mounted, checking stored auth...');
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      console.log('🔍 Stored token found:', !!storedToken);
      
      if (storedToken) {
        console.log('📋 Calling getProfile with stored token...');
        const response = await backendAPI.getProfile(storedToken);
        
        if (response.success && response.data) {
          console.log('✅ Profile loaded successfully:', response.data.username);
          setUser({ 
            ...response.data, 
            token: storedToken 
          });
        } else {
          console.log('❌ Profile load failed:', response.message);
          await AsyncStorage.removeItem('userToken');
        }
      } else {
        console.log('🔍 No stored token found');
      }
    } catch (error) {
      console.error('🚨 Auth check error:', error);
      await AsyncStorage.removeItem('userToken');
    } finally {
      setLoading(false);
      console.log('🏁 Auth check completed, authenticated:', isAuthenticated);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Starting login for:', email);
      const response = await backendAPI.login(email, password);

      if (response.success && response.data) {
        console.log('✅ Login successful, user:', response.data.username);
        
        // Lưu token
        await AsyncStorage.setItem('userToken', response.data.token);
        console.log('💾 Token saved to storage');
        
        // Cập nhật state user
        setUser(response.data);
        console.log('👤 User state updated');
      } else {
        console.log('❌ Login failed:', response.message);
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      console.log('🚨 Login process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      console.log('📝 Starting registration for:', email);
      const response = await backendAPI.register(email, password, username);

      if (response.success && response.data) {
        console.log('✅ Registration successful, user:', response.data.username);
        
        await AsyncStorage.setItem('userToken', response.data.token);
        setUser(response.data);
      } else {
        console.log('❌ Registration failed:', response.message);
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      console.log('🚨 Registration process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out user:', user?.username);
    setUser(null);
    await AsyncStorage.removeItem('userToken');
    console.log('✅ Logout completed');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};