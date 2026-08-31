const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /const r = gEl\.getBoundingClientRect\(\);\s*const rw = r\.width \> 0 \? r\.width : \(gEl\.offsetWidth \|\| 240\);\s*const rh = r\.height \> 0 \? r\.height : \(gEl\.offsetHeight \|\| 58\);/g,
  "const rw = gEl.offsetWidth || 240;\n            const rh = gEl.offsetHeight || 58;"
);

// We should also look for 'const r = gEl.getBoundingClientRect()' and just replace it where it exists.
const targetStr = `            const r = gEl.getBoundingClientRect();
            const rw = r.width > 0 ? r.width : (gEl.offsetWidth || 240);
            const rh = r.height > 0 ? r.height : (gEl.offsetHeight || 58);`;
const newStr = `            const rw = gEl.offsetWidth || 240;
            const rh = gEl.offsetHeight || 58;`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('js/main.js', code);
console.log('Bubble measure fixed!');
