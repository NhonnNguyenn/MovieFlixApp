// src/screens/auth/LoginScreen.tsx - CẬP NHẬT
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SIZES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={COLORS.gradientDark}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="film" size={48} color={COLORS.primary} />
                <Text style={styles.logoText}>MovieFlix</Text>
              </View>
              <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
              <Text style={styles.subtitle}>Đăng nhập để tiếp tục trải nghiệm</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
            <Input
  label="Email"
  placeholder="Nhập email của bạn"
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
  keyboardType="email-address"
  leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />}
/>

<Input
  label="Mật khẩu"
  placeholder="Nhập mật khẩu"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
/>
              
              <Button
                title="Đăng nhập"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                size="large"
                style={styles.loginButton}
              />

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialSection}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color={COLORS.text} />
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={20} color={COLORS.text} />
                <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản?</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerLink}> Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  logoText: {
    ...FONTS.h1,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  welcomeText: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: SIZES.padding,
  },
  loginButton: {
    marginTop: SIZES.base,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SIZES.base,
  },
  forgotPasswordText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.padding,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMuted,
    opacity: 0.3,
  },
  dividerText: {
    ...FONTS.body3,
    color: COLORS.textMuted,
    marginHorizontal: SIZES.base,
  },
  socialSection: {
    marginBottom: SIZES.padding,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  socialButtonText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  registerLink: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});