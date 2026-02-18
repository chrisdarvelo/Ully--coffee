import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, Line } from 'react-native-svg';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Coffee Plant — branches, leaves, and cherries
function generatePlant(rand, w, h) {
  const leafGreen = ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'];
  const cherryRed = ['#D62828', '#E63946', '#C1121F', '#A4161A'];
  const elements = [];

  // Warm cream sky
  elements.push(<Rect key="bg" width={w} height={h} fill="#FDF6EC" />);

  // Main branch
  const branchStartX = w * 0.15;
  const branchStartY = h * 0.85;
  const branchEndX = w * 0.75;
  const branchEndY = h * 0.15;
  const bcpx = w * (0.3 + rand() * 0.2);
  const bcpy = h * (0.3 + rand() * 0.3);

  elements.push(
    <Path
      key="branch"
      d={`M ${branchStartX} ${branchStartY} Q ${bcpx} ${bcpy} ${branchEndX} ${branchEndY}`}
      stroke="#5C4033"
      strokeWidth={2.5 + rand() * 1.5}
      fill="none"
      strokeLinecap="round"
    />
  );

  // Leaves along the branch
  for (let i = 0; i < 6; i++) {
    const t = 0.15 + (i / 6) * 0.7;
    const bx = (1 - t) * (1 - t) * branchStartX + 2 * (1 - t) * t * bcpx + t * t * branchEndX;
    const by = (1 - t) * (1 - t) * branchStartY + 2 * (1 - t) * t * bcpy + t * t * branchEndY;
    const leafLen = 12 + rand() * 18;
    const leafW = 5 + rand() * 7;
    const side = rand() > 0.5 ? 1 : -1;
    const angle = -45 + rand() * 30;
    const rad = (angle * Math.PI) / 180;
    const tipX = bx + leafLen * Math.cos(rad) * side;
    const tipY = by + leafLen * Math.sin(rad);
    const cp1x = bx + leafLen * 0.3 * Math.cos(rad) * side + leafW * Math.sin(rad);
    const cp1y = by + leafLen * 0.3 * Math.sin(rad) - leafW * Math.cos(rad) * side;
    const cp2x = bx + leafLen * 0.3 * Math.cos(rad) * side - leafW * Math.sin(rad);
    const cp2y = by + leafLen * 0.3 * Math.sin(rad) + leafW * Math.cos(rad) * side;
    const color = leafGreen[Math.floor(rand() * leafGreen.length)];

    elements.push(
      <Path
        key={`leaf-${i}`}
        d={`M ${bx} ${by} Q ${cp1x} ${cp1y} ${tipX} ${tipY} Q ${cp2x} ${cp2y} ${bx} ${by} Z`}
        fill={color}
        opacity={0.7 + rand() * 0.3}
      />
    );

    // Leaf vein
    elements.push(
      <Line
        key={`vein-${i}`}
        x1={bx}
        y1={by}
        x2={tipX}
        y2={tipY}
        stroke="#1B4332"
        strokeWidth={0.5}
        opacity={0.4}
      />
    );
  }

  // Coffee cherries — clusters
  for (let i = 0; i < 8; i++) {
    const t = 0.2 + (i / 8) * 0.6;
    const bx = (1 - t) * (1 - t) * branchStartX + 2 * (1 - t) * t * bcpx + t * t * branchEndX;
    const by = (1 - t) * (1 - t) * branchStartY + 2 * (1 - t) * t * bcpy + t * t * branchEndY;
    const ox = (rand() - 0.5) * 20;
    const oy = rand() * 15 + 5;
    const r = 3 + rand() * 4;
    const color = cherryRed[Math.floor(rand() * cherryRed.length)];

    elements.push(
      <Circle key={`cherry-${i}`} cx={bx + ox} cy={by + oy} r={r} fill={color} opacity={0.8 + rand() * 0.2} />
    );
    // Highlight
    elements.push(
      <Circle key={`ch-hl-${i}`} cx={bx + ox - r * 0.25} cy={by + oy - r * 0.25} r={r * 0.3} fill="#FFFFFF" opacity={0.3} />
    );
  }

  return elements;
}

