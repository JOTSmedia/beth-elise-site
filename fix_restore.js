const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const restoreFunc = `
    function restoreAeyeHomebase() {
      const widget = document.getElementById('sacred-assistant-widget');
      const btn    = document.getElementById('assistant-avatar-btn');
      if (widget) {
        widget.classList.remove('aeye-in-flight');
        widget.classList.add('visible');
      }
      if (btn) {
        btn.style.opacity      = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.visibility    = 'visible';
        btn.removeAttribute('inert');
      }
    }
    window.restoreAeyeHomebase = restoreAeyeHomebase;
`;

code = code.replace("function initMainApp() {", restoreFunc + "\n    function initMainApp() {");

// Also add a 500ms safety timer after DOMContentLoaded (which calls initMainApp).
code = code.replace("initMainApp();\n});", "initMainApp();\n  setTimeout(restoreAeyeHomebase, 500);\n});");

fs.writeFileSync('js/main.js', code);
console.log('Restoration added!');
