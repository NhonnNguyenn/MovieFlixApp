// src/components/common/Input.tsx
import React from 'react';
import {
    KeyboardTypeOptions,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  // THÊM CÁC PROPS MỚI
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  autoCorrect?: boolean;
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number' | 'cc-csc' | 'cc-exp' | 'birthdate-day' | 'birthdate-month' | 'birthdate-year';
  multiline?: boolean;
  numberOfLines?: number;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  error,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  // THÊM CÁC PROPS MỚI
  autoCapitalize = 'none',
  keyboardType = 'default',
  autoCorrect = true,
  autoComplete,
  multiline = false,
  numberOfLines = 1
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError
      ]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry}
          selectionColor={COLORS.primary}
          // THÊM CÁC PROPS MỚI
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: SIZES.padding,
    minHeight: 56,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    ...FONTS.body1,
    color: COLORS.text,
    paddingVertical: SIZES.base,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: SIZES.base,
    paddingBottom: SIZES.base,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});