// Processing — drying beds, washed, natural, fermentation tanks
function generateProcessing(rand, w, h) {
  const elements = [];

  // Warm earth background
  elements.push(<Rect key="bg" width={w} height={h} fill="#F5E6D0" />);

  // Raised drying beds — horizontal slats
  const bedY = h * 0.4;
  const bedH = h * 0.35;
  const slats = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < slats; i++) {
    const y = bedY + (i / slats) * bedH;
    elements.push(
      <Line key={`slat-${i}`} x1={w * 0.08} y1={y} x2={w * 0.92} y2={y} stroke="#8B6914" strokeWidth={1.5} opacity={0.4 + rand() * 0.2} />
    );
  }

  // Bed legs
  elements.push(
    <Line key="leg1" x1={w * 0.12} y1={bedY} x2={w * 0.12} y2={bedY + bedH + 15} stroke="#5C4033" strokeWidth={2} opacity={0.5} />,
    <Line key="leg2" x1={w * 0.88} y1={bedY} x2={w * 0.88} y2={bedY + bedH + 15} stroke="#5C4033" strokeWidth={2} opacity={0.5} />,
    <Line key="leg3" x1={w * 0.5} y1={bedY} x2={w * 0.5} y2={bedY + bedH + 15} stroke="#5C4033" strokeWidth={2} opacity={0.5} />
  );

  // Coffee beans drying on the bed
  const beanColors = ['#6F4E37', '#8B6914', '#A0522D', '#CD853F', '#D2B48C', '#C41E3A'];
  for (let i = 0; i < 30; i++) {
    const bx = w * 0.12 + rand() * w * 0.76;
    const by = bedY + rand() * bedH;
    const r = 2 + rand() * 3;
    const color = beanColors[Math.floor(rand() * beanColors.length)];
    elements.push(
      <Ellipse key={`bean-${i}`} cx={bx} cy={by} rx={r} ry={r * 0.65} fill={color} opacity={0.7 + rand() * 0.3} />
    );
  }

  // Sun at top
  const sunX = w * (0.2 + rand() * 0.6);
  const sunY = h * 0.12;
  elements.push(
    <Circle key="sun" cx={sunX} cy={sunY} r={14 + rand() * 8} fill="#F2C94C" opacity={0.6} />
  );
  // Sun rays
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r1 = 18 + rand() * 6;
    const r2 = r1 + 6 + rand() * 8;
    elements.push(
      <Line
        key={`ray-${i}`}
        x1={sunX + r1 * Math.cos(angle)}
        y1={sunY + r1 * Math.sin(angle)}
        x2={sunX + r2 * Math.cos(angle)}
        y2={sunY + r2 * Math.sin(angle)}
        stroke="#F2C94C"
        strokeWidth={1.5}
        opacity={0.4}
        strokeLinecap="round"
      />
    );
  }

  return elements;
}

