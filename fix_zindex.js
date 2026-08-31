const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf-8');

// 1. Toast z-index and mobile position
css = css.replace('z-index: 2000;\n  opacity: 0;', 'z-index: 100000;\n  opacity: 0;');

if (!css.includes('.toast { bottom: max')) {
  css += `\n\n/* Subagent Fix: Toast Mobile Placement */
@media (max-width: 768px) {
  .toast {
    bottom: max(120px, env(safe-area-inset-bottom) + 120px) !important;
  }
}\n`;
}

// 2. Aura modal z-index
css = css.replace('.aura-reading-modal {\n  position: fixed;\n  inset: 0;', '.aura-reading-modal {\n  position: fixed;\n  inset: 0;\n  z-index: 95000;');

// 3. Any other modals?
css = css.replace('.product-modal {\n  position: fixed;', '.product-modal {\n  position: fixed;\n  z-index: 95000;');
css = css.replace('.location-modal {\n  position: fixed;', '.location-modal {\n  position: fixed;\n  z-index: 95000;');
css = css.replace('.sacred-sound-modal {\n  position: fixed;', '.sacred-sound-modal {\n  position: fixed;\n  z-index: 95000;');
css = css.replace('.checkout-modal {\n  position: fixed;', '.checkout-modal {\n  position: fixed;\n  z-index: 95000;');


// 4. Chakra buttons z-index inside the section?
// The user said: "double check the buttons in the chakra"
// Let's ensure the chakra section has a proper z-index and pointer-events so it's not blocked by the canvas.
// Actually, the `#hero-avatar-canvas` has pointer-events: none; so clicks go through.
// What if there is another canvas blocking them?
// `#background-canvas` has z-index: -100
// `#crystal-ball-canvas` has z-index inside .crystal-ball-container

fs.writeFileSync('css/style.css', css);
console.log("Z-index fixes applied");
