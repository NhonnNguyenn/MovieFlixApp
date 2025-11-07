// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <LinearGradient
      colors={[COLORS.secondary, COLORS.background]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>👤 Hồ sơ</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tên người dùng:</Text>
          <Text style={styles.value}>{user?.username}</Text>
          
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Đăng xuất" 
            onPress={logout} 
            color={COLORS.primary}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    width: 200,
    alignSelf: 'center',
  },
});