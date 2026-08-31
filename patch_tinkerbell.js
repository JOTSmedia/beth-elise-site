const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const injection = `
      let __tick = 0;
      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {
        __tick++;
        if (__tick % 60 === 0) {
          console.log('TINKERBELL TICK:', heroTinkerbell.state, 'alpha:', heroTinkerbell.alpha, 'w,h:', w, h, 'dpr:', Math.min(window.devicePixelRatio || 1, 2));
        }
`;

code = code.replace("      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {", injection);
fs.writeFileSync('js/main.js', code);
