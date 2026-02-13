import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { Colors } from '../utils/constants';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function PaperBackground({ children }) {
  const fibers = useMemo(() => {
    const rand = seededRandom(42);
    const items = [];
    for (let i = 0; i < 60; i++) {
      items.push({
        x1: rand() * 400,
        y1: rand() * 900,
        len: 8 + rand() * 20,
        angle: rand() * 180,
        opacity: 0.03 + rand() * 0.04,
        width: 0.5 + rand() * 0.8,
      });
    }
    return items;
  }, []);

  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Rect width="100%" height="100%" fill={Colors.background} />
        {fibers.map((f, i) => {
          const rad = (f.angle * Math.PI) / 180;
          const x2 = f.x1 + f.len * Math.cos(rad);
          const y2 = f.y1 + f.len * Math.sin(rad);
          return (
            <Line
              key={i}
              x1={f.x1}
              y1={f.y1}
              x2={x2}
              y2={y2}
              stroke="#C4B8A8"
              strokeWidth={f.width}
              opacity={f.opacity}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
