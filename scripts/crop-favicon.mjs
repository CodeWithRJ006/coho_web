import Jimp from 'jimp';

const logoPath = 'public/assets/coho-logo.png';
const faviconPath = 'public/favicon.png';

// Load the logo
const img = await Jimp.read(logoPath);
const { width, height } = img.bitmap;
console.log(`Logo: ${width}x${height}`);

// Find the bounding box of non-transparent pixels (the logo content)
let minX = width, minY = height, maxX = 0, maxY = 0;
let found = false;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const a = img.bitmap.data[idx];
    if (a === 0) continue;

    // Skip near-white (padding)
    if (img.bitmap.data[idx + 1] > 245 && img.bitmap.data[idx + 2] > 245 && img.bitmap.data[idx + 3] > 245) continue;

    found = true;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

if (!found) {
  console.error('No content pixels found!');
  process.exit(1);
}

console.log(`Content bbox: x=[${minX},${maxX}] y=[${minY},${maxY}]`);

// Crop just the top portion — the astronaut's head is in the top half of the logo
// The logo is 1320 tall; the head is roughly in the upper 30-45% of the image
// y range: 186 to 1173, so head is around y=186 to ~550
const headTop = minY;
const headBottom = Math.min(height, Math.round(minY + (maxY - minY) * 0.35));
const cropY = headTop;
const cropH = headBottom - headTop;

// Also crop the width to a ~256 square centered on the head
const cropX = Math.round((width - 256) / 2);
const cropW = 256;

const head = img.clone();
head.crop(cropX, cropY, cropW, cropH);

// Resize to exactly 256x256
const favicon = head.resize(256, 256);

await favicon.writeAsync(faviconPath);
console.log(`Wrote favicon to ${faviconPath}: ${favicon.getWidth()}x${favicon.getHeight()}`);
