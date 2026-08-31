const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

const startIdx = js.indexOf('function drawComprehensive3DLaserScan');
let braceCount = 0;
let started = false;
let endIdx = -1;

for (let i = startIdx; i < js.length; i++) {
  if (js[i] === '{') {
    braceCount++;
    started = true;
  } else if (js[i] === '}') {
    braceCount--;
  }
  if (started && braceCount === 0) {
    endIdx = i;
    break;
  }
}

const funcCode = js.substring(startIdx, endIdx + 1);
const saves = (funcCode.match(/\bctx\.save\(\)/g) || []).length;
const restores = (funcCode.match(/\bctx\.restore\(\)/g) || []).length;
console.log(`drawComprehensive3DLaserScan: saves=${saves}, restores=${restores}`);
