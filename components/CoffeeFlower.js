import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

// Coffee blossom petal: emerges narrow from center, flares wide at 55%, tapers to tip.
// Single cubic bezier per side, starting from the exact center point.
function coffeePetalPath(cx, cy, length, maxWidth, baseWidth, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const perpRad = rad + Math.PI / 2;

  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);

  // Narrow tube exit close to center
  const baseDist = length * 0.14;
  const baseMidX = cx + baseDist * Math.cos(rad);
  const baseMidY = cy + baseDist * Math.sin(rad);

  // Widest point at 55%
  const wideDist = length * 0.55;
  const wideMidX = cx + wideDist * Math.cos(rad);
  const wideMidY = cy + wideDist * Math.sin(rad);

  // Right side
  const rc1x = baseMidX + baseWidth * Math.cos(perpRad);
  const rc1y = baseMidY + baseWidth * Math.sin(perpRad);
  const rc2x = wideMidX + maxWidth * Math.cos(perpRad);
  const rc2y = wideMidY + maxWidth * Math.sin(perpRad);

  // Left side
  const lc1x = wideMidX - maxWidth * Math.cos(perpRad);
  const lc1y = wideMidY - maxWidth * Math.sin(perpRad);
  const lc2x = baseMidX - baseWidth * Math.cos(perpRad);
  const lc2y = baseMidY - baseWidth * Math.sin(perpRad);

  return `M ${cx} ${cy} C ${rc1x} ${rc1y} ${rc2x} ${rc2y} ${tipX} ${tipY} C ${lc1x} ${lc1y} ${lc2x} ${lc2y} ${cx} ${cy} Z`;
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

  // 6 petals equally spaced — coffee blossom (Coffea arabica)
  const petalLength = size * 0.45;
  const petalMaxWidth = size * 0.085;
  const petalBaseWidth = size * 0.018;
  const petalAngles = [0, 60, 120, 180, 240, 300];

  // 6 gold stamens between petals
  const stamenLength = size * 0.30;
  const stamenAngles = [30, 90, 150, 210, 270, 330];
  const antherRadius = size * 0.013;

  // Center pistil
  const centerRadius = size * 0.042;

  const strokeW = bold ? Math.max(size * 0.025, 0.8) : Math.max(size * 0.015, 0.5);
  const strokeColor = dark ? 'rgba(60,50,40,0.5)' : 'rgba(200,190,180,0.25)';
  const stamenColor = '#C8A830';
  const antherColor = '#D4B840';
  const centerFill = '#FFFEF5';
  const petalFill = '#FFFFFF';

  const transform = spinning ? [{ rotate }] : [];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={{ transform }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 6 white petals */}
          {petalAngles.map((angle) => (
            <Path
              key={`p-${angle}`}
              d={coffeePetalPath(center, center, petalLength, petalMaxWidth, petalBaseWidth, angle)}
              fill={petalFill}
              stroke={strokeColor}
              strokeWidth={strokeW}
            />
          ))}
          {/* 6 gold stamens with anthers */}
          {stamenAngles.map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const tipX = center + stamenLength * Math.cos(rad);
            const tipY = center + stamenLength * Math.sin(rad);
            return (
              <React.Fragment key={`stamen-${angle}`}>
                <Line
                  x1={center}
                  y1={center}
                  x2={tipX}
                  y2={tipY}
                  stroke={stamenColor}
                  strokeWidth={Math.max(size * 0.008, 0.5)}
                />
                <Circle
                  cx={tipX}
                  cy={tipY}
                  r={antherRadius}
                  fill={antherColor}
                />
              </React.Fragment>
            );
          })}
          {/* Cream center pistil */}
          <Circle
            cx={center}
            cy={center}
            r={centerRadius}
            fill={centerFill}
            stroke={stamenColor}
            strokeWidth={strokeW * 0.5}
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
