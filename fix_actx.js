const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const targetStr = `        heroAvatarCanvas.height = Math.round(rect.height * dpr);
        if (aCtx && aCtx.setTransform) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }`;

const newStr = `        heroAvatarCanvas.height = Math.round(rect.height * dpr);
        if (aCtx && aCtx.setTransform) {
          aCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('js/main.js', code);
console.log('aCtx fixed!');
