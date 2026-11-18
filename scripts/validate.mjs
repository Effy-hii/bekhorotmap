import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
const errors = [];

for (const reference of references) {
  if (reference.startsWith('#')) {
    if (!ids.has(reference.slice(1))) errors.push(`Missing anchor: ${reference}`);
    continue;
  }
  if (/^(?:https?:\/\/|data:)/.test(reference)) continue;
  const file = reference.split(/[?#]/)[0];
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing file: ${file}`);
}

for (const css of fs.readdirSync(root).filter(file => file.endsWith('.css'))) {
  const text = fs.readFileSync(path.join(root, css), 'utf8');
  for (const match of text.matchAll(/url\(['"]?([^)'"\s]+)/g)) {
    const asset = match[1];
    if (!asset.startsWith('data:') && !/^https?:\/\//.test(asset) && !fs.existsSync(path.join(root, asset))) {
      errors.push(`Missing CSS asset: ${css} → ${asset}`);
    }
  }
}

const expansion = fs.readFileSync(path.join(root, 'chapter-expansion.js'), 'utf8');
for (const match of expansion.matchAll(/\bsrc: '([^']+)'/g)) {
  if (!fs.existsSync(path.join(root, match[1]))) errors.push(`Missing chapter image: ${match[1]}`);
}

const stationCount = [...html.matchAll(/\bdata-screen\b/g)].length;
if (stationCount !== 9) errors.push(`Expected 9 stations, found ${stationCount}`);
if (!html.includes('id="firstborn-hero-image"')) errors.push('Missing embedded firstborn illustration');
const sourceImage = fs.readFileSync(path.join(root, 'firstborn-hero.webp')).toString('base64');
if (!html.includes(sourceImage)) errors.push('Embedded firstborn illustration differs from its source image');
if (!references.includes('https://wa.me/972536228498')) errors.push('Missing WhatsApp contact link');
if (references.some(reference => reference.startsWith('../'))) errors.push('A link still points outside this site');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${stationCount} stations and ${references.length} references.`);
}
