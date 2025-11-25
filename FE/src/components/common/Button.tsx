// src/components/common/Button.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle 
}: ButtonProps) {
  const getButtonHeight = () => {
    switch (size) {
      case 'small': return 40;
      case 'large': return 56;
      default: return 48;
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      height: getButtonHeight(),
      borderRadius: SIZES.radius,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return [baseStyle, styles.primaryButton];
      case 'secondary':
        return [baseStyle, styles.secondaryButton];
      case 'outline':
        return [baseStyle, styles.outlineButton];
      default:
        return [baseStyle, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...FONTS.h4,
      fontWeight: '600' as const,
    };

    switch (variant) {
      case 'primary':
        return [baseStyle, styles.primaryText];
      case 'secondary':
        return [baseStyle, styles.secondaryText];
      case 'outline':
        return [baseStyle, styles.outlineText];
      default:
        return [baseStyle, styles.primaryText];
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={COLORS.text} />;
    }

    return (
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
      >
        <LinearGradient
          colors={COLORS.gradientPrimary} // ĐÃ SỬA: colors có type đúng
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: COLORS.secondaryLight,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: {
    color: COLORS.text,
  },
  secondaryText: {
    color: COLORS.text,
  },
  outlineText: {
    color: COLORS.primary,
  },
});