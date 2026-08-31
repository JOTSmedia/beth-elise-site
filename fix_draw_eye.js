const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const regex = /function drawOrganicEye\(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false\) \{([\s\S]*?)\/\/ end eye translate\n\s*\}/;

const match = code.match(regex);
if (match) {
  let body = match[1];

  // We need to implement caching and detail reduction.
  const replacementBody = `
      // 3C optimizations: Cache static gradients
      if (!ctx._eyeCache || ctx._eyeCache.r !== r) {
        ctx._eyeCache = { r: r };
        const aw = r * 1.58;
        const ah = r * 0.96;
        
        const scleraGrad = ctx.createRadialGradient(-r * 0.15, -r * 0.15, 2, 0, 0, r);
        scleraGrad.addColorStop(0, '#FFFFFF');
        scleraGrad.addColorStop(0.55, '#FAF6FE');
        scleraGrad.addColorStop(0.85, '#E6D9F2');
        scleraGrad.addColorStop(1, '#D1B8E8');
        ctx._eyeCache.scleraGrad = scleraGrad;

        const irisGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.48);
        irisGrad.addColorStop(0, '#9D4EDD');
        irisGrad.addColorStop(0.5, '#7B2CBF');
        irisGrad.addColorStop(1, '#3C096C');
        ctx._eyeCache.irisGrad = irisGrad;

        const dpr = window.devicePixelRatio || 1;
        const hc = navigator.hardwareConcurrency || 4;
        ctx._eyeCache.fibers = (dpr >= 3 || hc <= 4) ? 24 : 40;
        ctx._eyeCache.lashes = (dpr >= 3 || hc <= 4) ? 12 : 18;
      }
      
      const cache = ctx._eyeCache;
      const aw = r * 1.58;
      const ah = r * 0.96;

      ctx.save();
      ctx.translate(cx, cy);
      
      // 1. Asymmetric Natural Almond Eye Outline Clip
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-aw * 0.50, 0);
      ctx.bezierCurveTo(-aw * 0.32, -ah * 0.60, aw * 0.16, -ah * 0.54, aw * 0.50, -ah * 0.04);
      ctx.bezierCurveTo(aw * 0.22, ah * 0.52, -aw * 0.30, ah * 0.44, -aw * 0.50, 0);
      ctx.closePath();
      ctx.clip();

      // 2. Sclera with soft 3D Spherical Volumetric Gradients
      ctx.fillStyle = cache.scleraGrad;
      ctx.fillRect(-aw * 0.65, -ah * 0.65, aw * 1.3, ah * 1.3);

      // Subtle shadow under top eyelid
      const shadowGrad = ctx.createLinearGradient(0, -ah * 0.5, 0, 0);
      shadowGrad.addColorStop(0, 'rgba(20, 0, 40, 0.45)');
      shadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(-aw * 0.5, -ah * 0.5, aw, ah * 0.6);

      // 3. Translate to Iris Position
      ctx.save();
      ctx.translate(gazeX * r * 0.3, gazeY * r * 0.2);

      // Render Iris
      const irisR = r * 0.48;
      if (typeof imgPhotorealisticIris !== 'undefined' && imgPhotorealisticIris.complete && imgPhotorealisticIris.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, irisR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(imgPhotorealisticIris, -irisR * 1.15, -irisR * 1.15, irisR * 2.3, irisR * 2.3);
        ctx.restore();
      } else {
        ctx.fillStyle = cache.irisGrad;
        ctx.beginPath();
        ctx.arc(0, 0, irisR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0aaff';
        ctx.lineWidth = irisR * 0.05;
        ctx.stroke();
      }

      // Procedural Iris Fibers (optimized)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < cache.fibers; i++) {
        const a = (i / cache.fibers) * Math.PI * 2;
        const inner = pupilRadius + 2;
        const outer = irisR * 0.85 + Math.sin(i * 3) * (irisR * 0.1);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        ctx.stroke();
      }

      // Pupil
      const pPulse = isLocked ? (Math.sin(now * 0.005) * 0.05 + 1) : 1;
      const currentPupilR = pupilRadius * pPulse;
      ctx.fillStyle = '#0a0a1a';
      ctx.beginPath();
      ctx.arc(0, 0, currentPupilR, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Core Catchlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(-currentPupilR * 0.4, -currentPupilR * 0.4, currentPupilR * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Environmental reflection
      const reflGrad = ctx.createLinearGradient(-irisR, -irisR, irisR, irisR);
      reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      reflGrad.addColorStop(0.5, 'transparent');
      reflGrad.addColorStop(1, 'rgba(0, 255, 200, 0.1)');
      ctx.fillStyle = reflGrad;
      ctx.beginPath();
      ctx.arc(0, 0, irisR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // restore iris translation

      // 4. Eyelid Blink Cover
      if (blinkPhase > 0) {
        ctx.fillStyle = '#2A1A4A';
        const coverY = -ah * 0.6 + (ah * 1.2 * blinkPhase);
        ctx.fillRect(-aw * 0.6, -ah * 0.6, aw * 1.2, coverY - (-ah * 0.6));
      }

      ctx.restore(); // Restore Almond Clip

      // 5. Couture Gold Eyelid Rim
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = Math.max(1, r * 0.03);
      ctx.beginPath();
      ctx.moveTo(-aw * 0.50, 0);
      ctx.bezierCurveTo(-aw * 0.32, -ah * 0.60, aw * 0.16, -ah * 0.54, aw * 0.50, -ah * 0.04);
      ctx.bezierCurveTo(aw * 0.22, ah * 0.52, -aw * 0.30, ah * 0.44, -aw * 0.50, 0);
      ctx.stroke();

      // Eyelashes (optimized)
      ctx.strokeStyle = 'rgba(20, 10, 30, 0.9)';
      ctx.lineWidth = Math.max(1, r * 0.02);
      ctx.lineCap = 'round';
      if (blinkPhase < 0.9) {
        for (let i = 0; i < cache.lashes; i++) {
          const t = i / (cache.lashes - 1);
          // Only top lashes for now
          const lx = -aw * 0.4 + (aw * 0.8 * t);
          let ly = 0;
          if (t < 0.5) {
            ly = -ah * 0.55 * (t * 2);
          } else {
            ly = -ah * 0.55 * ((1 - t) * 2);
          }
          const lashLen = (r * 0.15) * (Math.sin(t * Math.PI) * 0.5 + 0.5);
          const angle = -Math.PI * 0.5 + (t - 0.5) * 1.5;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + Math.cos(angle) * lashLen, ly + Math.sin(angle) * lashLen);
          ctx.stroke();
        }
      }

      ctx.restore(); // end eye translate
`;

  code = code.replace(match[0], `function drawOrganicEye(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false) {${replacementBody}\n    }`);
  fs.writeFileSync('js/main.js', code);
  console.log('drawOrganicEye optimized!');
} else {
  console.log('Could not find drawOrganicEye block.');
}
