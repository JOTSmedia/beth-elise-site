const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const introTimingObj = `
      // PART 2: INTRO_TIMING Tuning
      const INTRO_TIMING = {
        orbDuration: 2.4,
        flyToLogo: 1.0,
        perchedLogo: 1.3,
        flyToBookBtn: 1.0,
        perchedBookBtn: 1.2,
        flyToBadge: 0.8,
        strutOnBadge: 2.2,
        pauseOnBadgeEdge: 1.4,
        flyToAeye: 0.9,
        flyToAeyeFast: 0.5,
        perchedOnAeye: 1.6,
        perchedOnAeyeFast: 1.0,
        crouch: 0.15,
        flight: 0.65
      };
`;

code = code.replace("function initMainApp() {", `function initMainApp() {\n${introTimingObj}`);

// We need to replace the progress calculations!
// orbDuration = 2.4 => progress += dt / INTRO_TIMING.orbDuration
code = code.replace(/heroTinkerbell\.progress \+= dt \/ 1\.8;/g, "heroTinkerbell.progress += dt / INTRO_TIMING.orbDuration;");

// flyToLogo = 1.0
code = code.replace(/heroTinkerbell\.progress \+= dt \/ 0\.85;/g, "heroTinkerbell.progress += dt / INTRO_TIMING.flyToLogo;");

// perchedLogo = 1.3
code = code.replace(/if \(pt >= 1\.0\) {/g, "if (pt >= INTRO_TIMING.perchedLogo) {");

// flyToBookBtn = 1.0 => (formerly dt / 0.65)
// flyToBadge = 0.8 => (formerly dt / 0.65)
// Wait! They both used the SAME divider! "sed -i '' -e 's|heroTinkerbell.progress += dt / 1.1;|heroTinkerbell.progress += dt / 0.65;|g' js/main.js"
code = code.replace(/heroTinkerbell\.progress \+= dt \/ 0\.65;/g, "heroTinkerbell.progress += dt / (heroTinkerbell.state === 'FLYING_TO_BADGE' ? INTRO_TIMING.flyToBadge : INTRO_TIMING.flyToBookBtn);");

// perchedBookBtn = 1.2
code = code.replace(/if \(heroTinkerbell\.perchedTime >= [0-9.]+\) {/g, "if (heroTinkerbell.perchedTime >= INTRO_TIMING.perchedBookBtn) {");

// strutOnBadge = 2.2 => (formerly dt / 1.3)
code = code.replace(/heroTinkerbell\.progress \+= dt \/ 1\.3;/g, "heroTinkerbell.progress += dt / INTRO_TIMING.strutOnBadge;");
code = code.replace(/const st = heroTinkerbell\.progress \* [0-9.]+;/g, "const st = heroTinkerbell.progress * INTRO_TIMING.strutOnBadge;");

// pauseOnBadgeEdge = 1.4 => Scale 1.1 / 0.3 crouch split
code = code.replace(/if \(pt < 0\.4\) {/g, "if (pt < INTRO_TIMING.pauseOnBadgeEdge * (1.1/1.4)) {");
code = code.replace(/const prepP = \(pt - 0\.4\) \/ 0\.35;/g, "const prepP = (pt - INTRO_TIMING.pauseOnBadgeEdge * (1.1/1.4)) / (INTRO_TIMING.pauseOnBadgeEdge * (0.3/1.4));");
code = code.replace(/if \(heroTinkerbell\.edgePauseTime >= 0\.75\) {/g, "if (heroTinkerbell.edgePauseTime >= INTRO_TIMING.pauseOnBadgeEdge) {");

// flyToAeye = 0.9 (fast 0.5)
code = code.replace(/const flightDuration = heroTinkerbell\.isFastScrolled \? 0\.4 : 1\.1;/g, "const flightDuration = heroTinkerbell.isFastScrolled ? INTRO_TIMING.flyToAeyeFast : INTRO_TIMING.flyToAeye;");

// perchedOnAeye = 1.6 (fast 1.0)
code = code.replace(/const perchLimit = heroTinkerbell\.isFastScrolled \? 1\.5 : 2\.2;/g, "const perchLimit = heroTinkerbell.isFastScrolled ? INTRO_TIMING.perchedOnAeyeFast : INTRO_TIMING.perchedOnAeye;");

// bethHighLeap
code = code.replace(/const CROUCH = 0\.14;/g, "const CROUCH = INTRO_TIMING.crouch;");
code = code.replace(/const FLIGHT = 0\.65;/g, "const FLIGHT = INTRO_TIMING.flight;");

// widget fallback
code = code.replace("setTimeout(revealWidget, 48000);", "setTimeout(revealWidget, 16000);");

// speech bubble times
code = code.replace("setTimeout(showThoughtBubble, 8000 + Math.random() * 5000);", "setTimeout(showThoughtBubble, 2000 + Math.random() * 2000);");
code = code.replace("}, 6000);", "}, 4500);");

fs.writeFileSync('js/main.js', code);
console.log('Timing fixed!');
