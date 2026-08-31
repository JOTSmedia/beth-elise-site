const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// 1. Remove the "I'M SO GLAD YOU'RE HERE" bubble from Vanna White pause
code = code.replace(
  /showBethSpeechBubble\("I'M SO GLAD YOU'RE HERE!", heroTinkerbell\.x, heroTinkerbell\.y, 'bottom'\);\n\s*/g,
  ''
);

// 2. Revert the logo perch bubbles from 'top' back to 'auto'
code = code.replace(
  /showBethSpeechBubble\("HI, I'M BETH ELISE!", logoMoonX, logoMoonY, 'top'\);/g,
  `showBethSpeechBubble("HI, I'M BETH ELISE!", logoMoonX, logoMoonY, 'auto');`
);

code = code.replace(
  /showBethSpeechBubble\("HI, I'M BETH ELISE!", heroTinkerbell\.x, heroTinkerbell\.y, 'top'\);/g,
  `showBethSpeechBubble("HI, I'M BETH ELISE!", heroTinkerbell.x, heroTinkerbell.y, 'auto');`
);

fs.writeFileSync('js/main.js', code);
