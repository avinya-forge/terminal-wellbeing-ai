/**
 * generate-pwa-icons.mjs  (ESM - works with "type": "module" projects)
 * Generates required PWA icon PNGs from an inline SVG definition using sharp.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// The SVG icon for WellBeing.sh — terminal prompt + heart motif
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="80" ry="80" fill="#0d1117"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="#22c55e" stroke-width="6" opacity="0.3"/>
  <text x="256" y="310" font-family="monospace" font-size="200" font-weight="bold"
    text-anchor="middle" fill="#22c55e" opacity="0.9">&#x3E;</text>
  <rect x="270" y="330" width="65" height="14" rx="3" fill="#22c55e" opacity="0.8"/>
</svg>`;

// Monochrome masked icon for Safari pinned tabs
const maskedSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="black"/>
  <text x="256" y="330" font-family="monospace" font-size="220" font-weight="bold"
    text-anchor="middle" fill="white">&#x3E;</text>
  <rect x="275" y="350" width="70" height="14" rx="3" fill="white"/>
</svg>`;

// Try to load sharp, install if missing
let sharp;
try {
    const { default: s } = await import('sharp');
    sharp = s;
} catch {
    console.log('📦 Installing sharp...');
    execSync('npm install --save-dev sharp', { stdio: 'inherit', cwd: join(__dirname, '..') });
    const { default: s } = await import('sharp');
    sharp = s;
}

const svgBuffer = Buffer.from(svgIcon);

await sharp(svgBuffer).resize(192, 192).png().toFile(join(publicDir, 'pwa-192x192.png'));
console.log('✅ public/pwa-192x192.png');

await sharp(svgBuffer).resize(512, 512).png().toFile(join(publicDir, 'pwa-512x512.png'));
console.log('✅ public/pwa-512x512.png');

await sharp(svgBuffer).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('✅ public/apple-touch-icon.png');

writeFileSync(join(publicDir, 'masked-icon.svg'), maskedSvgIcon, 'utf-8');
console.log('✅ public/masked-icon.svg');

console.log('\n🎉 All PWA icon assets generated!');
