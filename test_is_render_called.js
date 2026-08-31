const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const injection = `
      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {
        if (!window.__TEST_LOGGED) {
          global.console.log('updateAndRenderHeroTinkerbell is running, state:', heroTinkerbell.state, 'alpha:', heroTinkerbell.alpha);
          window.__TEST_LOGGED = true;
        }
`;

code = code.replace("      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {", injection);

fs.writeFileSync('test_actx_draw.js', code);
