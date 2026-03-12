#!/usr/bin/env node

/**
 * Optimise et convertit une image en WebP.
 *
 * Usage :
 *   node scripts/optimize-image.mjs <input> [output] [--quality 85] [--width 800]
 *
 * Exemples :
 *   node scripts/optimize-image.mjs photo.jpg                    → photo.webp (qualite 85)
 *   node scripts/optimize-image.mjs photo.jpg photo-opt.webp     → photo-opt.webp
 *   node scripts/optimize-image.mjs photo.jpg --quality 75 --width 600
 */

import sharp from 'sharp';
import { resolve, basename, dirname, extname } from 'path';
import { stat } from 'fs/promises';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  console.log('Usage: node scripts/optimize-image.mjs <input> [output] [--quality N] [--width N]');
  process.exit(0);
}

// Parse args
let quality = 85;
let width = null;

const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--quality' && args[i + 1]) {
    quality = parseInt(args[++i], 10);
  } else if (args[i] === '--width' && args[i + 1]) {
    width = parseInt(args[++i], 10);
  } else {
    positional.push(args[i]);
  }
}

const input = resolve(positional[0]);
const output = positional[1]
  ? resolve(positional[1])
  : resolve(dirname(input), basename(input, extname(input)) + '.webp');

// Process
const inputStats = await stat(input);
let pipeline = sharp(input);

if (width) {
  pipeline = pipeline.resize({ width, withoutEnlargement: true });
}

pipeline = pipeline.webp({ quality });

await pipeline.toFile(output);

const outputStats = await stat(output);
const saved = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

console.log(`${basename(input)} → ${basename(output)}`);
console.log(`  ${(inputStats.size / 1024).toFixed(0)} Ko → ${(outputStats.size / 1024).toFixed(0)} Ko (-${saved}%)`);
if (width) console.log(`  Redimensionne a ${width}px de large`);
console.log(`  Qualite WebP : ${quality}`);
