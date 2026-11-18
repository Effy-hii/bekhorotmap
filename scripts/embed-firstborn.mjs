import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'firstborn-hero.webp'));
const indexPath = path.join(root, 'index.html');
const imageUri = `data:image/webp;base64,${source.toString('base64')}`;
const index = fs.readFileSync(indexPath, 'utf8');
const updated = index.replace(
  /(<img id="firstborn-hero-image" src=")[^"]+(" width="1536")/,
  `$1${imageUri}$2`,
);

if (updated === index) throw new Error('Could not find the firstborn illustration in index.html');
fs.writeFileSync(indexPath, updated);
