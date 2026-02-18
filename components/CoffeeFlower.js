import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

// Spoon-shaped petal — narrow at center, fat rounded at the tip
function spoonPetalPath(cx, cy, length, tipWidth, baseWidth, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const perpRad = rad + Math.PI / 2;
  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);

  // Narrow base control points — skinny near center
  const baseDist = length * 0.2;
  const baseX = cx + baseDist * Math.cos(rad);
  const baseY = cy + baseDist * Math.sin(rad);
  const b1x = baseX + baseWidth * Math.cos(perpRad);
  const b1y = baseY + baseWidth * Math.sin(perpRad);
  const b2x = baseX - baseWidth * Math.cos(perpRad);
  const b2y = baseY - baseWidth * Math.sin(perpRad);

  // Fat rounded tip — wide spread at the end
  const tipSpread = tipWidth * 0.85;
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

  // Outer petals — narrow at center, BIG fat rounded ends
  const outerLength = size * 0.44;
  const outerTipWidth = size * 0.22;
  const outerBaseWidth = size * 0.06;
  const outerAngles = [0, 72, 144, 216, 288].map((a) => a + 36);

  // Inner petals — same spoon shape but longer, thinner, still fat at tip
  const innerLength = size * 0.30;
  const innerTipWidth = size * 0.10;
  const innerBaseWidth = size * 0.025;
  const innerAngles = [0, 72, 144, 216, 288].map((a) => a + 72);

  const strokeW = bold ? Math.max(size * 0.03, 0.8) : Math.max(size * 0.02, 0.5);
  const strokeColor = dark ? '#3A3A3A' : bold ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)';
  const darkLineColor = dark ? '#2A2A2A' : '#1A1614';
  const fillColor = '#FFFFFF';
  const centerFill = '#C8923C';

  // Stamen lines — from center circles to petal tips (orchid style)
  const stamenLength = outerLength * 0.92;

  // 3 center dots in a triangle
  const dotRadius = size * 0.025;
  const dotSpread = size * 0.045;
  const centerDots = [0, 120, 240].map((deg) => {
    const r = (deg * Math.PI) / 180;
    return { x: center + dotSpread * Math.cos(r), y: center + dotSpread * Math.sin(r) };
  });

  // Micro dots scattered inside — like orchid speckles
  const microRadius = size * 0.01;
  const microSpread = size * 0.10;
  const microDots = [30, 90, 150, 210, 270, 330, 0, 60, 120, 180, 240, 300].map((deg, i) => {
    const r = (deg * Math.PI) / 180;
    const dist = microSpread * (0.6 + (i % 3) * 0.2);
    return { x: center + dist * Math.cos(r), y: center + dist * Math.sin(r) };
  });

  // Small circles at petal tips (orchid lip detail)
  const tipDotRadius = size * 0.018;

  const baseRotation = '36deg';
  const transform = spinning
    ? [{ rotate }]
    : [{ rotate: baseRotation }];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={{ transform }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer petal fills — fat rounded */}
          {outerAngles.map((angle) => (
            <Path
              key={`of-${angle}`}
              d={spoonPetalPath(center, center, outerLength, outerTipWidth, outerBaseWidth, angle)}
              fill={fillColor}
            />
          ))}
          {/* Outer petal strokes */}
          {outerAngles.map((angle) => (
            <Path
              key={`os-${angle}`}
              d={spoonPetalPath(center, center, outerLength, outerTipWidth, outerBaseWidth, angle)}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeW}
            />
          ))}
          {/* Inner petal fills — skinny */}
          {innerAngles.map((angle) => (
            <Path
              key={`if-${angle}`}
              d={spoonPetalPath(center, center, innerLength, innerTipWidth, innerBaseWidth, angle)}
              fill={fillColor}
            />
          ))}
          {/* Inner petal dark strokes */}
          {innerAngles.map((angle) => (
            <Path
              key={`is-${angle}`}
              d={spoonPetalPath(center, center, innerLength, innerTipWidth, innerBaseWidth, angle)}
              fill="none"
              stroke={darkLineColor}
              strokeWidth={strokeW * 1.2}
              opacity={0.5}
            />
          ))}
          {/* Stamen lines — center to outer petal tips */}
          {outerAngles.map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const tipX = center + stamenLength * Math.cos(rad);
            const tipY = center + stamenLength * Math.sin(rad);
            return (
              <Line
                key={`st-${angle}`}
                x1={center}
                y1={center}
                x2={tipX}
                y2={tipY}
                stroke={darkLineColor}
                strokeWidth={strokeW * 0.6}
                opacity={0.35}
              />
            );
          })}
          {/* Small circles at outer petal tips */}
          {outerAngles.map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const tipX = center + stamenLength * Math.cos(rad);
            const tipY = center + stamenLength * Math.sin(rad);
            return (
              <Circle
                key={`tc-${angle}`}
                cx={tipX}
                cy={tipY}
                r={tipDotRadius}
                fill={centerFill}
                opacity={0.7}
              />
            );
          })}
          {/* Micro dots — speckled inside like orchid */}
          {microDots.map((dot, i) => (
            <Circle
              key={`md-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={microRadius}
              fill={centerFill}
              opacity={0.5}
            />
          ))}
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
