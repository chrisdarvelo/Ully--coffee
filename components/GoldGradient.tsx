import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../utils/constants';

interface GoldGradientProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[] | any;
}

export function GoldGradient({ children, style }: GoldGradientProps) {
  return (
    <LinearGradient
      colors={['#F0A830', '#C8923C', '#A07020']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

interface GoldButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  style?: ViewStyle | any;
  textStyle?: TextStyle;
}

export function GoldButton({ label, onPress, disabled, loading, loadingComponent, style, textStyle }: GoldButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, style, (disabled || loading) && styles.disabled]}
    >
      <GoldGradient style={styles.gradient}>
        {loading && loadingComponent
          ? loadingComponent
          : <Text style={[styles.text, textStyle]}>{label}</Text>
        }
      </GoldGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#0E0C0A',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  disabled: {
    opacity: 0.5,
  },
});
