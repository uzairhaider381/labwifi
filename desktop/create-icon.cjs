const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create build directory
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Minimal pure Node PNG generator
function createPng(size) {
  // SVG-like drawing on raw RGBA
  const buffer = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = Math.abs(x - cx);
      const dy = y;

      // Shield boundary
      const topOffset = size * 0.15;
      const bottomOffset = size * 0.85;
      const maxDx = (y < cy) ? size * 0.38 : size * 0.38 * (1 - ((y - cy) / (bottomOffset - cy)) * 0.85);

      if (y >= topOffset && y <= bottomOffset && dx <= maxDx) {
        // Inside shield
        const borderDist = maxDx - dx;
        const isBorder = borderDist < size * 0.04 || y - topOffset < size * 0.04;
        
        if (isBorder) {
          // Electric Cyan Glow Border
          buffer[idx] = 0;
          buffer[idx + 1] = 240;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 255;
        } else {
          // Deep navy & blue gradient fill
          const grad = y / size;
          buffer[idx] = Math.floor(10 + grad * 20);
          buffer[idx + 1] = Math.floor(20 + grad * 80);
          buffer[idx + 2] = Math.floor(60 + grad * 190);
          buffer[idx + 3] = 245;

          // Inner Wi-Fi wave or checkmark
          const distToCenter = Math.sqrt((x - cx) ** 2 + (y - cy * 0.95) ** 2);
          if (
            (distToCenter > size * 0.18 && distToCenter < size * 0.22 && y < cy * 0.95) ||
            (distToCenter > size * 0.28 && distToCenter < size * 0.32 && y < cy * 0.95) ||
            (Math.sqrt((x - cx) ** 2 + (y - cy * 1.15) ** 2) < size * 0.04)
          ) {
            buffer[idx] = 0;
            buffer[idx + 1] = 240;
            buffer[idx + 2] = 255;
            buffer[idx + 3] = 255;
          }
        }
      } else {
        buffer[idx + 3] = 0; // transparent
      }
    }
  }

  return encodePng(size, size, buffer);
}

function encodePng(width, height, rgbaBuffer) {
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT: each scanline starts with filter type 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // filter 0
    rgbaBuffer.copy(scanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc >>> 0, 8 + len);
  return chunk;
}

// Simple CRC32 for PNG
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate sizes
const png256 = createPng(256);
const png128 = createPng(128);
const png64 = createPng(64);
const png48 = createPng(48);
const png32 = createPng(32);
const png16 = createPng(16);

// Write PNG
fs.writeFileSync(path.join(buildDir, 'icon.png'), png256);
console.log('Saved build/icon.png');

// Assemble ICO from PNGs (256, 128, 64, 48, 32, 16)
const images = [
  { size: 256, data: png256 },
  { size: 128, data: png128 },
  { size: 64, data: png64 },
  { size: 48, data: png48 },
  { size: 32, data: png32 },
  { size: 16, data: png16 },
];

const count = images.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // ICO
header.writeUInt16LE(count, 4); // count

const dirEntries = [];
let offset = 6 + count * 16;

for (const img of images) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // width (0 = 256)
  entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // height
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(img.data.length, 8); // size
  entry.writeUInt32LE(offset, 12); // offset
  dirEntries.push(entry);
  offset += img.data.length;
}

const icoBuffer = Buffer.concat([header, ...dirEntries, ...images.map(i => i.data)]);
fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
console.log('Saved build/icon.ico successfully with multi-resolution bitmaps!');
