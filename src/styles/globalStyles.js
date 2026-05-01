import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  danger: '#dc2626',
  success: '#16a34a',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  border: '#d1d5db',
};

export const SPACING = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const RADIUS = {
  md: 8,
};

export const globalStyles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  screenPadding: {
    padding: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 14,
  },
  successButton: {
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.md,
    padding: 14,
  },
  buttonText: {
    color: COLORS.surface,
    fontWeight: '700',
    textAlign: 'center',
  },
});
