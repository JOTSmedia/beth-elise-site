const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const oldResize = `      function resize() {
        const heroSection = document.querySelector('.hero');
        const heroW = (heroSection && heroSection.offsetWidth) || heroBgCanvas.offsetWidth || window.innerWidth;
        const heroH = (heroSection && heroSection.offsetHeight) || heroBgCanvas.offsetHeight || window.innerHeight;
        heroBgCanvas.width = heroW;
        heroBgCanvas.height = heroH;

        w = heroAvatarCanvas.width = window.innerWidth;
        h = heroAvatarCanvas.height = window.innerHeight;

        const navEl = document.querySelector('.nav');
        if (navEl) cachedNavBottom = navEl.getBoundingClientRect().bottom;

        updateHeroLayoutTargets(true);
      }`;

const newResize = `      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        // heroBgCanvas
        const bgRect = heroBgCanvas.getBoundingClientRect();
        heroBgCanvas.width = Math.round(bgRect.width * dpr);
        heroBgCanvas.height = Math.round(bgRect.height * dpr);
        if (bgCtx && bgCtx.setTransform) {
          bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // heroAvatarCanvas
        const rect = heroAvatarCanvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        console.assert(Math.abs(heroAvatarCanvas.getBoundingClientRect().height - h) < 1, 'canvas CSS height != logical height');
        
        heroAvatarCanvas.width = Math.round(rect.width * dpr);
        heroAvatarCanvas.height = Math.round(rect.height * dpr);
        if (ctx && ctx.setTransform) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const navEl = document.querySelector('.nav');
        if (navEl) cachedNavBottom = navEl.getBoundingClientRect().bottom;

        updateHeroLayoutTargets(true);
      }`;

if (code.includes(oldResize)) {
  fs.writeFileSync('js/main.js', code.replace(oldResize, newResize));
  console.log('Resize fixed!');
} else {
  console.log('Could not find resize func.');
}
