const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /if \(heroLogo\) heroLogo\.classList\.add\('fairy-moon-glow'\); \/\/ ✦ ILLUMINATE AND PULSE LOGO DURING VANNA WHITE PRESENTATION ✦\n\s*emitPixieDust\(heroTinkerbell\.x, heroTinkerbell\.y, 30, \['#FFD700', '#C77DFF', '#FFFFFF', '#00FFC8'\]\);/g,
  `if (heroLogo) heroLogo.classList.add('fairy-moon-glow'); // ✦ ILLUMINATE AND PULSE LOGO DURING VANNA WHITE PRESENTATION ✦
            if (typeof window.startTreePortalSequence === 'function') window.startTreePortalSequence();
            
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 30, ['#FFD700', '#C77DFF', '#FFFFFF', '#00FFC8']);`
);

fs.writeFileSync('js/main.js', code);
