#!/usr/bin/env node
/**
 * Generate app icon: black background, white coffee flower.
 * Replicates CoffeeFlower.js petal geometry exactly.
 *
 * Usage: node scripts/generate-icon.js
 * Requires: ImageMagick (convert)
 */

const { writeFileSync, unlinkSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

function petalPath(cx, cy, length, width, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);
  const perpRad = rad + Math.PI / 2;
  const cpDist = length * 0.45;
  const cpX = cx + cpDist * Math.cos(rad);
  const cpY = cy + cpDist * Math.sin(rad);
  const cp1x = cpX + width * Math.cos(perpRad);
  const cp1y = cpY + width * Math.sin(perpRad);
  const cp2x = cpX - width * Math.cos(perpRad);
  const cp2y = cpY - width * Math.sin(perpRad);
  return `M ${cx} ${cy} Q ${cp1x} ${cp1y} ${tipX} ${tipY} Q ${cp2x} ${cp2y} ${cx} ${cy} Z`;
}

function flowerPaths(size) {
  const c = size / 2;
  const outerLen = size * 0.42;
  const outerW = size * 0.16;
  const outerAngles = [0, 72, 144, 216, 288].map(a => a + 36);
  const innerLen = size * 0.28;
  const innerW = size * 0.06;
  const innerAngles = [0, 72, 144, 216, 288].map(a => a + 72);
  const cr = size * 0.035;
  const sw = size * 0.008;

  let svg = '';
  // Outer petals
  for (const a of outerAngles)
    svg += `<path d="${petalPath(c, c, outerLen, outerW, a)}" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="${sw}"/>\n`;
  // Inner petals
  for (const a of innerAngles)
    svg += `<path d="${petalPath(c, c, innerLen, innerW, a)}" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="${sw * 0.7}"/>\n`;
  // Center dot
  svg += `<circle cx="${c}" cy="${c}" r="${cr}" fill="#000000" stroke="#FFFFFF" stroke-width="${sw * 0.7}"/>\n`;
  return svg;
}

const SIZE = 1024;
const flowerSize = 680;
const offset = (SIZE - flowerSize) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#000000"/>
  <g transform="translate(${offset}, ${offset})">
    ${flowerPaths(flowerSize)}
  </g>
</svg>`;

const svgPath = path.join(ASSETS, 'icon.svg');
const pngPath = path.join(ASSETS, 'icon.png');

writeFileSync(svgPath, svg);
execSync(`convert -background none -density 300 "${svgPath}" -resize 1024x1024 "${pngPath}"`);
unlinkSync(svgPath);
console.log('✓ assets/icon.png (1024x1024) — black bg, white flower');

// Android adaptive icon — flower smaller to fit 72% safe zone
const adaptiveFlower = 480;
const adaptiveOffset = (SIZE - adaptiveFlower) / 2;
const adaptiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#000000"/>
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
