const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const bubbleCode = `
        const thoughtBubble = document.getElementById('assistant-speech-bubble');
        const bubbleTxt = document.getElementById('assistant-bubble-text');
        if (thoughtBubble && bubbleTxt) {
          thoughtBubble.classList.remove('hidden', 'fading');
          thoughtBubble.style.opacity = '1';
          thoughtBubble.style.transform = 'translateY(0)';
          bubbleTxt.innerHTML = "✦ HI, I'M YOUR <span class=\\"aeye-brand\\"><span class=\\"aeye-a\\">a</span><span class=\\"aeye-eye\\">EYE</span></span> ASSISTANT. CLICK ME FOR ANY HELP YOU NEED. ✦";
          setTimeout(() => {
            thoughtBubble.classList.add('fading');
            setTimeout(() => thoughtBubble.classList.add('hidden'), 500);
          }, 4500);
        }
`;

// Replace in activateSacredAssistantWidget
code = code.replace(
  /\/\/ tipIndex = 0; showThoughtBubble\(\); removed so she stays quiet until interacted with/g,
  bubbleCode.trim()
);

fs.writeFileSync('js/main.js', code);
