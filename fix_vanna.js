const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /showBethSpeechBubble\("I'M SO GLAD YOU'RE HERE!", heroTinkerbell\.x, heroTinkerbell\.y, 'bottom'\);/g,
  "// showBethSpeechBubble(\"I'M SO GLAD YOU'RE HERE!\", heroTinkerbell.x, heroTinkerbell.y, 'bottom'); // User explicitly removed this bubble"
);

fs.writeFileSync('js/main.js', code);
