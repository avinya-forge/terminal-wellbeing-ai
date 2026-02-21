/**
 * generate-pwa-icons.js
 * Generates required PWA icon PNGs from an inline SVG definition.
 * Run: node scripts/generate-pwa-icons.js
 *
 * Requires: npm install --save-dev sharp  (only for this script)
 */
const fs = require('fs');
const path = require('path');

// The SVG icon for WellBeing.sh — terminal prompt + heart motif
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Background -->
  <rect width="512" height="512" rx="80" ry="80" fill="#0d1117"/>
  <!-- Outer glow ring -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#22c55e" stroke-width="6" opacity="0.3"/>
  <!-- Terminal prompt ">" -->
  <text x="256" y="290" font-family="monospace" font-size="180" font-weight="bold"
    text-anchor="middle" fill="#22c55e" opacity="0.9">&gt;</text>
  <!-- Blink cursor underline -->
  <rect x="280" y="310" width="60" height="12" rx="3" fill="#22c55e" opacity="0.8"/>
  <!-- Small heart decoration bottom-right -->
  <text x="390" y="430" font-family="monospace" font-size="60" text-anchor="middle" fill="#4ade80" opacity="0.6">&#x2665;</text>
</svg>`;

// Masked icon (monochrome for Safari) -- simple terminal prompt
const maskedSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="black"/>
  <text x="256" y="310" font-family="monospace" font-size="200" font-weight="bold"
    text-anchor="middle" fill="white">&gt;</text>
  <rect x="280" y="330" width="70" height="14" rx="3" fill="white"/>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch {
    console.log('\n🔴 "sharp" package not found. Installing...');
    const { execSync } = require('child_process');
    try {
        execSync('npm install --save-dev sharp', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        sharp = require('sharp');
        console.log('✅ sharp installed.\n');
    } catch (e) {
        console.error('❌ Failed to install sharp. Please run: npm install --save-dev sharp');
        process.exit(1);
    }
}

async function generateIcons() {
    const svgBuffer = Buffer.from(svgIcon);
    const maskedBuffer = Buffer.from(maskedSvgIcon);

    // pwa-192x192.png
    await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
    console.log('✅ Generated public/pwa-192x192.png');

    // pwa-512x512.png
    await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
    console.log('✅ Generated public/pwa-512x512.png');

    // apple-touch-icon.png (180x180)
    await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated public/apple-touch-icon.png');

    // masked-icon.svg (saved as SVG directly)
    fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), maskedSvgIcon, 'utf-8');
    console.log('✅ Generated public/masked-icon.svg');

    console.log('\n🎉 All PWA icons generated successfully!');
}

generateIcons().catch(err => {
    console.error('❌ Icon generation failed:', err.message);
    process.exit(1);
});
