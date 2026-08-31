const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const targetStr = `            const rw = gEl.offsetWidth || 240;
            const rh = gEl.offsetHeight || 58;

            const mouthX = targetX + (isFacingLeft ? -6 : 6);
            const mouthY = targetY - 38;
            const headTop = targetY - 56;`;

const newStr = `            const rw = gEl.offsetWidth || 240;
            const rh = gEl.offsetHeight || 58;

            const s = (window.heroTinkerbell && window.heroTinkerbell.scale) || 1;
            const mouthX = targetX + (isFacingLeft ? -6 : 6) * s;
            const mouthY = targetY - 38 * s;
            const headTop = targetY - 56 * s;`;

code = code.replace(targetStr, newStr);

code = code.replace("targetX - 52", "targetX - 52 * s");
code = code.replace("targetX - 32", "targetX - 32 * s");
code = code.replace("targetX + 32", "targetX + 32 * s");

fs.writeFileSync('js/main.js', code);
console.log('Bubble scale fixed!');
