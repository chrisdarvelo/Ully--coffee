import { Platform } from 'react-native';

export const Fonts = {
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }),
};

export const Colors = {
  primary: '#c0783e',
  background: '#F5F0EB',
  card: '#FFFFFF',
  text: '#1a1a1a',
  textSecondary: '#777777',
  success: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  border: '#E8E0D8',
  tabBar: '#FAFAF7',
  tabInactive: '#AAAAAA',
};

export const AuthColors = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  buttonFill: '#1B2A4A',
  buttonText: '#A8E6CF',
  buttonOutline: '#1B2A4A',
  inputBorder: '#E0E0E0',
  inputBackground: '#F8F8F8',
  error: '#e74c3c',
  link: '#c0783e',
};

export const EquipmentTypes = {
  machine: { label: 'Machine', icon: '☕' },
  grinder: { label: 'Grinder', icon: '⚙️' },
  scale: { label: 'Scale', icon: '⚖️' },
};

