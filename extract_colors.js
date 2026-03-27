const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function extractSwatches(imagePath) {
  const img = sharp(imagePath);
  const meta = await img.metadata();
  const { width, height } = meta;
  const raw = await img.raw().toBuffer();
  const channels = meta.channels;

  // Get pixel color at (x, y)
  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
  }

  function isWhiteish(c) {
    return c.r > 235 && c.g > 235 && c.b > 235;
  }

  function toHex(c) {
    return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join('');
  }

  // Scan horizontally to find swatch columns
  // Scan the image to find non-white rectangular regions
  // Strategy: scan rows and columns to find swatch boundaries

  // Find horizontal runs of non-white pixels along a scan line
  // We'll scan multiple lines and cluster

  // First, find row bands (groups of rows that have swatches)
  const rowHasColor = [];
  for (let y = 0; y < height; y++) {
    let hasColor = false;
    for (let x = 0; x < width; x += 2) {
      if (!isWhiteish(getPixel(x, y))) {
        hasColor = true;
        break;
      }
    }
    rowHasColor.push(hasColor);
  }

  // Find row bands
  const rowBands = [];
  let inBand = false;
  let bandStart = 0;
  for (let y = 0; y < height; y++) {
    if (rowHasColor[y] && !inBand) {
      inBand = true;
      bandStart = y;
    } else if (!rowHasColor[y] && inBand) {
      inBand = false;
      if (y - bandStart > 5) { // minimum height
        rowBands.push({ start: bandStart, end: y - 1 });
      }
    }
  }
  if (inBand) {
    rowBands.push({ start: bandStart, end: height - 1 });
  }

  const combos = [];

  for (const band of rowBands) {
    const midY = Math.floor((band.start + band.end) / 2);

    // Scan horizontally to find swatch segments in this row
    const colHasColor = [];
    for (let x = 0; x < width; x++) {
      colHasColor.push(!isWhiteish(getPixel(x, midY)));
    }

    // Find horizontal segments (groups of columns with color)
    const segments = [];
    let inSeg = false;
    let segStart = 0;
    for (let x = 0; x < width; x++) {
      if (colHasColor[x] && !inSeg) {
        inSeg = true;
        segStart = x;
      } else if (!colHasColor[x] && inSeg) {
        inSeg = false;
        if (x - segStart > 5) {
          segments.push({ start: segStart, end: x - 1 });
        }
      }
    }
    if (inSeg) {
      segments.push({ start: segStart, end: width - 1 });
    }

    // Group adjacent segments into combo blocks
    // Segments very close together (< 3px gap) are within same swatch block
    // Segments with bigger gaps are separate combos
    const comboBlocks = [];
    let currentBlock = [];
    for (let i = 0; i < segments.length; i++) {
      if (currentBlock.length === 0) {
        currentBlock.push(segments[i]);
      } else {
        const gap = segments[i].start - currentBlock[currentBlock.length - 1].end;
        if (gap < 10) {
          // Same combo block (small gap might be anti-aliasing/border)
          currentBlock.push(segments[i]);
        } else {
          comboBlocks.push(currentBlock);
          currentBlock = [segments[i]];
        }
      }
    }
    if (currentBlock.length > 0) {
      comboBlocks.push(currentBlock);
    }

    // For each combo block, determine the colors
    for (const block of comboBlocks) {
      // Merge all segments in this block to get full extent
      const blockStart = block[0].start;
      const blockEnd = block[block.length - 1].end;
      const blockWidth = blockEnd - blockStart + 1;

      // If there are clearly separate segments within the block, each segment is a color
      if (block.length >= 2) {
        const colors = block.map(seg => {
          const cx = Math.floor((seg.start + seg.end) / 2);
          const cy = midY;
          return getPixel(cx, cy);
        });
        combos.push(colors.map(toHex));
      } else {
        // Single continuous segment - there might be 2 or 3 colors side by side
        // Sample at 1/4, 1/2, 3/4 and see if colors differ
        const seg = block[0];
        const segWidth = seg.end - seg.start + 1;

        // Sample at multiple points
        const samplePoints = [];
        const numSamples = 20;
        for (let i = 0; i < numSamples; i++) {
          const x = seg.start + Math.floor(segWidth * (i + 0.5) / numSamples);
          samplePoints.push({ x, color: getPixel(x, midY) });
        }

        // Detect color boundaries
        function colorDist(c1, c2) {
          return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
        }

        const colorGroups = [{ start: 0, color: samplePoints[0].color }];
        for (let i = 1; i < samplePoints.length; i++) {
          if (colorDist(samplePoints[i].color, colorGroups[colorGroups.length - 1].color) > 30) {
            colorGroups.push({ start: i, color: samplePoints[i].color });
          }
        }

        if (colorGroups.length >= 2) {
          combos.push(colorGroups.map(g => toHex(g.color)));
        } else if (segWidth > 50) {
          // Likely a single big swatch - sample left and right halves
          const leftColor = getPixel(seg.start + Math.floor(segWidth * 0.25), midY);
          const rightColor = getPixel(seg.start + Math.floor(segWidth * 0.75), midY);
          if (colorDist(leftColor, rightColor) > 30) {
            combos.push([toHex(leftColor), toHex(rightColor)]);
          } else {
            combos.push([toHex(leftColor)]);
          }
        }
      }
    }
  }

  return combos;
}

async function main() {
  const folder = path.join(__dirname, 'JapaneseColorCombos');
  const files = fs.readdirSync(folder)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  const allCombos = {};
  for (const file of files) {
    const filePath = path.join(folder, file);
    console.log(`Processing ${file}...`);
    const combos = await extractSwatches(filePath);
    allCombos[file] = combos;
    console.log(`  Found ${combos.length} combos`);
  }

  // Output as JSON for review
  console.log(JSON.stringify(allCombos, null, 2));
}

main().catch(console.error);
