// src/constants/theme.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary Colors
  primary: '#E50914',
  primaryDark: '#B2070F',
  primaryLight: '#FF5252',
  
  // Secondary Colors
  secondary: '#0F0F0F',
  secondaryLight: '#1A1A1A',
  secondaryDark: '#080808',
  
  // Accent Colors
  accent: '#F5C518',
  accentDark: '#D4AF37',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#6D6D6D',
  textDark: '#333333',
  
  // Background Colors
  background: '#000000',
  surface: '#141414',
  card: '#1C1C1C',
  
  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Gradients - SỬA: Dùng array literal
  gradientPrimary: ['#E50914', '#B2070F'] as [string, string],
  gradientSecondary: ['#0F0F0F', '#1A1A1A'] as [string, string],
  gradientDark: ['#000000', '#141414'] as [string, string],
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(255, 255, 255, 0.1)',
  overlayDark: 'rgba(0, 0, 0, 0.9)',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: 'bold' as const, lineHeight: 36 },
  h2: { fontSize: SIZES.h2, fontWeight: 'bold' as const, lineHeight: 30 },
  h3: { fontSize: SIZES.h3, fontWeight: '600' as const, lineHeight: 26 },
  h4: { fontSize: SIZES.h4, fontWeight: '600' as const, lineHeight: 24 },
  body1: { fontSize: SIZES.body1, lineHeight: 22 },
  body2: { fontSize: SIZES.body2, lineHeight: 20 },
  body3: { fontSize: SIZES.body3, lineHeight: 18 },
  body4: { fontSize: SIZES.body4, lineHeight: 16 },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  medium: {
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dark: {
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
};

const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

export default appTheme;