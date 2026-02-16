import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse } from 'react-native-svg';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Wilfredo Lam - organic curves, earthy tones
function generateLam(rand, w, h) {
  const palette = ['#8B6914', '#2D5016', '#6B3A2A', '#C4956A', '#3C6E47', '#D4A853'];
  const elements = [];

  // Background wash
  elements.push(
    <Rect key="bg" width={w} height={h} fill="#2A2320" />
  );

  // Organic curved shapes
  for (let i = 0; i < 5; i++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const color = palette[Math.floor(rand() * palette.length)];
    const r1 = 15 + rand() * 35;
    const r2 = 10 + rand() * 25;
    const cp1x = cx + (rand() - 0.5) * 60;
    const cp1y = cy + (rand() - 0.5) * 60;
    const cp2x = cx + (rand() - 0.5) * 60;
    const cp2y = cy + (rand() - 0.5) * 60;

    elements.push(
      <Path
        key={`lam-${i}`}
        d={`M ${cx - r1} ${cy} Q ${cp1x} ${cp1y} ${cx + r1} ${cy} Q ${cp2x} ${cp2y} ${cx - r1} ${cy}`}
        fill={color}
        opacity={0.6 + rand() * 0.3}
      />
    );

    // Small accent circles
    if (rand() > 0.4) {
      elements.push(
        <Circle
          key={`lam-c-${i}`}
          cx={cx + (rand() - 0.5) * 30}
          cy={cy + (rand() - 0.5) * 30}
          r={3 + rand() * 8}
          fill={palette[Math.floor(rand() * palette.length)]}
          opacity={0.5 + rand() * 0.4}
        />
      );
    }
  }

  // Thin vine-like lines
  for (let i = 0; i < 3; i++) {
    const startX = rand() * w;
    const startY = rand() * h;
    const endX = rand() * w;
    const endY = rand() * h;
    const cpx = (startX + endX) / 2 + (rand() - 0.5) * 40;
    const cpy = (startY + endY) / 2 + (rand() - 0.5) * 40;
    elements.push(
      <Path
        key={`lam-l-${i}`}
        d={`M ${startX} ${startY} Q ${cpx} ${cpy} ${endX} ${endY}`}
        stroke="#2D2D1A"
        strokeWidth={1 + rand() * 1.5}
        fill="none"
        opacity={0.4 + rand() * 0.3}
      />
    );
  }

  return elements;
}

// Rothko - horizontal color field bands
function generateRothko(rand, w, h) {
  const palettes = [
    ['#8B2500', '#CD6600', '#FFD700', '#FF4500'],
    ['#2E0854', '#4B0082', '#8B008B', '#DA70D6'],
    ['#003366', '#006699', '#0099CC', '#66CCFF'],
    ['#2F4F2F', '#3B7A57', '#6B8E23', '#9ACD32'],
  ];
  const palette = palettes[Math.floor(rand() * palettes.length)];
  const elements = [];

  // Soft base
  elements.push(
    <Rect key="bg" width={w} height={h} fill={palette[0]} opacity={0.15} />
  );

  // 2-3 large horizontal bands with soft edges
  const bands = 2 + Math.floor(rand() * 2);
  const bandHeight = h / (bands + 1);

  for (let i = 0; i < bands; i++) {
    const y = bandHeight * (i + 0.5) + (rand() - 0.5) * 10;
    const bh = bandHeight * (0.6 + rand() * 0.3);
    const color = palette[Math.floor(rand() * palette.length)];
    const margin = 8 + rand() * 15;

    elements.push(
      <Rect
        key={`rothko-${i}`}
        x={margin}
        y={y}
        width={w - margin * 2}
        height={bh}
        fill={color}
        opacity={0.7 + rand() * 0.25}
        rx={2}
      />
    );

    // Subtle overlay for depth
    if (rand() > 0.3) {
      const oy = y + rand() * bh * 0.3;
      elements.push(
        <Rect
          key={`rothko-o-${i}`}
          x={margin + 5}
          y={oy}
          width={w - margin * 2 - 10}
          height={bh * 0.4}
          fill={palette[Math.floor(rand() * palette.length)]}
          opacity={0.3 + rand() * 0.2}
          rx={1}
        />
      );
    }
  }

  return elements;
}

// Picasso - cubist geometry, angular shapes
function generatePicasso(rand, w, h) {
  const palette = ['#1A1A2E', '#E94560', '#0F3460', '#F5C518', '#16213E', '#FF6B35'];
  const elements = [];

  // Cream background
  elements.push(
    <Rect key="bg" width={w} height={h} fill="#252019" />
  );

  // Angular geometric shapes
  for (let i = 0; i < 6; i++) {
    const color = palette[Math.floor(rand() * palette.length)];
    const cx = rand() * w;
    const cy = rand() * h;
    const size = 15 + rand() * 40;
    const points = 3 + Math.floor(rand() * 3);

    let d = '';
    for (let p = 0; p < points; p++) {
      const angle = (p / points) * Math.PI * 2 + rand() * 0.5;
      const r = size * (0.5 + rand() * 0.5);
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      d += p === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    d += ' Z';

    elements.push(
      <Path
        key={`pic-${i}`}
        d={d}
        fill={color}
        opacity={0.5 + rand() * 0.4}
      />
    );
  }

  // Bold lines crossing the composition
  for (let i = 0; i < 4; i++) {
    elements.push(
      <Path
        key={`pic-l-${i}`}
        d={`M ${rand() * w} ${rand() * h} L ${rand() * w} ${rand() * h}`}
        stroke="#1A1A2E"
        strokeWidth={1.5 + rand() * 2}
        opacity={0.4 + rand() * 0.3}
      />
    );
  }

  // Small circles as accents
  for (let i = 0; i < 3; i++) {
    elements.push(
      <Circle
        key={`pic-c-${i}`}
        cx={rand() * w}
        cy={rand() * h}
        r={4 + rand() * 10}
        fill={palette[Math.floor(rand() * palette.length)]}
        opacity={0.5 + rand() * 0.3}
      />
    );
  }

  return elements;
}

const GENERATORS = {
  lam: generateLam,
  rothko: generateRothko,
  picasso: generatePicasso,
};

export default function RecipeArtCover({ artSeed = 1, artStyle = 'lam', size = 120 }) {
  const elements = useMemo(() => {
    const rand = seededRandom(artSeed);
    const generator = GENERATORS[artStyle] || generateLam;
    return generator(rand, size, size);
  }, [artSeed, artStyle, size]);

  return (
    <View style={{ width: size, height: size, borderRadius: 6, overflow: 'hidden' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {elements}
      </Svg>
    </View>
  );
}
