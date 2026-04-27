import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');

let failed = false;

function fail(msg) {
  console.error('VERIFY FAILED:', msg);
  failed = true;
}

// 1. index.html must exist
const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) {
  fail('dist/index.html does not exist');
  process.exit(1);
}
const html = fs.readFileSync(indexPath, 'utf8');

// 2. Every asset referenced in index.html must exist in dist/
const assetRefs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(m => m[1]);
for (const ref of assetRefs) {
  const file = path.join(dist, ref);
  if (!fs.existsSync(file)) {
    fail(`index.html references ${ref} but ${file} does not exist`);
  }
}

// 3. dist/sw.js must exist and be valid (no unresolved placeholder)
const swPath = path.join(dist, 'sw.js');
if (!fs.existsSync(swPath)) {
  fail('dist/sw.js does not exist');
} else {
  const sw = fs.readFileSync(swPath, 'utf8');
  if (sw.includes('__BUILD_TIMESTAMP__')) {
    fail('dist/sw.js still contains the __BUILD_TIMESTAMP__ placeholder — stamp-sw plugin did not run');
  }
  const cacheMatch = sw.match(/const CACHE = 'mt-(\S+?)'/);
  if (!cacheMatch) {
    fail("dist/sw.js does not contain a valid CACHE declaration");
  } else if (!/^\d{10,}$/.test(cacheMatch[1])) {
    fail(`dist/sw.js cache name 'mt-${cacheMatch[1]}' is not a valid timestamp — expected mt-<10+ digits>, got mt-${cacheMatch[1]}`);
  }
}

// 4. If SENTRY_AUTH_TOKEN is set, source maps must have been deleted by the plugin.
//    If not set, source maps should exist (upload was skipped — that's fine locally).
if (process.env.SENTRY_AUTH_TOKEN) {
  const maps = assetRefs.map(r => path.join(dist, r + '.map')).filter(fs.existsSync);
  if (maps.length > 0) {
    fail(`Source maps were not deleted after Sentry upload: ${maps.join(', ')}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('dist verification passed.');
console.log('  index.html references:', assetRefs.join(', ') || '(none)');
const swLine = fs.readFileSync(path.join(dist, 'sw.js'), 'utf8').split('\n')[0];
console.log('  sw.js cache:', swLine);
const hasMaps = assetRefs.some(r => fs.existsSync(path.join(dist, r + '.map')));
console.log('  source maps:', process.env.SENTRY_AUTH_TOKEN ? 'uploaded + deleted ✓' : hasMaps ? 'present (local build, not uploaded)' : 'missing — check sourcemap:true in vite.config.js');
