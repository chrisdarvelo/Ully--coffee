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

// Wilfredo Lam - organic curves, warm vibrant tones
function generateLam(rand, w, h) {
  const palette = ['#E8A63C', '#D45B2C', '#C4956A', '#F2C94C', '#E07040', '#D4A853'];
  const elements = [];

  elements.push(
    <Rect key="bg" width={w} height={h} fill="#FAF3E8" />
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
        opacity={0.7 + rand() * 0.3}
      />
    );

    if (rand() > 0.4) {
      elements.push(
        <Circle
          key={`lam-c-${i}`}
          cx={cx + (rand() - 0.5) * 30}
          cy={cy + (rand() - 0.5) * 30}
          r={3 + rand() * 8}
          fill={palette[Math.floor(rand() * palette.length)]}
          opacity={0.6 + rand() * 0.4}
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
        stroke="#C8923C"
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
    ['#FF6B35', '#FFD166', '#FFFFFF', '#F77F00'],
    ['#3A86FF', '#8ECAE6', '#FFFFFF', '#219EBC'],
    ['#E63946', '#F4A261', '#FFFFFF', '#FFD166'],
    ['#06D6A0', '#118AB2', '#FFFFFF', '#FFD166'],
  ];
  const palette = palettes[Math.floor(rand() * palettes.length)];
  const elements = [];

  // White-ish soft base
  elements.push(
    <Rect key="bg" width={w} height={h} fill="#F8F4EE" />
  );

  // 2-3 large horizontal bands
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
        opacity={0.8 + rand() * 0.2}
        rx={2}
      />
    );

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
          opacity={0.4 + rand() * 0.2}
          rx={1}
        />
      );
    }
  }

  return elements;
}

// Picasso - cubist geometry, bold colors on white
function generatePicasso(rand, w, h) {
  const palette = ['#E63946', '#457B9D', '#F4A261', '#2A9D8F', '#F77F00', '#264653'];
  const elements = [];

  elements.push(
    <Rect key="bg" width={w} height={h} fill="#FFFFFF" />
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
        opacity={0.6 + rand() * 0.35}
      />
    );
  }

  // Bold lines crossing the composition
  for (let i = 0; i < 4; i++) {
    elements.push(
      <Path
        key={`pic-l-${i}`}
        d={`M ${rand() * w} ${rand() * h} L ${rand() * w} ${rand() * h}`}
        stroke="#264653"
        strokeWidth={1.5 + rand() * 2}
        opacity={0.3 + rand() * 0.3}
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
        opacity={0.5 + rand() * 0.4}
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
