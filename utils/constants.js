import { Platform } from 'react-native';

export const Fonts = {
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }),
};

// Warm dark theme — inspired by espresso crema on dark slate
export const Colors = {
  primary: '#C8923C',           // crema gold
  background: '#1A1614',        // warm dark brown
  card: '#252019',              // slightly lighter warm brown
  text: '#FFFFFF',              // white
  textSecondary: '#A09888',     // warm gray
  success: '#6BCB77',
  danger: '#E74C3C',
  warning: '#F0A830',
  info: '#5DADE2',
  border: '#332C24',            // warm dark border
  tabBar: '#1A1614',
  tabInactive: '#6B5E52',       // muted warm brown
};

export const AuthColors = {
  background: '#1A1614',
  text: '#FFFFFF',
  textSecondary: '#A09888',
  buttonFill: '#C8923C',        // crema gold
  buttonText: '#1A1614',        // dark text on gold
  buttonOutline: '#C8923C',
  inputBorder: '#332C24',
  inputBackground: '#252019',
  error: '#E74C3C',
  link: '#C8923C',
};
