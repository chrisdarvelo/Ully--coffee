import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

// Rounded petal — cubic bezier with a soft rounded tip instead of a sharp point
function petalPath(cx, cy, length, width, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const perpRad = rad + Math.PI / 2;

  // Tip of the petal
  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);

  // Wide control points at ~40% along the petal for the bulge
  const bulgeDist = length * 0.4;
  const bulgeX = cx + bulgeDist * Math.cos(rad);
  const bulgeY = cy + bulgeDist * Math.sin(rad);
  const b1x = bulgeX + width * Math.cos(perpRad);
  const b1y = bulgeY + width * Math.sin(perpRad);
  const b2x = bulgeX - width * Math.cos(perpRad);
  const b2y = bulgeY - width * Math.sin(perpRad);

  // Tip control points — spread apart for a rounded tip
  const tipSpread = width * 0.5;
  const t1x = tipX + tipSpread * Math.cos(perpRad);
  const t1y = tipY + tipSpread * Math.sin(perpRad);
  const t2x = tipX - tipSpread * Math.cos(perpRad);
  const t2y = tipY - tipSpread * Math.sin(perpRad);

  return `M ${cx} ${cy} C ${b1x} ${b1y} ${t1x} ${t1y} ${tipX} ${tipY} C ${t2x} ${t2y} ${b2x} ${b2y} ${cx} ${cy} Z`;
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
  // Outer petals — fatter, rounded
  const outerLength = size * 0.42;
  const outerWidth = size * 0.16;
  const outerAngles = [0, 72, 144, 216, 288].map((a) => a + 36);
  // Inner petals — wider and more visible, rotated between outer petals
  const innerLength = size * 0.28;
  const innerWidth = size * 0.10;
  const innerAngles = [0, 72, 144, 216, 288].map((a) => a + 72);
  const centerRadius = size * 0.035;
  const strokeW = bold ? Math.max(size * 0.03, 0.8) : Math.max(size * 0.02, 0.5);
  const strokeColor = dark ? '#3A3A3A' : bold ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)';
  const darkLineColor = dark ? '#2A2A2A' : '#1A1614';
  const fillColor = '#FFFFFF';
  const centerFill = '#C8923C';

  // 3 center dots arranged in a triangle
  const dotRadius = size * 0.025;
  const dotSpread = size * 0.045;
  const centerDots = [0, 120, 240].map((deg) => {
    const r = (deg * Math.PI) / 180;
    return { x: center + dotSpread * Math.cos(r), y: center + dotSpread * Math.sin(r) };
  });

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
          {/* Inner petal strokes — darker for visibility */}
          {innerAngles.map((angle) => (
            <Path
              key={`is-${angle}`}
              d={petalPath(center, center, innerLength, innerWidth, angle)}
              fill="none"
              stroke={darkLineColor}
              strokeWidth={strokeW * 1.2}
              opacity={0.6}
            />
          ))}
          {/* Dark lines connecting inner petal tips to center dots */}
          {innerAngles.map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const tipX = center + innerLength * 0.5 * Math.cos(rad);
            const tipY = center + innerLength * 0.5 * Math.sin(rad);
            return (
              <Line
                key={`ln-${angle}`}
                x1={center}
                y1={center}
                x2={tipX}
                y2={tipY}
                stroke={darkLineColor}
                strokeWidth={strokeW * 0.8}
                opacity={0.5}
              />
            );
          })}
          {/* 3 center dots in a triangle */}
          {centerDots.map((dot, i) => (
            <Circle key={`cd-${i}`} cx={dot.x} cy={dot.y} r={dotRadius} fill={centerFill} />
          ))}
          {centerDots.map((dot, i) => (
            <Circle
              key={`cds-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dotRadius}
              fill="none"
              stroke={darkLineColor}
              strokeWidth={strokeW * 0.6}
              opacity={0.5}
            />
          ))}
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
