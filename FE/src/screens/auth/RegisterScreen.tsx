// src/screens/auth/RegisterScreen.tsx - CẬP NHẬT
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES, FONTS } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, username);
    } catch (error: any) {
      Alert.alert('Lỗi đăng ký', error.message || 'Đăng ký thất bại');
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
            
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.title}>Tạo tài khoản</Text>
              <Text style={styles.subtitle}>Đăng ký để bắt đầu trải nghiệm</Text>
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
                label="Tên người dùng"
                placeholder="Chọn tên người dùng"
                value={username}
                onChangeText={setUsername}
                leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.textMuted} />}
              />
              
              <Input
                label="Mật khẩu"
                placeholder="Tạo mật khẩu mới"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
              />
              
              <Input
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />}
              />

              {/* Password Requirements */}
              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={password.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={password.length >= 6 ? COLORS.success : COLORS.textMuted} 
                  />
                  <Text style={[
                    styles.requirementText,
                    password.length >= 6 && styles.requirementMet
                  ]}>
                    Ít nhất 6 ký tự
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={password === confirmPassword && password ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={password === confirmPassword && password ? COLORS.success : COLORS.textMuted} 
                  />
                  <Text style={[
                    styles.requirementText,
                    password === confirmPassword && password && styles.requirementMet
                  ]}>
                    Mật khẩu khớp
                  </Text>
                </View>
              </View>
              
              <Button
                title="Đăng ký"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                size="large"
                style={styles.registerButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Đã có tài khoản?</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLink}> Đăng nhập ngay</Text>
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
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  header: {
    marginBottom: SIZES.padding * 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  formSection: {
    marginBottom: SIZES.padding,
  },
  requirements: {
    backgroundColor: COLORS.secondaryLight,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  requirementsTitle: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  requirementText: {
    ...FONTS.body4,
    color: COLORS.textMuted,
    marginLeft: SIZES.base,
  },
  requirementMet: {
    color: COLORS.success,
  },
  registerButton: {
    marginTop: SIZES.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});