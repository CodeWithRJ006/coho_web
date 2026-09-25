import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';

const logoPath = path.resolve('public/assets/coho-logo.png');
const originalPath = path.resolve('public/assets/coho-logo-original.png');
const outputPath = logoPath;

// 1. Copy the untouched original before modifying
fs.copyFileSync(logoPath, originalPath);
console.log(`Copied original to ${originalPath}`);

// 2. Load the image
const img = await Jimp.read(logoPath);
console.log(`Loaded image: ${img.getWidth()}x${img.getHeight()}`);

// 3. Find the bounding box of non-transparent, non-white pixels
const { width: w, height: h } = img.bitmap;
let minX = w, minY = h, maxX = 0, maxY = 0;
let found = false;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    const a = img.bitmap.data[idx];
    const r = img.bitmap.data[idx + 1];
    const g = img.bitmap.data[idx + 2];
    const b = img.bitmap.data[idx + 3];

    // Skip fully transparent pixels
    if (a === 0) continue;

    // Treat near-white as transparent padding
    if (r > 245 && g > 245 && b > 245) continue;

    // This is a content pixel
    found = true;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

if (!found) {
  console.error('No content pixels found in the image!');
  process.exit(1);
}

console.log(`Content bbox: x=[${minX},${maxX}] y=[${minY},${maxY}]`);

// 4. Add ~4px margin (instead of the original 2px) and clamp to image bounds
const margin = 4;
const cropX = Math.max(0, minX - margin);
const cropY = Math.max(0, minY - margin);
const cropW = (maxX - minX) + margin * 2;
const cropH = (maxY - minY) + margin * 2;
const finalW = Math.min(cropW, w - cropX);
const finalH = Math.min(cropH, h - cropY);

const cropped = img.crop(cropX, cropY, finalW, finalH);
console.log(`Cropped to: ${finalW}x${finalH} (from ${w}x${h})`);

// 5. Write back to the same path
await cropped.writeAsync(logoPath);
console.log(`Wrote cropped logo to ${logoPath}`);
