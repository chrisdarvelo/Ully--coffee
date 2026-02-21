import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Line, Polygon } from 'react-native-svg';
import { Colors } from '../utils/constants';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function PaperBackground({ children }) {
  const { creases, shadows, fibers } = useMemo(() => {
    const rand = seededRandom(42);
    const W = 420;
    const H = 920;

    // Long crease lines (the fold marks)
    const creaseLines = [];
    for (let i = 0; i < 18; i++) {
      const startX = rand() * W;
      const startY = rand() * H;
      const len = 80 + rand() * 260;
      const angle = rand() * 180;
      const rad = (angle * Math.PI) / 180;
      // Build a wobbly path with 3-5 control points
      const segments = 3 + Math.floor(rand() * 3);
      let d = `M ${startX} ${startY}`;
      let cx = startX;
      let cy = startY;
      for (let s = 0; s < segments; s++) {
        const stepLen = len / segments;
        const wobble = 8 + rand() * 15;
        const perpAngle = rad + Math.PI / 2;
        const cpx = cx + (stepLen * 0.5) * Math.cos(rad) + (rand() - 0.5) * wobble * Math.cos(perpAngle);
        const cpy = cy + (stepLen * 0.5) * Math.sin(rad) + (rand() - 0.5) * wobble * Math.sin(perpAngle);
        cx = cx + stepLen * Math.cos(rad) + (rand() - 0.5) * 6;
        cy = cy + stepLen * Math.sin(rad) + (rand() - 0.5) * 6;
        d += ` Q ${cpx} ${cpy} ${cx} ${cy}`;
      }
      creaseLines.push({
        d,
        opacity: 0.03 + rand() * 0.05,
        width: 0.4 + rand() * 0.8,
      });
    }

    // Shadow patches (subtle polygons simulating raised/depressed areas)
    const shadowPatches = [];
    for (let i = 0; i < 12; i++) {
      const cx = rand() * W;
      const cy = rand() * H;
      const points = [];
      const numPts = 4 + Math.floor(rand() * 3);
      for (let p = 0; p < numPts; p++) {
        const a = (p / numPts) * Math.PI * 2;
        const r = 30 + rand() * 60;
        points.push(`${cx + r * Math.cos(a) + (rand() - 0.5) * 20},${cy + r * Math.sin(a) + (rand() - 0.5) * 20}`);
      }
      shadowPatches.push({
        points: points.join(' '),
        opacity: 0.015 + rand() * 0.025,
        dark: rand() > 0.5,
      });
    }

    // Fine fibers (subtle, fewer than before)
    const fiberLines = [];
    for (let i = 0; i < 30; i++) {
      fiberLines.push({
        x1: rand() * W,
        y1: rand() * H,
        len: 6 + rand() * 14,
        angle: rand() * 180,
        opacity: 0.02 + rand() * 0.03,
        width: 0.3 + rand() * 0.5,
      });
    }

    return { creases: creaseLines, shadows: shadowPatches, fibers: fiberLines };
  }, []);

  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Rect width="100%" height="100%" fill={Colors.background} />

        {/* Shadow patches - subtle light/dark areas */}
        {shadows.map((s, i) => (
          <Polygon
            key={`sh-${i}`}
            points={s.points}
            fill={s.dark ? '#0F0D0B' : '#2A2320'}
            opacity={s.opacity}
          />
        ))}

        {/* Crease lines - wobbly fold marks */}
        {creases.map((c, i) => (
          <Path
            key={`cr-${i}`}
            d={c.d}
            stroke="#3D332A"
            strokeWidth={c.width}
            opacity={c.opacity}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Fine paper fibers */}
        {fibers.map((f, i) => {
          const rad = (f.angle * Math.PI) / 180;
          const x2 = f.x1 + f.len * Math.cos(rad);
          const y2 = f.y1 + f.len * Math.sin(rad);
          return (
            <Line
              key={`fb-${i}`}
              x1={f.x1}
              y1={f.y1}
              x2={x2}
              y2={y2}
              stroke="#3D332A"
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
