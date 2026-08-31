const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf-8');

const target = `.assistant-avatar-btn,
.back-to-top-btn,
.chakra-emblem-btn,
.merch__card,
.aura-scan-btn {
  touch-action: manipulation;`;

const replacement = `.assistant-avatar-btn,
.back-to-top-btn,
.chakra-emblem-btn,
.chakra-hotspot-node,
.merch__card,
.aura-start-scan-btn,
.aura-modal-close,
.aura-rescan-btn,
.aura-reading-contact-btn {
  touch-action: manipulation;`;

css = css.replace(target, replacement);

fs.writeFileSync('css/style.css', css);
console.log("Fixed touch-action block");
