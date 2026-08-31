const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const targetStr = `        const eyeCtx = avatarCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = avatarCanvas.getBoundingClientRect();
        const baseW = rect.width || 76;
        const baseH = rect.height || 76;
        
        avatarCanvas.width = baseW * dpr;
        avatarCanvas.height = baseH * dpr;
        
        // We scale the context ONCE so we can continue drawing in CSS pixels
        eyeCtx.scale(dpr, dpr);
        
        const eyeW = baseW;
        const eyeH = baseH;
        const eyeCenterX = eyeW * 0.5;
        const eyeCenterY = eyeH * 0.5;`;

const newStr = `        const eyeCtx = avatarCanvas.getContext('2d');
        let baseW = 76;
        let baseH = 76;

        function resizeSacredEye() {
          const dpr = window.devicePixelRatio || 1;
          const rect = avatarCanvas.getBoundingClientRect();
          baseW = rect.width || 76;
          baseH = rect.height || 76;
          avatarCanvas.width = baseW * dpr;
          avatarCanvas.height = baseH * dpr;
          if (eyeCtx && eyeCtx.setTransform) {
            eyeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
        }
        resizeSacredEye();
        window.addEventListener('resize', resizeSacredEye, { passive: true });
        window.addEventListener('orientationchange', () => setTimeout(resizeSacredEye, 120), { passive: true });`;

if (code.includes(targetStr)) {
  fs.writeFileSync('js/main.js', code.replace(targetStr, newStr));
  console.log('Sacred Eye resize fixed!');
} else {
  console.log('Could not find sacred eye setup block.');
}
