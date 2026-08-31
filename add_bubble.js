const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /if \(typeof window\.startTreePortalSequence === 'function'\) window\.startTreePortalSequence\(\);\n\s*emitPixieDust/g,
  `if (typeof window.startTreePortalSequence === 'function') window.startTreePortalSequence();
            showBethSpeechBubble("I'M SO GLAD YOU'RE HERE!", heroTinkerbell.x, heroTinkerbell.y, 'bottom');
            emitPixieDust`
);

// Also fix the other logo perch bubble
code = code.replace(
  /showBethSpeechBubble\("HI, I'M BETH ELISE!", heroTinkerbell\.x, heroTinkerbell\.y, 'auto'\);/g,
  `showBethSpeechBubble("HI, I'M BETH ELISE!", heroTinkerbell.x, heroTinkerbell.y, 'top');`
);

fs.writeFileSync('js/main.js', code);
