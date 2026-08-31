const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf-8');

const target = `document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSparkle < 55 || activeSparkleCount >= 18) return;
      lastSparkle = now;
      activeSparkleCount++;

      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      const x = e.clientX;
      const y = e.clientY;`;

const replacement = `document.addEventListener('mousemove', (e) => { handleSparkleMove(e.clientX, e.clientY); });
    document.addEventListener('touchmove', (e) => { if(e.touches && e.touches[0]) handleSparkleMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    function handleSparkleMove(clientX, clientY) {
      const now = performance.now();
      if (now - lastSparkle < 55 || activeSparkleCount >= 18) return;
      lastSparkle = now;
      activeSparkleCount++;

      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      const x = clientX;
      const y = clientY;`;

js = js.replace(target, replacement);
fs.writeFileSync('js/main.js', js);
console.log("Sparkle touch listener added");
