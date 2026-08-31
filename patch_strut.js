const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /heroTinkerbell\.state = 'PAUSE_ON_BADGE_EDGE';[\s\S]*?if \(window\.celestialAudio\) window\.celestialAudio\.playChime\(852, 1\.2\);/,
  `heroTinkerbell.state = 'FLYING_TO_AEYE';
            heroTinkerbell.startX = walkEndX;
            heroTinkerbell.startY = badgeTopY;
            heroTinkerbell.progress = 0;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.edgePauseTime = 0;
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.facingLeft = false;

            if (heroLogo) heroLogo.classList.add('fairy-moon-glow');
            if (typeof window.startTreePortalSequence === 'function') window.startTreePortalSequence();
            
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 30, ['#FFD700', '#C77DFF', '#FFFFFF', '#00FFC8']);
            if (window.celestialAudio) window.celestialAudio.playChime(852, 1.2);`
);

fs.writeFileSync('js/main.js', code);