// Roasting — drum roaster, beans in stages
function generateRoasting(rand, w, h) {
  const elements = [];

  // Dark warm background
  elements.push(<Rect key="bg" width={w} height={h} fill="#2C1810" />);

  // Roaster drum
  const drumCX = w * 0.5;
  const drumCY = h * 0.45;
  const drumRX = w * 0.32;
  const drumRY = h * 0.22;

  elements.push(
    <Ellipse key="drum" cx={drumCX} cy={drumCY} rx={drumRX} ry={drumRY} fill="#4A3728" stroke="#6F4E37" strokeWidth={2} />
  );

  // Heat glow under drum
  elements.push(
    <Ellipse key="glow" cx={drumCX} cy={drumCY + drumRY + 10} rx={drumRX * 0.7} ry={8} fill="#E25822" opacity={0.3} />
  );

  // Beans inside drum at different roast levels
  const roastColors = ['#D4C5A9', '#C8A97E', '#A0785A', '#6F4E37', '#3E2723', '#1A0F0A'];
  for (let i = 0; i < 20; i++) {
    const angle = rand() * Math.PI * 2;
    const rx = rand() * drumRX * 0.75;
    const ry = rand() * drumRY * 0.75;
    const bx = drumCX + rx * Math.cos(angle);
    const by = drumCY + ry * Math.sin(angle);
    const br = 2.5 + rand() * 3;
    const color = roastColors[Math.floor(rand() * roastColors.length)];

    elements.push(
      <Ellipse key={`rb-${i}`} cx={bx} cy={by} rx={br} ry={br * 0.7} fill={color} opacity={0.8 + rand() * 0.2} />
    );
  }

  // Steam/smoke wisps rising
  for (let i = 0; i < 5; i++) {
    const sx = drumCX + (rand() - 0.5) * drumRX;
    const sy = drumCY - drumRY - 5;
    const cp1x = sx + (rand() - 0.5) * 20;
    const cp1y = sy - 15 - rand() * 20;
    const endX = sx + (rand() - 0.5) * 15;
    const endY = sy - 30 - rand() * 25;

    elements.push(
      <Path
        key={`smoke-${i}`}
        d={`M ${sx} ${sy} Q ${cp1x} ${cp1y} ${endX} ${endY}`}
        stroke="#C4956A"
        strokeWidth={1 + rand() * 1}
        fill="none"
        opacity={0.2 + rand() * 0.2}
        strokeLinecap="round"
      />
    );
  }

  // Temperature indicator on the side
  const thX = w * 0.88;
  const thTop = h * 0.2;
  const thBot = h * 0.75;
  const fillLevel = 0.3 + rand() * 0.5;
  elements.push(
    <Line key="therm" x1={thX} y1={thTop} x2={thX} y2={thBot} stroke="#6F4E37" strokeWidth={3} strokeLinecap="round" />,
    <Line key="therm-fill" x1={thX} y1={thBot} x2={thX} y2={thBot - (thBot - thTop) * fillLevel} stroke="#E25822" strokeWidth={3} strokeLinecap="round" />,
    <Circle key="therm-bulb" cx={thX} cy={thBot + 5} r={5} fill="#E25822" />
  );

  return elements;
}

// Terroir — hillside landscape, soil layers, farm rows
function generateTerroir(rand, w, h) {
  const elements = [];

  // Sky
  elements.push(<Rect key="bg" width={w} height={h} fill="#E8F0FE" />);

  // Rolling hills
  const hillColors = ['#2D6A4F', '#40916C', '#52B788'];
  for (let i = 0; i < 3; i++) {
    const hY = h * (0.3 + i * 0.15);
    const cp1 = w * (0.2 + rand() * 0.2);
    const cp2 = w * (0.6 + rand() * 0.2);
    const color = hillColors[i % hillColors.length];
    elements.push(
      <Path
        key={`hill-${i}`}
        d={`M 0 ${hY + 20 + rand() * 15} Q ${cp1} ${hY - 10 - rand() * 20} ${w * 0.5} ${hY + rand() * 10} Q ${cp2} ${hY - 15 - rand() * 15} ${w} ${hY + 15 + rand() * 10} L ${w} ${h} L 0 ${h} Z`}
        fill={color}
        opacity={0.5 + rand() * 0.3}
      />
    );
  }

  // Soil layer at bottom
  elements.push(
    <Rect key="soil" x={0} y={h * 0.78} width={w} height={h * 0.22} fill="#8B4513" opacity={0.6} />
  );
  // Red soil texture
  for (let i = 0; i < 10; i++) {
    elements.push(
      <Ellipse
        key={`dirt-${i}`}
        cx={rand() * w}
        cy={h * 0.78 + rand() * h * 0.2}
        rx={5 + rand() * 12}
        ry={3 + rand() * 5}
        fill="#A0522D"
        opacity={0.3 + rand() * 0.3}
      />
    );
  }

  // Coffee plant rows
  for (let row = 0; row < 4; row++) {
    const ry = h * (0.45 + row * 0.08);
    for (let col = 0; col < 5 + row; col++) {
      const cx = w * (0.1 + col * (0.8 / (5 + row)));
      const plantSize = 3 + rand() * 4;
      elements.push(
        <Circle key={`plant-${row}-${col}`} cx={cx} cy={ry} r={plantSize} fill="#2D6A4F" opacity={0.5 + rand() * 0.3} />
      );
    }
  }

  return elements;
}

