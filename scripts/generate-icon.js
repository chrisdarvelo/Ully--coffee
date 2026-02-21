#!/usr/bin/env node
/**
 * Generate high-res branding assets: icon.png, adaptive-icon.png, splash.png
 * Updated to the Signature organic blossom design.
 */

const { writeFileSync, unlinkSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Theme colors
const BG_COLOR = '#0E0C0A';
const PETAL_COLOR = '#FFFFFF';
const GOLD_COLOR = '#C8923C';

function getFlowerSvg(size) {
  const scale = size / 200;
  const petalPath = "M100,100 C115,80 140,65 100,15 C60,65 85,80 100,100 Z";
  const veinPath = "M100,100 L100,45";
  
  let content = '';
  
  // 6 Petals with Veins
  [0, 60, 120, 180, 240, 300].forEach(angle => {
    content += `
      <g transform="rotate(${angle}, 100, 100)">
        <path d="${petalPath}" fill="${PETAL_COLOR}" fill-opacity="0.98" stroke="${GOLD_COLOR}" stroke-width="1" />
        <path d="${veinPath}" stroke="${GOLD_COLOR}" stroke-width="0.5" stroke-opacity="0.5" />
      </g>`;
  });

  // Stamen dots
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(angle => {
    const rad = (angle * Math.PI) / 180;
    const cx = 100 + 16 * Math.cos(rad);
    const cy = 100 + 16 * Math.sin(rad);
    content += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${GOLD_COLOR}" />\n`;
  });

  return `
    <g transform="scale(${scale})">
      ${content}
      <circle cx="100" cy="100" r="8" fill="${GOLD_COLOR}" />
      <circle cx="100" cy="100" r="3" fill="${BG_COLOR}" />
    </g>
  `;
}

function generateAsset(name, size, flowerSize, bgColor = BG_COLOR) {
  const offset = (size - flowerSize) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <g transform="translate(${offset}, ${offset})">
      ${getFlowerSvg(flowerSize)}
    </g>
  </svg>`;

  const tempSvg = path.join(ASSETS, `${name}.svg`);
  const targetPng = path.join(ASSETS, `${name}.png`);

  writeFileSync(tempSvg, svg);
  try {
    execSync(`magick -background none -density 300 "${tempSvg}" "${targetPng}"`);
    console.log(`✓ assets/${name}.png generated (${size}x${size})`);
  } catch (err) {
    console.error(`Error generating ${name}:`, err.message);
  } finally {
    unlinkSync(tempSvg);
  }
}

console.log('Generating Signature branding assets...');
generateAsset('icon', 1024, 720);
generateAsset('adaptive-icon', 1024, 520);
generateAsset('splash', 2048, 650);
console.log('\nIdentity assets updated.');
