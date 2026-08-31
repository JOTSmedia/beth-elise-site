const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const oldListener = `      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('orientationchange', () => {
        setTimeout(resize, 120);
      }, { passive: true });`;

const newListener = `      let resizeTimeout = null;
      let lastW = window.innerWidth;
      let lastH = window.innerHeight;
      window.addEventListener('resize', () => {
        const curW = window.innerWidth;
        const curH = window.innerHeight;
        const hDiff = Math.abs(curH - lastH);
        const wDiff = Math.abs(curW - lastW);
        if (wDiff === 0 && hDiff > 0 && hDiff < 120) {
          // iOS URL bar collapse/expand. Skip canvas thrash!
          return;
        }
        lastW = curW;
        lastH = curH;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
      }, { passive: true });
      window.addEventListener('orientationchange', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
      }, { passive: true });`;

if (code.includes(oldListener)) {
  fs.writeFileSync('js/main.js', code.replace(oldListener, newListener));
  console.log('Resize thrash fixed!');
} else {
  console.log('Could not find resize listener block.');
}
