import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

function petalPath(cx, cy, length, width, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);

  const perpRad = rad + Math.PI / 2;
  const cpDist = length * 0.45;
  const cpX = cx + cpDist * Math.cos(rad);
  const cpY = cy + cpDist * Math.sin(rad);

  const cp1x = cpX + width * Math.cos(perpRad);
  const cp1y = cpY + width * Math.sin(perpRad);
  const cp2x = cpX - width * Math.cos(perpRad);
  const cp2y = cpY - width * Math.sin(perpRad);

  return `M ${cx} ${cy} Q ${cp1x} ${cp1y} ${tipX} ${tipY} Q ${cp2x} ${cp2y} ${cx} ${cy} Z`;
}

export default function CoffeeFlower({ size = 150, spinning = false, bold = false, dark = false }) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (spinning) {
      spinAnim.setValue(0);
      const spinLoop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
      spinLoop.start();
      return () => spinLoop.stop();
    } else {
      spinAnim.setValue(0);
    }
  }, [spinning, spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const center = size / 2;
  // Outer petals — fatter
  const outerLength = size * 0.42;
  const outerWidth = size * 0.16;
  const outerAngles = [0, 72, 144, 216, 288].map((a) => a + 36);
  // Inner petals — finer, rotated between outer petals
  const innerLength = size * 0.28;
  const innerWidth = size * 0.06;
  const innerAngles = [0, 72, 144, 216, 288].map((a) => a + 72);
  const centerRadius = size * 0.035;
  const strokeW = bold ? Math.max(size * 0.03, 0.8) : Math.max(size * 0.02, 0.5);
  const strokeColor = dark ? '#3A3A3A' : bold ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)';
  const fillColor = '#FFFFFF';
  const centerFill = '#C8923C';

  const baseRotation = '36deg';
  const transform = spinning
    ? [{ rotate }]
    : [{ rotate: baseRotation }];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={{ transform }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer petal fills */}
          {outerAngles.map((angle) => (
            <Path
              key={`of-${angle}`}
              d={petalPath(center, center, outerLength, outerWidth, angle)}
              fill={fillColor}
            />
          ))}
          {/* Outer petal strokes */}
          {outerAngles.map((angle) => (
            <Path
              key={`os-${angle}`}
              d={petalPath(center, center, outerLength, outerWidth, angle)}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeW}
            />
          ))}
          {/* Inner petal fills */}
          {innerAngles.map((angle) => (
            <Path
              key={`if-${angle}`}
              d={petalPath(center, center, innerLength, innerWidth, angle)}
              fill={fillColor}
            />
          ))}
          {/* Inner petal strokes */}
          {innerAngles.map((angle) => (
            <Path
              key={`is-${angle}`}
              d={petalPath(center, center, innerLength, innerWidth, angle)}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeW * 0.7}
            />
          ))}
          {/* Tiny pale center */}
          <Circle cx={center} cy={center} r={centerRadius} fill={centerFill} />
          <Circle
            cx={center}
            cy={center}
            r={centerRadius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW * 0.7}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
