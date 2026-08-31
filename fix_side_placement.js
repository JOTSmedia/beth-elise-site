const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const targetStr = `            if (preferredSide !== 'auto') {
              side = preferredSide;
            } else {
              // On desktop, use side placement to avoid covering vertical content like the tagline pill or logo.
              side = isFacingLeft ? 'side-left' : 'side-right';
            }`;

const newStr = `            if (preferredSide !== 'auto') {
              side = preferredSide;
            } else {
              if (window.innerWidth < 520) {
                side = (targetY < window.innerHeight * 0.33) ? 'bottom' : 'top';
              } else {
                side = isFacingLeft ? 'side-left' : 'side-right';
              }
            }`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('js/main.js', code);
console.log('Mobile side placement fixed!');
