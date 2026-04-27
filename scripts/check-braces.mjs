import { readFileSync } from 'fs';
const src = readFileSync('C:/Users/brahm/OneDrive/Desktop/mindtranceform-app/src/App.jsx', 'utf8');

let depth = 0;
let inSingleStr = false, inDoubleStr = false, inTemplate = false;

for (let i = 0; i < src.length; i++) {
  const c = src[i];
  const prev = src[i - 1];

  if (inSingleStr) { if (c === "'" && prev !== '\\') inSingleStr = false; continue; }
  if (inDoubleStr) { if (c === '"' && prev !== '\\') inDoubleStr = false; continue; }
  if (inTemplate)  { if (c === '`') inTemplate = false; continue; }

  if (c === '`') { inTemplate = true; continue; }
  if (c === '"')  { inDoubleStr = true; continue; }
  if (c === "'")  { inSingleStr = true; continue; }
  if (c === '{') depth++;
  if (c === '}') depth--;
}
console.log('Final brace depth (should be 0):', depth);
