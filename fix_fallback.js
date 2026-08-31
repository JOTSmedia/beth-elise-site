const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const targetStr = `          const aeyeWidget = cachedDOM.aeyeWidget;
          if (aeyeWidget) {
            const aeRect = aeyeWidget.getBoundingClientRect();
            if (aeRect.width > 0) {
              const rawAeX = aeRect.left + aeRect.width * 0.5 - cRect.left;
              const rawAeY = aeRect.top + aeRect.height * 0.5 - cRect.top;
              aeyeX = Math.max(36, Math.min(cw - 36, rawAeX));
              aeyeY = Math.max(36, Math.min(ch - 36, rawAeY));
            }
          }`;

const newStr = `          const aeyeWidget = cachedDOM.aeyeWidget;
          let orbSize = 76;
          if (aeyeWidget) {
            const aeRect = aeyeWidget.getBoundingClientRect();
            if (aeRect.width > 0) {
              orbSize = aeRect.width;
              const rawAeX = aeRect.left + aeRect.width * 0.5 - cRect.left;
              const rawAeY = aeRect.top + aeRect.height * 0.5 - cRect.top;
              const margin = orbSize / 2 + 8;
              aeyeX = Math.max(margin, Math.min(cw - margin, rawAeX));
              aeyeY = Math.max(margin, Math.min(ch - margin, rawAeY));
            } else {
              const btn = document.getElementById('assistant-avatar-btn');
              const widget = document.getElementById('sacred-assistant-widget');
              orbSize = parseFloat(window.getComputedStyle(btn).width) || 76;
              const inset = parseFloat(window.getComputedStyle(widget).right) || 24;
              aeyeX = cw - inset - orbSize / 2;
              aeyeY = ch - inset - orbSize / 2;
              const margin = orbSize / 2 + 8;
              aeyeX = Math.max(margin, Math.min(cw - margin, aeyeX));
              aeyeY = Math.max(margin, Math.min(ch - margin, aeyeY));
            }
          }`;

if (code.includes(targetStr)) {
  fs.writeFileSync('js/main.js', code.replace(targetStr, newStr));
  console.log('Fallback target fixed!');
} else {
  console.log('Could not find fallback target block.');
}
