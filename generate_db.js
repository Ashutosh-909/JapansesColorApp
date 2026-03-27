const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function extractSwatches(imagePath) {
  const img = sharp(imagePath);
  const meta = await img.metadata();
  const { width, height } = meta;
  const raw = await img.raw().toBuffer();
  const channels = meta.channels;

  function getPixel(x, y) {
    x = Math.max(0, Math.min(width - 1, x));
    y = Math.max(0, Math.min(height - 1, y));
    const idx = (y * width + x) * channels;
    return { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
  }

  function isWhiteish(c) {
    return c.r > 235 && c.g > 235 && c.b > 235;
  }

  function toHex(c) {
    return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join('');
  }

  function colorDist(c1, c2) {
    return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
  }

  // Find row bands (horizontal strips of non-white)
  const rowHasColor = [];
  for (let y = 0; y < height; y++) {
    let hasColor = false;
    for (let x = 0; x < width; x += 2) {
      if (!isWhiteish(getPixel(x, y))) { hasColor = true; break; }
    }
    rowHasColor.push(hasColor);
  }

  const rowBands = [];
  let inBand = false, bandStart = 0;
  for (let y = 0; y < height; y++) {
    if (rowHasColor[y] && !inBand) { inBand = true; bandStart = y; }
    else if (!rowHasColor[y] && inBand) {
      inBand = false;
      if (y - bandStart > 10) rowBands.push({ start: bandStart, end: y - 1 });
    }
  }
  if (inBand && height - bandStart > 10) rowBands.push({ start: bandStart, end: height - 1 });

  const combos = [];

  for (const band of rowBands) {
    const bandHeight = band.end - band.start + 1;
    const midY = Math.floor(band.start + bandHeight * 0.5);

    // Find contiguous color segments on scan line
    const segments = [];
    let inSeg = false, segStart = 0;
    for (let x = 0; x < width; x++) {
      const pix = getPixel(x, midY);
      const isWhite = isWhiteish(pix);
      if (!isWhite && !inSeg) { inSeg = true; segStart = x; }
      else if (isWhite && inSeg) {
        inSeg = false;
        if (x - segStart > 8) segments.push({ start: segStart, end: x - 1 });
      }
    }
    if (inSeg && width - segStart > 8) segments.push({ start: segStart, end: width - 1 });

    // Group close segments into combo blocks (gap > 15px = new combo)
    const comboBlocks = [];
    let currentBlock = [];
    for (let i = 0; i < segments.length; i++) {
      if (currentBlock.length === 0) {
        currentBlock.push(segments[i]);
      } else {
        const gap = segments[i].start - currentBlock[currentBlock.length - 1].end;
        if (gap > 15) {
          comboBlocks.push([...currentBlock]);
          currentBlock = [segments[i]];
        } else {
          currentBlock.push(segments[i]);
        }
      }
    }
    if (currentBlock.length > 0) comboBlocks.push(currentBlock);

    for (const block of comboBlocks) {
      const blockColors = [];

      for (const seg of block) {
        const segWidth = seg.end - seg.start + 1;
        // Sample well inside segment to avoid anti-aliased edges
        const inset = Math.max(4, Math.floor(segWidth * 0.15));
        const cx = Math.floor((seg.start + inset + seg.end - inset) / 2);
        const color = getPixel(cx, midY);

        // Deduplicate near-identical colors (anti-aliasing artifacts)
        const isDuplicate = blockColors.some(c => colorDist(color, c) < 40);
        if (!isDuplicate) {
          blockColors.push(color);
        }
      }

      if (blockColors.length >= 2) {
        combos.push(blockColors.map(toHex));
      } else if (block.length === 1) {
        // Single wide segment, might contain 2-3 colors side by side
        const seg = block[0];
        const segWidth = seg.end - seg.start + 1;
        if (segWidth < 30) continue;

        const inset = Math.max(5, Math.floor(segWidth * 0.08));
        const innerStart = seg.start + inset;
        const innerEnd = seg.end - inset;
        const innerWidth = innerEnd - innerStart;

        const samples = [];
        const numSamples = 30;
        for (let i = 0; i < numSamples; i++) {
          const x = innerStart + Math.floor(innerWidth * i / (numSamples - 1));
          samples.push({ x, color: getPixel(x, midY) });
        }

        // Find color transitions with strong threshold
        const detected = [samples[0].color];
        for (let i = 1; i < samples.length; i++) {
          if (colorDist(samples[i].color, detected[detected.length - 1]) > 50) {
            if (i + 1 < samples.length && colorDist(samples[i + 1].color, samples[i].color) < 30) {
              detected.push(samples[i].color);
            } else if (i + 1 >= samples.length) {
              detected.push(samples[i].color);
            }
          }
        }

        if (detected.length >= 2) {
          combos.push(detected.map(toHex));
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
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  let md = `# Japanese Color Combinations Database\n\n`;
  md += `> Extracted from ${files.length} image files in the JapaneseColorCombos folder.\n\n`;
  md += `---\n\n`;

  let globalIdx = 0;
  const jsonData = { sets: [], totalCombinations: 0 };

  for (const file of files) {
    const filePath = path.join(folder, file);
    const combos = await extractSwatches(filePath);
    const imageNum = file.match(/\d+/)[0];

    // Build JSON set
    const jsonSet = {
      id: parseInt(imageNum),
      source: file,
      combinations: combos.map((colors, idx) => ({
        id: idx + 1,
        colors
      }))
    };
    jsonData.sets.push(jsonSet);

    md += `## Set ${imageNum} — ${file}\n\n`;

    // Determine max colors in this set for column headers
    const maxColors = Math.max(...combos.map(c => c.length));
    const headerCols = [];
    for (let i = 1; i <= maxColors; i++) headerCols.push(`Color ${i}`);

    md += `| # |` + headerCols.map(h => ` ${h} `).join('|') + `|\n`;
    md += `|---:` + '|:---:'.repeat(maxColors) + `|\n`;

    combos.forEach((combo, idx) => {
      globalIdx++;
      const cols = [];
      for (let i = 0; i < maxColors; i++) {
        cols.push(combo[i] ? ` \`${combo[i]}\` ` : ` — `);
      }
      md += `| ${idx + 1} ` + cols.map(c => `|${c}`).join('') + `|\n`;
    });

    md += `\n*${combos.length} combinations*\n\n---\n\n`;
  }

  jsonData.totalCombinations = globalIdx;

  md += `## Summary\n\n`;
  md += `**Total Color Combinations: ${globalIdx}**\n`;

  fs.writeFileSync(path.join(__dirname, 'JapaneseColorCombos_Database.md'), md, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'JapaneseColorCombos_Database.json'), JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`Done! Wrote ${globalIdx} total combos to .md and .json`);
}

main().catch(console.error);
