import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../utils/constants';
import CoffeeFlower from './CoffeeFlower';

interface IconProps {
  color: string;
  size: number;
}

export function TentIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L2 20h20L12 3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M12 3v17"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M9 20l3-7 3 7"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ProfileIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle cx="12" cy="8" r="4" fill={color} />
      {/* Shoulders & chest */}
      <Path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" fill={color} />
    </Svg>
  );
}

interface TabIconProps {
  label: string;
  focused: boolean;
}

export function TabIcon({ label, focused }: TabIconProps) {
  const color = focused ? Colors.text : Colors.tabInactive;
  const scale = focused ? 1.15 : 1;

  if (label === 'AI') {
    return (
      <View style={{ transform: [{ scale }] }}>
        <CoffeeFlower size={24} bold dark={focused} />
      </View>
    );
  }

  if (label === 'Profile') {
    return (
      <View style={{ transform: [{ scale }] }}>
        <ProfileIcon color={color} size={24} />
      </View>
    );
  }

  return (
    <View style={{ transform: [{ scale }] }}>
      <TentIcon color={color} size={24} />
    </View>
  );
}
