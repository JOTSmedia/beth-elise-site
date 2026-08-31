const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// Fix Vanna White bubble: put it BELOW her because she is too close to the top nav
code = code.replace(
  /showBethSpeechBubble\("I'M SO GLAD YOU'RE HERE!", (.*?), 'top'\);/g,
  `showBethSpeechBubble("I'M SO GLAD YOU'RE HERE!", $1, 'bottom');`
);

// Fix Logo bubble: put it ABOVE her so it doesn't overlap the logo text to her right
code = code.replace(
  /showBethSpeechBubble\("HI, I'M BETH ELISE!", logoMoonX, logoMoonY, 'auto'\);/g,
  `showBethSpeechBubble("HI, I'M BETH ELISE!", logoMoonX, logoMoonY, 'top');`
);

fs.writeFileSync('js/main.js', code);
