const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');

css = css.replace(/\.assistant-sparkle-dot\s*\{\s*z-index:\s*20;\s*\}/g, `.assistant-sparkle-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 1.1rem;
  filter: drop-shadow(0 0 6px #FFD700);
  z-index: 20;
}`);

css = css.replace(/\.assistant-pulse-ring\s*\{\s*z-index:\s*5;\s*\}/g, `.assistant-pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 229, 212, 0.6);
  animation: assistant-pulse 2.5s ease-out infinite;
  pointer-events: none;
  z-index: 5;
}`);

fs.writeFileSync('css/style.css', css);
