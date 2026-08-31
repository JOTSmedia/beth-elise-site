const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

const lines = js.split('\n');
let currentFunc = null;
let saveCount = 0;
let restoreCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Basic function detection
  const funcMatch = line.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) || line.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/) || line.match(/([a-zA-Z0-9_]+)\s*:\s*function/);
  
  if (funcMatch) {
    if (currentFunc && (saveCount !== restoreCount)) {
      console.log(`Unbalanced in ${currentFunc}: saves=${saveCount}, restores=${restoreCount}`);
    }
    currentFunc = funcMatch[1];
    saveCount = 0;
    restoreCount = 0;
  }
  
  // Count save/restore
  if (line.match(/\bctx\.save\(\)/) || line.match(/\bbgCtx\.save\(\)/) || line.match(/\btargetCtx\.save\(\)/) || line.match(/\beyeCtx\.save\(\)/)) {
    saveCount++;
  }
  if (line.match(/\bctx\.restore\(\)/) || line.match(/\bbgCtx\.restore\(\)/) || line.match(/\btargetCtx\.restore\(\)/) || line.match(/\beyeCtx\.restore\(\)/)) {
    restoreCount++;
  }
}

if (currentFunc && (saveCount !== restoreCount)) {
  console.log(`Unbalanced in ${currentFunc}: saves=${saveCount}, restores=${restoreCount}`);
}

