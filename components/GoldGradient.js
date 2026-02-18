import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthColors, Fonts } from '../utils/constants';

// Bright gold on left → 30% darker gold on right
const GOLD_COLORS = ['#E8B84A', '#C8923C', '#7A5518'];

// Reusable gradient background — wraps any content
export function GoldGradient({ style, children }) {
  return (
    <LinearGradient
      colors={GOLD_COLORS}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

// Full action button with gradient
export function GoldButton({ onPress, label, disabled, loading, loadingComponent, style, textStyle, activeOpacity = 0.8 }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={disabled ? { opacity: 0.6 } : undefined}
    >
      <GoldGradient style={[styles.button, style]}>
        {loading && loadingComponent ? (
          loadingComponent
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{label}</Text>
        )}
      </GoldGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: AuthColors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
});
