const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// 1. Add caching variables near the bubble functions
code = code.replace("function updateBethSpeechBubblePosition() {", "let cachedBubbleW = 240;\n      let cachedBubbleH = 58;\n\n      function updateBethSpeechBubblePosition() {");

// 2. Replace the reading inside updateBethSpeechBubblePosition
code = code.replace("const rw = gEl.offsetWidth || 240;\n            const rh = gEl.offsetHeight || 58;", "const rw = cachedBubbleW;\n        const rh = cachedBubbleH;");

// 3. Replace left/top with translate3d
const targetPos = `        gEl.style.left = clampedLeft + 'px';
        gEl.style.top = clampedTop + 'px';
        gEl.style.right = 'auto';
        gEl.style.bottom = 'auto';`;

const newPos = `        gEl.style.left = '0';
        gEl.style.top = '0';
        gEl.style.right = 'auto';
        gEl.style.bottom = 'auto';
        gEl.style.transform = \`translate3d(\${Math.round(clampedLeft)}px, \${Math.round(clampedTop)}px, 0)\`;`;

code = code.replace(targetPos, newPos);

// 4. In showBethSpeechBubble, read the size ONCE
const targetShow = `        if (gTxt) gTxt.innerHTML = \`✦ \${htmlFormatted} ✦\`;

        activeSpeechBubble.visible = true;
        activeSpeechBubble.text = cleanText;
        activeSpeechBubble.preferredSide = preferredSide;

        gEl.hidden = false;
        gEl.style.visibility = 'visible';
        updateBethSpeechBubblePosition(); // Immediate positioning
        gEl.classList.add('is-visible');`;

const newShow = `        if (gTxt) gTxt.innerHTML = \`✦ \${htmlFormatted} ✦\`;

        activeSpeechBubble.visible = true;
        activeSpeechBubble.text = cleanText;
        activeSpeechBubble.preferredSide = preferredSide;

        gEl.hidden = false;
        gEl.style.transform = ''; // reset before measuring
        cachedBubbleW = gEl.offsetWidth || 240;
        cachedBubbleH = gEl.offsetHeight || 58;
        gEl.style.visibility = 'visible';
        
        updateBethSpeechBubblePosition(); // Immediate positioning
        gEl.classList.add('is-visible');`;

code = code.replace(targetShow, newShow);

fs.writeFileSync('js/main.js', code);
console.log('Bubble transform fixed!');
