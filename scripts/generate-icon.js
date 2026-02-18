#!/usr/bin/env node
/**
 * Generate app icon: warm dark brown background, gold coffee flower.
 * Replicates CoffeeFlower.js petal geometry exactly.
 * Colors match the app's espresso crema theme.
 *
 * Usage: node scripts/generate-icon.js
 * Requires: ImageMagick (convert)
 */

const { writeFileSync, unlinkSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Theme colors — espresso crema on dark slate
const BG_COLOR = '#1A1614';        // warm dark brown (Colors.background)
const PETAL_COLOR = '#C8923C';     // crema gold (Colors.primary)
const CENTER_COLOR = '#1A1614';    // dark center dot
const STROKE_COLOR = '#D4A54A';    // lighter gold stroke highlight

function petalPath(cx, cy, length, width, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const perpRad = rad + Math.PI / 2;
  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);
  const bulgeDist = length * 0.4;
  const bulgeX = cx + bulgeDist * Math.cos(rad);
  const bulgeY = cy + bulgeDist * Math.sin(rad);
  const b1x = bulgeX + width * Math.cos(perpRad);
  const b1y = bulgeY + width * Math.sin(perpRad);
  const b2x = bulgeX - width * Math.cos(perpRad);
  const b2y = bulgeY - width * Math.sin(perpRad);
  const tipSpread = width * 0.5;
  const t1x = tipX + tipSpread * Math.cos(perpRad);
  const t1y = tipY + tipSpread * Math.sin(perpRad);
  const t2x = tipX - tipSpread * Math.cos(perpRad);
  const t2y = tipY - tipSpread * Math.sin(perpRad);
  return `M ${cx} ${cy} C ${b1x} ${b1y} ${t1x} ${t1y} ${tipX} ${tipY} C ${t2x} ${t2y} ${b2x} ${b2y} ${cx} ${cy} Z`;
}

function flowerPaths(size) {
  const c = size / 2;
  const outerLen = size * 0.42;
  const outerW = size * 0.16;
  const outerAngles = [0, 72, 144, 216, 288].map(a => a + 36);
  const innerLen = size * 0.28;
  const innerW = size * 0.10;
  const innerAngles = [0, 72, 144, 216, 288].map(a => a + 72);
  const sw = size * 0.008;
  const dotR = size * 0.025;
  const dotSpread = size * 0.045;
  const darkLine = BG_COLOR;

  let svg = '';
  // Outer petals
  for (const a of outerAngles)
    svg += `<path d="${petalPath(c, c, outerLen, outerW, a)}" fill="${PETAL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="${sw}"/>\n`;
  // Inner petals
  for (const a of innerAngles)
    svg += `<path d="${petalPath(c, c, innerLen, innerW, a)}" fill="${PETAL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="${sw * 0.7}"/>\n`;
  // Inner petal dark strokes for visibility
  for (const a of innerAngles)
    svg += `<path d="${petalPath(c, c, innerLen, innerW, a)}" fill="none" stroke="${darkLine}" stroke-width="${sw * 1.2}" opacity="0.6"/>\n`;
  // Dark lines from center to inner petals
  for (const a of innerAngles) {
    const rad = ((a - 90) * Math.PI) / 180;
    const tx = c + innerLen * 0.5 * Math.cos(rad);
    const ty = c + innerLen * 0.5 * Math.sin(rad);
    svg += `<line x1="${c}" y1="${c}" x2="${tx}" y2="${ty}" stroke="${darkLine}" stroke-width="${sw * 0.8}" opacity="0.5"/>\n`;
  }
  // 3 center dots in a triangle
  for (const deg of [0, 120, 240]) {
    const r = (deg * Math.PI) / 180;
    const dx = c + dotSpread * Math.cos(r);
    const dy = c + dotSpread * Math.sin(r);
    svg += `<circle cx="${dx}" cy="${dy}" r="${dotR}" fill="${CENTER_COLOR}" stroke="${STROKE_COLOR}" stroke-width="${sw * 0.7}"/>\n`;
  }
  return svg;
}

const SIZE = 1024;
const flowerSize = 680;
const offset = (SIZE - flowerSize) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG_COLOR}"/>
  <g transform="translate(${offset}, ${offset})">
    ${flowerPaths(flowerSize)}
  </g>
</svg>`;

const svgPath = path.join(ASSETS, 'icon.svg');
const pngPath = path.join(ASSETS, 'icon.png');

writeFileSync(svgPath, svg);
execSync(`convert -background none -density 300 "${svgPath}" -resize 1024x1024 "${pngPath}"`);
unlinkSync(svgPath);
console.log('✓ assets/icon.png (1024x1024) — dark brown bg, gold flower');

// Android adaptive icon — flower smaller to fit 72% safe zone
const adaptiveFlower = 480;
const adaptiveOffset = (SIZE - adaptiveFlower) / 2;
const adaptiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG_COLOR}"/>
  <g transform="translate(${adaptiveOffset}, ${adaptiveOffset})">
    ${flowerPaths(adaptiveFlower)}
  </g>
</svg>`;

const aSvgPath = path.join(ASSETS, 'adaptive-icon.svg');
const aPngPath = path.join(ASSETS, 'adaptive-icon.png');
writeFileSync(aSvgPath, adaptiveSvg);
execSync(`convert -background none -density 300 "${aSvgPath}" -resize 1024x1024 "${aPngPath}"`);
unlinkSync(aSvgPath);
console.log('✓ assets/adaptive-icon.png (1024x1024) — Android adaptive foreground');
