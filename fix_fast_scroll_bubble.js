const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /showBethSpeechBubble\("HI, I'M BETH ELISE!", heroTinkerbell\.x, heroTinkerbell\.y, "top"\);/g,
  "if (!heroTinkerbell.isFastScrolled) showBethSpeechBubble(\"HI, I'M BETH ELISE!\", heroTinkerbell.x, heroTinkerbell.y, \"top\");"
);

fs.writeFileSync('js/main.js', code);
