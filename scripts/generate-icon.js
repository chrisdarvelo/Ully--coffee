#!/usr/bin/env node
/**
 * Generate app icon: dark brown background, white coffee blossom with gold stamens.
 * Matches the new CoffeeFlower.js Coffea arabica blossom design.
 *
 * Usage: node scripts/generate-icon.js
 * Requires: ImageMagick (convert)
 */

const { writeFileSync, unlinkSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Theme colors
const BG_COLOR = '#0E0C0A';       // deep warm dark brown
const PETAL_COLOR = '#FFFFFF';    // white petals
const STAMEN_COLOR = '#C8A830';   // gold stamen filaments
const ANTHER_COLOR = '#D4B840';   // brighter gold anther tips
const CENTER_COLOR = '#FFFEF5';   // cream pistil

// Coffee blossom petal: emerges narrow from center, flares wide at 55%, tapers to tip.
function coffeePetalPath(cx, cy, length, maxWidth, baseWidth, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const perpRad = rad + Math.PI / 2;

  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);

  const baseDist = length * 0.14;
  const baseMidX = cx + baseDist * Math.cos(rad);
  const baseMidY = cy + baseDist * Math.sin(rad);

  const wideDist = length * 0.55;
  const wideMidX = cx + wideDist * Math.cos(rad);
  const wideMidY = cy + wideDist * Math.sin(rad);

  const rc1x = baseMidX + baseWidth * Math.cos(perpRad);
  const rc1y = baseMidY + baseWidth * Math.sin(perpRad);
  const rc2x = wideMidX + maxWidth * Math.cos(perpRad);
  const rc2y = wideMidY + maxWidth * Math.sin(perpRad);

  const lc1x = wideMidX - maxWidth * Math.cos(perpRad);
  const lc1y = wideMidY - maxWidth * Math.sin(perpRad);
  const lc2x = baseMidX - baseWidth * Math.cos(perpRad);
  const lc2y = baseMidY - baseWidth * Math.sin(perpRad);

  return `M ${cx} ${cy} C ${rc1x} ${rc1y} ${rc2x} ${rc2y} ${tipX} ${tipY} C ${lc1x} ${lc1y} ${lc2x} ${lc2y} ${cx} ${cy} Z`;
}

function blossomPaths(size) {
  const c = size / 2;
  const petalLen = size * 0.45;
  const petalMax = size * 0.085;
  const petalBase = size * 0.018;
  const petalAngles = [0, 60, 120, 180, 240, 300];

  const stamenLen = size * 0.30;
  const stamenAngles = [30, 90, 150, 210, 270, 330];
  const antherR = size * 0.013;
  const centerR = size * 0.042;
  const sw = size * 0.004;
  const stamenW = size * 0.008;

  let svg = '';

  // 6 white petals
  for (const a of petalAngles) {
    svg += `<path d="${coffeePetalPath(c, c, petalLen, petalMax, petalBase, a)}" fill="${PETAL_COLOR}" stroke="rgba(180,170,160,0.15)" stroke-width="${sw}"/>\n`;
  }

  // 6 gold stamens
  for (const a of stamenAngles) {
    const rad = ((a - 90) * Math.PI) / 180;
    const tx = c + stamenLen * Math.cos(rad);
    const ty = c + stamenLen * Math.sin(rad);
    svg += `<line x1="${c}" y1="${c}" x2="${tx}" y2="${ty}" stroke="${STAMEN_COLOR}" stroke-width="${stamenW}"/>\n`;
    svg += `<circle cx="${tx}" cy="${ty}" r="${antherR}" fill="${ANTHER_COLOR}"/>\n`;
  }

  // Cream center pistil
  svg += `<circle cx="${c}" cy="${c}" r="${centerR}" fill="${CENTER_COLOR}" stroke="${STAMEN_COLOR}" stroke-width="${sw * 0.5}"/>\n`;

  return svg;
}

const SIZE = 1024;
const flowerSize = 680;
const offset = (SIZE - flowerSize) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG_COLOR}"/>
  <g transform="translate(${offset}, ${offset})">
    ${blossomPaths(flowerSize)}
  </g>
</svg>`;

const svgPath = path.join(ASSETS, 'icon.svg');
const pngPath = path.join(ASSETS, 'icon.png');

writeFileSync(svgPath, svg);
execSync(`convert -background none -density 300 "${svgPath}" -resize 1024x1024 "${pngPath}"`);
unlinkSync(svgPath);
console.log('✓ assets/icon.png (1024x1024) — dark brown bg, white coffee blossom');

// Android adaptive icon — flower smaller to fit 72% safe zone
const adaptiveFlower = 480;
const adaptiveOffset = (SIZE - adaptiveFlower) / 2;
const adaptiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG_COLOR}"/>
  <g transform="translate(${adaptiveOffset}, ${adaptiveOffset})">
    ${blossomPaths(adaptiveFlower)}
  </g>
</svg>`;

const aSvgPath = path.join(ASSETS, 'adaptive-icon.svg');
const aPngPath = path.join(ASSETS, 'adaptive-icon.png');
writeFileSync(aSvgPath, adaptiveSvg);
execSync(`convert -background none -density 300 "${aSvgPath}" -resize 1024x1024 "${aPngPath}"`);
unlinkSync(aSvgPath);
console.log('✓ assets/adaptive-icon.png (1024x1024) — Android adaptive foreground');