// Harvest — hands picking, baskets, bright farm day
function generateHarvest(rand, w, h) {
  const elements = [];

  // Golden hour sky
  elements.push(<Rect key="bg" width={w} height={h} fill="#FFF3E0" />);

  // Ground
  elements.push(
    <Path key="ground" d={`M 0 ${h * 0.65} Q ${w * 0.3} ${h * 0.6} ${w * 0.6} ${h * 0.63} Q ${w * 0.8} ${h * 0.67} ${w} ${h * 0.62} L ${w} ${h} L 0 ${h} Z`} fill="#6B8E23" opacity={0.5} />
  );

  // Basket
  const basketX = w * (0.3 + rand() * 0.4);
  const basketY = h * 0.68;
  const basketW = 25 + rand() * 15;
  const basketH = 18 + rand() * 8;
  elements.push(
    <Ellipse key="basket-rim" cx={basketX} cy={basketY} rx={basketW} ry={6} fill="#8B6914" opacity={0.7} />,
    <Path key="basket-body" d={`M ${basketX - basketW} ${basketY} Q ${basketX - basketW + 5} ${basketY + basketH} ${basketX} ${basketY + basketH} Q ${basketX + basketW - 5} ${basketY + basketH} ${basketX + basketW} ${basketY} Z`} fill="#C8923C" opacity={0.6} />
  );

  // Cherries in basket
  const cherryColors = ['#C41E3A', '#D62828', '#E63946', '#8B0000'];
  for (let i = 0; i < 12; i++) {
    const cx = basketX + (rand() - 0.5) * basketW * 1.2;
    const cy = basketY - 2 - rand() * 6;
    const r = 2 + rand() * 3;
    elements.push(
      <Circle key={`bc-${i}`} cx={cx} cy={cy} r={r} fill={cherryColors[Math.floor(rand() * cherryColors.length)]} opacity={0.8} />
    );
  }

  // Small trees in background
  for (let i = 0; i < 5; i++) {
    const tx = w * (0.1 + rand() * 0.8);
    const ty = h * (0.35 + rand() * 0.2);
    const treeH = 15 + rand() * 20;
    elements.push(
      <Line key={`trunk-${i}`} x1={tx} y1={ty} x2={tx} y2={ty + treeH} stroke="#5C4033" strokeWidth={1.5} />,
      <Circle key={`canopy-${i}`} cx={tx} cy={ty} r={6 + rand() * 8} fill="#2D6A4F" opacity={0.5 + rand() * 0.3} />
    );
  }

  return elements;
}

const GENERATORS = {
  plant: generatePlant,
  processing: generateProcessing,
  roasting: generateRoasting,
  terroir: generateTerroir,
  harvest: generateHarvest,
};

const STYLE_KEYS = Object.keys(GENERATORS);

export default function RecipeArtCover({ artSeed = 1, artStyle, size = 120 }) {
  const elements = useMemo(() => {
    const rand = seededRandom(artSeed);
    // Pick style from seed if not specified, cycling through farm styles
    const style = artStyle && GENERATORS[artStyle]
      ? artStyle
      : STYLE_KEYS[artSeed % STYLE_KEYS.length];
    const generator = GENERATORS[style];
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
