const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

const sacredCSS = `
.sacred-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.sacred-assistant.visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
`;

code = code + '\n' + sacredCSS;
fs.writeFileSync('css/style.css', code);
