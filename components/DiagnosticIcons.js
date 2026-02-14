import React from 'react';
import { Text } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { EquipmentTypes } from '../utils/constants';

export function ScanIcon({ size = 28, color = '#1a1a1a' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7V4a1 1 0 011-1h3M17 3h3a1 1 0 011 1v3M21 17v3a1 1 0 01-1 1h-3M7 21H4a1 1 0 01-1-1v-3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="7" y1="7" x2="7" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="10" y1="7" x2="10" y2="17" stroke={color} strokeWidth={1} />
      <Line x1="12.5" y1="7" x2="12.5" y2="17" stroke={color} strokeWidth={2} />
      <Line x1="15" y1="7" x2="15" y2="17" stroke={color} strokeWidth={1} />
      <Line x1="17" y1="7" x2="17" y2="17" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function PortafilterIcon({ size = 28, color = '#1a1a1a' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Handle */}
      <Path
        d="M2 11h5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Basket body */}
      <Path
        d="M7 8c0 0 0-1 1-1h8c1 0 1 1 1 1v2c0 3-2.5 6-5 6s-5-3-5-6V8z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Spouts */}
      <Path
        d="M10 16v3M14 16v3"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 28, color = '#1a1a1a' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path
        d="M15.5 15.5L21 21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function EquipmentTypeIcon({ type, size = 22, color = '#1a1a1a', style }) {
  if (type === 'machine') {
    return <EspressoMachineIcon size={size} color={color} />;
  }
  const info = EquipmentTypes[type] || EquipmentTypes.machine;
  return <Text style={[{ fontSize: size, textAlign: 'center' }, style]}>{info.icon}</Text>;
}

export function EspressoMachineIcon({ size = 28, color = '#1a1a1a' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Machine body */}
      <Rect
        x="4"
        y="3"
        width="16"
        height="14"
        rx="2"
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
      {/* Group head */}
      <Path
        d="M9 17v2M15 17v2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* Drip tray */}
      <Rect
        x="6"
        y="20"
        width="12"
        height="1.5"
        rx="0.75"
        fill={color}
      />
      {/* Portafilter slot */}
      <Line
        x1="8"
        y1="13"
        x2="16"
        y2="13"
        stroke={color}
        strokeWidth={1.2}
      />
      {/* Gauge */}
      <Circle
        cx="12"
        cy="8"
        r="2.5"
        stroke={color}
        strokeWidth={1.2}
      />
      {/* Gauge needle */}
      <Path
        d="M12 8l1.5-1.5"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </Svg>
  );
}
