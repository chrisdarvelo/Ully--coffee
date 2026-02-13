import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Circle } from 'react-native-svg';

export default function CoffeeFlower({ size = 150, spinning = false }) {
  const breathAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.06,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    breathLoop.start();
    return () => breathLoop.stop();
  }, [breathAnim]);

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

  const petalAngles = [0, 72, 144, 216, 288];

  const center = size / 2;
  const petalRx = size * 0.16;
  const petalRy = size * 0.32;
  const petalOffset = size * 0.22;
  const stamenDistance = size * 0.08;
  const stamenRadius = size * 0.025;
  const centerRadius = size * 0.07;

  const transform = spinning
    ? [{ scale: breathAnim }, { rotate }]
    : [{ scale: breathAnim }];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={{ transform }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Petals */}
          {petalAngles.map((angle) => (
            <Ellipse
              key={`petal-${angle}`}
              cx={center}
              cy={center - petalOffset}
              rx={petalRx}
              ry={petalRy}
              fill="#FAF5F0"
              stroke="#E8DDD4"
              strokeWidth={1}
              transform={`rotate(${angle}, ${center}, ${center})`}
              opacity={0.92}
            />
          ))}

          {/* Stamens */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const sx = center + stamenDistance * Math.cos(rad);
            const sy = center + stamenDistance * Math.sin(rad);
            return (
              <Circle
                key={`stamen-${angle}`}
                cx={sx}
                cy={sy}
                r={stamenRadius}
                fill="#8B6914"
                opacity={0.7}
              />
            );
          })}

          {/* Center disk */}
          <Circle cx={center} cy={center} r={centerRadius} fill="#D4A574" />
          <Circle
            cx={center}
            cy={center}
            r={centerRadius * 0.65}
            fill="#C0783E"
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
