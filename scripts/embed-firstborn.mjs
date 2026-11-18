import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'firstborn-hero.webp'));
const output = `// Generated from firstborn-hero.webp by scripts/embed-firstborn.mjs.\n` +
  `document.getElementById('firstborn-hero-image').src = 'data:image/webp;base64,${source.toString('base64')}';\n`;
fs.writeFileSync(path.join(root, 'firstborn-inline.js'), output);
