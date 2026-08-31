const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

// Find all addEventListener calls in main.js
const lines = js.split('\n');
lines.forEach((line, i) => {
  if (line.includes('addEventListener')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
});
