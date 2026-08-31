const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf-8');

const target = `            if (!eyeCtx || (!eyeIsVisible && window.scrollY > 1500)) return;`;
const replacement = `            if (!eyeCtx) return;
            if (!eyeIsVisible && window.scrollY > 1500) {
              requestAnimationFrame(updateAndRenderSacredEye);
              return;
            }`;

js = js.replace(target, replacement);
fs.writeFileSync('js/main.js', js);
console.log("Fixed loop termination bug");
