const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// Restore the STRUT_ON_BADGE transition back to PAUSE_ON_BADGE_EDGE
code = code.replace(
  /heroTinkerbell\.state = 'FLYING_TO_AEYE';\n\s*heroTinkerbell\.startX = walkEndX;\n\s*heroTinkerbell\.startY = badgeTopY;\n\s*heroTinkerbell\.progress = 0;\n\s*heroTinkerbell\.diveAngle = 0;\n\s*heroTinkerbell\.edgePauseTime = 0;\n\s*heroTinkerbell\.isStrutting = false;\n\s*heroTinkerbell\.facingLeft = false;\n\n\s*if \(heroLogo\) heroLogo\.classList\.add\('fairy-moon-glow'\);\n\s*if \(typeof window\.startTreePortalSequence === 'function'\) window\.startTreePortalSequence\(\);\n\s*emitPixieDust\(heroTinkerbell\.x, heroTinkerbell\.y, 30, \['#FFD700', '#C77DFF', '#FFFFFF', '#00FFC8'\]\);\n\s*if \(window\.celestialAudio\) window\.celestialAudio\.playChime\(852, 1\.2\);/g,
  `heroTinkerbell.state = 'PAUSE_ON_BADGE_EDGE';
            heroTinkerbell.x = walkEndX;
            heroTinkerbell.y = badgeTopY;
            heroTinkerbell.edgePauseTime = 0;
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.facingLeft = true; // Turn back towards letters in Vanna White pose
            if (heroLogo) heroLogo.classList.add('fairy-moon-glow'); // ✦ ILLUMINATE AND PULSE LOGO DURING VANNA WHITE PRESENTATION ✦
            if (typeof window.startTreePortalSequence === 'function') window.startTreePortalSequence();
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 30, ['#FFD700', '#C77DFF', '#FFFFFF', '#00FFC8']);
            if (window.celestialAudio) window.celestialAudio.playChime(852, 1.2);`
);

// We need to restore the fading inside PAUSE_ON_BADGE_EDGE
// Oh wait, PAUSE_ON_BADGE_EDGE was never deleted, it was just bypassed! Let's check it.
fs.writeFileSync('js/main.js', code);
