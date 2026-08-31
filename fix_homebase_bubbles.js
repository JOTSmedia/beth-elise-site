const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// Replace the incorrect 'if (!heroTinkerbell.isFastScrolled) showBethSpeechBubble(...)' 
// with the exact correct logic from the original.

code = code.replace(
  /if \(\!heroTinkerbell\.isFastScrolled\) showBethSpeechBubble\("HI, I'M BETH ELISE!", heroTinkerbell\.x, heroTinkerbell\.y, "top"\);/g,
  `const msg = heroTinkerbell.isFastScrolled 
              ? "HI I'M BETH ELISE, WELCOME! USE MY aEYE IF YOU HAVE ANY QUESTIONS!" 
              : "NICE TO MEET YOU! MY aEYE ASSISTANT WILL TAKE CARE OF YOU NOW!";
            showBethSpeechBubble(msg, targetX, targetY, 'side-left');`
);

fs.writeFileSync('js/main.js', code);
